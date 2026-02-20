# Rendering & Data Performance Analysis — Agent Store & Website

This document summarizes findings from analyzing the codebase and provides concrete steps to **increase the speed of rendering data and components**, with a focus on the **Agent Store** and the rest of the website.

---

## Executive summary

| Area | Current state | Impact |
|------|----------------|--------|
| **Agent list** | Client-only fetch, `cache: "no-store"`, no route skeleton | Slow first paint, no cache reuse |
| **Agent detail** | Sequential server fetches, no streaming, 2k-line body | Blocking TTFB, large JS bundle |
| **Loading UIs** | `loading.tsx` returns `null` for agents | No perceived feedback |
| **Images** | `images.unoptimized: true` in Next.js | Heavier payloads, slower LCP |
| **Heavy components** | No `next/dynamic` or `React.lazy` | Large initial bundles |
| **List items** | `AgentCard` not memoized | Unnecessary re-renders on filter/page change |
| **Data layer** | No SWR/React Query | No request dedup, no client cache |

---

## 1. Agent Store — Data fetching

### 1.1 Agents list (`app/agents/page.tsx`)

- **Current:** Entire page is `"use client"`. Data is fetched in `useEffect` from `https://agents-store.onrender.com/api/agents` with `cache: "no-store"`.
- **Issues:**
  - No server-side rendering of the list → user sees loading until client fetch completes.
  - No caching → every visit refetches.
  - Duplicate fetch logic: `fetchAgents()` at module scope and another `fetch()` inside `useEffect`.

**Recommendations:**

1. **Option A — Prefer Server Components for initial data**
   - Create a small server component (or server `page.tsx`) that fetches agents with **Next.js fetch cache** (e.g. `next: { revalidate: 60 }` or `cache: 'force-cache'`) and passes them as initial data to a client component that handles filters/pagination/search.
   - This gives faster first paint and allows caching at the edge.

2. **Option B — Keep client fetch but add a data layer**
   - Use **SWR** or **React Query** for `/api/agents` (and `/api/models`):
     - Request deduplication.
     - Client-side cache and optional revalidate.
     - Same data reused when navigating back to the agents page.

3. **Centralize and cache at API layer**
   - Add a Next.js API route (e.g. `app/api/agents/route.ts`) that proxies to the backend and uses `fetch(..., { next: { revalidate: 60 } })`.
   - Point the client (and any server code) to `/api/agents` instead of the external URL. This gives a single place to add caching and logging.

---

### 1.2 Agent detail (`app/agents/[id]/page.tsx`)

- **Current:** Server component that:
  1. Calls `fetchAgentDetail(agentId)` (which also fetches full agents list to check approval).
  2. Calls `getNextPrevAndRelated(id)`, which again fetches the full agents list and then either `fetchBundledAgents` or `fetchSimilarAgents`.
- All use `cache: "no-store"`.

**Issues:**

- Sequential waterfall: detail → full list → bundled/similar.
- Full agents list is fetched **twice** (inside `fetchAgentDetail` and inside `getNextPrevAndRelated`).
- No caching → repeated visits to the same agent refetch everything.
- `readReadmeFile()` is a synchronous `readFileSync` on the server; can add latency under load.

**Recommendations:**

1. **Parallelize fetches**
   - Use `Promise.all` to run in parallel:
     - `fetchAgentDetail(agentId)`
     - `fetch(".../api/agents")` once
     - `fetchBundledAgents(agentId)` and `fetchSimilarAgents(agentId)` (or run bundled first and only run similar if bundled is empty).
   - Derive approval and next/prev/related from the single agents list response.

2. **Cache**
   - Use Next.js fetch cache for detail and list, e.g. `{ next: { revalidate: 60 } }`, so repeat views and list↔detail navigation are fast.

3. **Streaming**
   - Use React `Suspense` and optionally stream the page: render hero/overview first, then wrap “Related” / “Next/Prev” in `<Suspense>` with a fallback so the main content appears before secondary data.

4. **README**
   - Avoid blocking the main response: read README in a separate async path or cache it, or move to a client fetch for the docs section so the shell can send quickly.

---

## 2. Agent Store — Component & bundle performance

### 2.1 Loading states

- **Current:** `app/agents/loading.tsx` and `app/agents/[id]/loading.tsx` both `return null`.
- **Effect:** No skeleton or spinner while the route loads, so the page feels unresponsive.

**Recommendations:**

1. **Agents list:** Use the existing `AgentCardSkeleton` (or a grid of them) in `app/agents/loading.tsx` so users see a list skeleton immediately.
2. **Agent detail:** Add a simple skeleton (e.g. hero block + a few lines for body) in `app/agents/[id]/loading.tsx`.

This improves **perceived** performance without changing data speed.

---

### 2.2 Large components (code splitting)

- **Current:** No use of `next/dynamic` or `React.lazy` in the repo.
- **Heavy modules:**
  - `app/agents/page.tsx` (~2.3k lines) — list, filters, tabs, search, carousels.
  - `app/agents/chat/page.tsx` (~3.4k lines) — full chat UI.
  - `app/agents/[id]/AgentDetailsBody.tsx` (~2k lines) — workflow, demo, docs, accordions.
  - `components/crayon-header.tsx` (~967 lines) — global nav.

**Recommendations:**

1. **Agent detail**
   - Lazy-load below-the-fold or tab content with `next/dynamic`:
     - e.g. `AgentDetailsBody` or sections like “How it works”, “Demo assets”, “Documentation”, “Related agents” with `dynamic(..., { loading: () => <SectionSkeleton /> })`.
   - This reduces the initial JS for the detail page and speeds up TTI.

2. **Agents list**
   - Consider `dynamic` for heavy, non-critical UI (e.g. `FilterSidebar`, or the AI-search panel) so the core grid and first paint are not blocked.

3. **Chat**
   - Load the chat page shell first; lazy-load the heavy chat UI (thread list, message list, voice, markdown) so the route becomes interactive sooner.

4. **Header**
   - If the header has heavy dropdowns or modals, load those with `dynamic` so the critical nav bar renders first.

---

### 2.3 List rendering (Agent cards)

- **Current:** `AgentCard` is not wrapped in `React.memo`. The agents list has many `useState`/`useMemo` values; any state change (filters, pagination, search) can re-render all visible cards.
- **Current:** Pagination is already in-memory with `PAGE_SIZE = 9`, so only 9 cards are in the DOM at a time (good).

**Recommendations:**

1. **Memoize `AgentCard`**
   - Wrap with `React.memo(AgentCard)` (and ensure props are stable where possible). This reduces re-renders when the parent state updates but the list slice is unchanged.

2. **Optional: virtual list**
   - If you later show many cards at once (e.g. no pagination or very large page size), consider a virtualized list (e.g. `@tanstack/react-virtual` or similar) so only visible rows are mounted.

---

## 3. Image and asset performance

- **Current:** `next.config.mjs` has `images: { unoptimized: true }`. Next.js does not optimize images; full-size assets are served.
- **Effect:** Larger bytes and slower LCP, especially on the agents list (many card images) and detail (demo assets).

**Recommendations:**

1. **Enable Next.js image optimization**
   - Set `unoptimized: false` (or remove it) and keep `remotePatterns` for S3 and other external domains. Ensure all agent images use the Next.js `<Image>` component with proper `width`/`height` or `fill` and `sizes` where applicable.

2. **Agent cards**
   - Use `<Image>` with reasonable `sizes` (e.g. one-third width on large screens) and priority only for the first few cards if needed.

3. **Agent detail**
   - Use `<Image>` for demo assets and workflow images; avoid raw `<img>` where possible so the optimizer can serve WebP/AVIF and sized variants.

---

## 4. Caching strategy (summary)

| Resource | Current | Suggested |
|----------|---------|-----------|
| Agents list API | `cache: "no-store"` | Next.js `revalidate: 60` (or proxy via route and cache there) |
| Agent detail API | `cache: "no-store"` | `revalidate: 60` |
| Full agents list (for approval/next/prev) | Fetched twice per detail load | Fetch once, reuse in parallel with detail + related |
| Client | No data library | SWR or React Query for list/detail to dedupe and cache on client |

---

## 5. Website-wide (beyond Agent Store)

- **Root layout:** Already uses `Suspense` around navbar, footer, modals — good. Keep one clear fallback (e.g. minimal “Loading…” or skeleton) so layout doesn’t flash.
- **Other pages that call the agents API** (e.g. industry banking, wishlists, dashboard, chat): Prefer a **shared data layer** (SWR/React Query or a small hook that calls your Next.js API route). That way, once the list is loaded on any page, others can reuse it.
- **Heavy or route-specific components:** Apply the same pattern: `next/dynamic` for below-the-fold or secondary UI to keep initial bundles smaller and first paint fast.

---

## 6. Implementation priority

Suggested order of work for maximum impact with reasonable effort:

1. **Quick wins**
   - Add real loading skeletons in `app/agents/loading.tsx` and `app/agents/[id]/loading.tsx`.
   - Memoize `AgentCard` with `React.memo`.

2. **Data & caching**
   - Introduce a Next.js API route for agents (and optionally models) with `revalidate` and point the agents page (and others) to it.
   - Parallelize and deduplicate agent-detail fetches; use one agents list response for approval and next/prev/related.

3. **Code splitting**
   - Lazy-load `AgentDetailsBody` or its heaviest sections with `next/dynamic`.
   - Lazy-load heavy parts of the chat page and, if needed, parts of the header.

4. **Images**
   - Turn off `unoptimized` and use `<Image>` with proper `sizes` for agent and demo assets.

5. **Client data layer**
   - Add SWR or React Query for agents list and detail for deduplication, caching, and smoother navigation.

---

## 7. Files to change (quick reference)

| Goal | Files |
|------|--------|
| Loading skeletons | `app/agents/loading.tsx`, `app/agents/[id]/loading.tsx` |
| Memoize cards | `components/agent-card.tsx` |
| API route + cache | New: `app/api/agents/route.ts` (and optionally `app/api/models/route.ts`); then `app/agents/page.tsx`, `app/agents/[id]/page.tsx` |
| Parallel + cache detail | `app/agents/[id]/page.tsx` (fetchAgentDetail, getNextPrevAndRelated) |
| Dynamic import detail body | `app/agents/[id]/AgentDetailsContent.tsx` or `page.tsx` |
| Image optimization | `next.config.mjs`; replace raw `<img>` with `<Image>` where applicable in agent list and detail |

This should give a clear path to **faster rendering and data loading** for the Agent Store and the rest of the site, with the biggest gains from caching, parallel fetches, loading UIs, and code splitting.

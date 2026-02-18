"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef, useMemo } from "react"
import { ArrowUpRight, ChevronLeft, Heart, Search, Share2 } from "lucide-react"
import { TrendsSection } from "@/components/banking/sections/trends-section"
import type { IndustryBankingConfig, IndustryBankingCard } from "./config"

const AGENTS_API_URL = "https://agents-store.onrender.com/api/agents"

type ApiAgent = {
  agent_id: string
  agent_name: string
  description: string
  tags: string | null
  by_value?: string | null
  by_capability?: string | null
  by_persona?: string | null
  admin_approved?: string | null
}

/** Featured carousel: exact API agent names (order: LEA, Account Opening, NPA) */
const FEATURED_AGENT_NAMES = [
  "LEA Notice Assistant",
  "Account Opening Automation",
  "NPA Valuation Assistant",
]
/** Slug for each featured agent (for /agents/[slug]) when API doesn't return a match */
const FEATURED_AGENT_SLUGS = ["lea-notice-assistant", "account-opening-automation", "npa-valuation-assistant"]
/** Default descriptions when API has no match */
const FEATURED_AGENT_DESCRIPTIONS: Record<string, string> = {
  "LEA Notice Assistant": "Legal entity and agreement notice assistant.",
  "Account Opening Automation": "Streamlined account opening and onboarding workflows.",
  "NPA Valuation Assistant": "NPA valuation and portfolio management assistant.",
}

/** Search agents grid: exact names from DB (API match = use agent_id for redirect) */
const SEARCH_AGENT_NAMES = [
  "Travel AI",
  "OMP(Offer Management Platform)",
  "Test Data Mangement",
  "Controls Agent",
  "Data Studio",
  "CXO Concierge",
  "LEA Notice Assistant",
  "Account Opening Automation",
  "NPA Valuation Assistant",
  "Accounts Payable Automation",
  "Wealth RM Assistant",
]
/** Slugs for redirect when API has no match */
const SEARCH_AGENT_SLUGS = [
  "travel-ai",
  "omp",
  "test-data",
  "controls-agent",
  "data-studio",
  "cxo-concierge",
  "lea-notice-assistant",
  "account-opening-automation",
  "npa-valuation-assistant",
  "accounts-payable-automation",
  "wealth-rm-assistant",
]
/** Alternate names from DB for API matching (e.g. "OMP (Offer Management Platform)" with space, "Test Data Management" spelling, "Controls Agents") */
const SEARCH_AGENT_ALTERNATE_NAMES: (string | null)[] = [
  null,
  "OMP (Offer Management Platform)",
  "Test Data Management",
  "Controls Agents",
  null,
  null,
  null,
  null,
  null,
  null,
  null,
]
/** Known agent IDs from DB when API match fails (OMP=154, Test Data Management=012, Controls Agent=016) */
const SEARCH_AGENT_KNOWN_IDS: (string | null)[] = [
  null,
  "154",
  "012",
  "016",
  null,
  null,
  null,
  null,
  null,
  null,
  null,
]
/** Default descriptions when API has no match */
const SEARCH_AGENT_DESCRIPTIONS: Record<string, string> = {
  "Travel AI": "AI-powered travel assistant for bookings, itineraries, and recommendations.",
  "OMP(Offer Management Platform)": "Offer management platform for streamlined workflows.",
  "Test Data Mangement": "Generate and manage test data for QA and development.",
  "Controls Agent": "Governance and controls automation for compliance and risk.",
  "Data Studio": "Visual analytics and data exploration for business insights.",
  "CXO Concierge": "Executive-level assistant for strategy, reporting, and decision support.",
  "LEA Notice Assistant": "Legal entity and agreement notice assistant.",
  "Account Opening Automation": "Streamlined account opening and onboarding workflows.",
  "NPA Valuation Assistant": "NPA valuation and portfolio management assistant.",
  "Accounts Payable Automation": "Accounts payable automation and invoice processing.",
  "Wealth RM Assistant": "Wealth and relationship management for advisors and clients.",
}

const CATEGORY_ICON_SRC: Record<string, string> = {
  "Workflows & Automations": "/img/agents/workflows-icon.png",
  "AI Research Prompts": "/img/agents/research-icon.png",
  Sequences: "/img/agents/sequences-icon.png",
  Conversations: "/img/agents/conversations-icon.png",
}

/** Render a line with certain phrases in bold */
function PartnershipBullet({ text, bold }: { text: string; bold?: readonly string[] }) {
  if (!bold?.length) return <>{text}</>
  let remaining = text
  const parts: React.ReactNode[] = []
  for (const b of bold) {
    const i = remaining.indexOf(b)
    if (i === -1) continue
    parts.push(remaining.slice(0, i))
    parts.push(<strong key={b + i}>{b}</strong>)
    remaining = remaining.slice(i + b.length)
  }
  parts.push(remaining)
  return <>{parts}</>
}

type Props = {
  config: IndustryBankingConfig
  /** Optional: base path for back link when on a bank-specific page (e.g. /industry/banking) */
  backToBankingBase?: boolean
}

const FEATURED_AGENT_GRADIENTS = [
  "linear-gradient(84.65deg, #062D19 7.68%, #00B155 94.52%), linear-gradient(77.09deg, rgba(0, 0, 0, 0) 5.57%, rgba(36, 4, 31, 0.4) 98.1%)",
  "linear-gradient(84.65deg, #062D19 7.68%, #007C98 94.52%)",
  "linear-gradient(84.65deg, #10062D 7.68%, #007C98 94.52%)",
  "linear-gradient(84.65deg, #062D19 7.68%, #00B155 94.52%)",
  "linear-gradient(84.65deg, #062D19 7.68%, #007C98 94.52%)",
  "linear-gradient(84.65deg, #10062D 7.68%, #007C98 94.52%)",
] as const

const FEATURED_AGENT_CARD_IMAGE = "/img/carousel-card-campaign.png"

const PAGE_SECTIONS_ALL = [
  { id: "overview", label: "Overview" },
  { id: "ai-mega-trends", label: "AI Mega Trends" },
  { id: "partnership", label: "Partnership" },
  { id: "featured-agents", label: "Featured Agents" },
  { id: "search-agents", label: "Search Agents" },
] as const

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
}

export function IndustryBankingContent({ config, backToBankingBase = false }: Props) {
  const pageSections = useMemo(
    () => (config.partnership ? PAGE_SECTIONS_ALL : PAGE_SECTIONS_ALL.filter((s) => s.id !== "partnership")),
    [config.partnership]
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [featuredCarouselPage, setFeaturedCarouselPage] = useState(0)
  const featuredCarouselRef = useRef<HTMLDivElement>(null)
  const [partnershipTab, setPartnershipTab] = useState(0)
  const [apiAgents, setApiAgents] = useState<ApiAgent[]>([])
  const [agentsLoading, setAgentsLoading] = useState(true)
  const partnershipTabsContainerRef = useRef<HTMLDivElement>(null)
  const partnershipTabRefs = useRef<Map<number, HTMLButtonElement>>(new Map())
  const [partnershipIndicatorStyle, setPartnershipIndicatorStyle] = useState<{ left: number; width: number } | null>(null)
  const [partnershipGreyLineStyle, setPartnershipGreyLineStyle] = useState<{ left: number; width: number } | null>(null)

  useEffect(() => {
    if (!partnershipTabsContainerRef.current) return
    const tabEl = partnershipTabRefs.current.get(partnershipTab)
    if (!tabEl) {
      setPartnershipIndicatorStyle(null)
      return
    }
    const timer = setTimeout(() => {
      if (!partnershipTabsContainerRef.current || !tabEl) return
      const containerRect = partnershipTabsContainerRef.current.getBoundingClientRect()
      const tabRect = tabEl.getBoundingClientRect()
      setPartnershipIndicatorStyle({ left: tabRect.left - containerRect.left, width: tabRect.width })
    }, 0)
    return () => clearTimeout(timer)
  }, [partnershipTab])

  const partnershipPhasesLength = config.partnership?.phases.length ?? 0
  useEffect(() => {
    if (!partnershipTabsContainerRef.current || partnershipPhasesLength === 0) return
    const timer = setTimeout(() => {
      if (!partnershipTabsContainerRef.current) return
      const containerRect = partnershipTabsContainerRef.current.getBoundingClientRect()
      const first = partnershipTabRefs.current.get(0)
      const last = partnershipTabRefs.current.get(partnershipPhasesLength - 1)
      if (first && last) {
        const firstRect = first.getBoundingClientRect()
        const lastRect = last.getBoundingClientRect()
        setPartnershipGreyLineStyle({ left: firstRect.left - containerRect.left, width: lastRect.right - firstRect.left })
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [partnershipTab, partnershipPhasesLength])

  useEffect(() => {
    let cancelled = false
    fetch(AGENTS_API_URL, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch agents: ${res.status}`)
        return res.json()
      })
      .then((data: { agents?: ApiAgent[] }) => {
        if (cancelled) return
        const list = data?.agents ?? []
        setApiAgents(list.filter((a) => a.admin_approved === "yes"))
      })
      .catch(() => {
        if (!cancelled) setApiAgents([])
      })
      .finally(() => {
        if (!cancelled) setAgentsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const scheduleObservation = (callback: () => void) => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(callback, { timeout: 200 })
      } else {
        setTimeout(callback, 100)
      }
    }
    const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    const observer = new IntersectionObserver(
      (entries) => {
        requestAnimationFrame(() => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            if (entry.target.classList.contains("fade-in-section")) entry.target.classList.add("fade-in-visible")
            else if (entry.target.classList.contains("slide-in-left")) entry.target.classList.add("slide-in-visible")
            else if (entry.target.classList.contains("slide-in-right")) entry.target.classList.add("slide-in-visible")
            else if (entry.target.classList.contains("scale-in")) entry.target.classList.add("scale-in-visible")
            else if (entry.target.classList.contains("fade-in-blur")) entry.target.classList.add("fade-in-blur-visible")
            else if (entry.target.classList.contains("stagger-item")) entry.target.classList.add("stagger-visible")
            observer.unobserve(entry.target)
          })
        })
      },
      observerOptions
    )
    const observeElements = () => {
      document.querySelectorAll(".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item").forEach((el) => observer.observe(el))
    }
    const reobserveStaggerItems = () => {
      requestAnimationFrame(() => {
        document.querySelectorAll(".stagger-item:not(.stagger-visible)").forEach((el) => observer.observe(el))
      })
    }
    scheduleObservation(observeElements)
    const onReobserve = () => reobserveStaggerItems()
    window.addEventListener("banking-reobserve", onReobserve)
    return () => {
      window.removeEventListener("banking-reobserve", onReobserve)
      document.querySelectorAll(".fade-in-section, .slide-in-left, .slide-in-right, .scale-in, .fade-in-blur, .stagger-item").forEach((el) => observer.unobserve(el))
      observer.disconnect()
    }
  }, [])

  const parts = config.featuresStr.split(";").map((s) => s.trim()).filter(Boolean)
  const featuresHeading = parts[0] ?? "Key capabilities"
  const featuresList = parts.length > 1 ? parts.slice(1) : []
  const featuresFallback = featuresList.map((item) => {
    const dashMatch = item.match(/^([^–\-]{2,80})\s*[–\-]\s*(.+)$/)
    if (dashMatch) return { title: dashMatch[1].trim(), description: dashMatch[2].trim(), id: undefined as string | undefined }
    return { title: item, description: "", id: undefined as string | undefined }
  })

  const featuredAgents = useMemo(() => {
    return FEATURED_AGENT_NAMES.map((name, i) => {
      const a = apiAgents.find((x) => x.agent_name.trim().toLowerCase() === name.trim().toLowerCase())
      if (a) {
        return { title: a.agent_name, description: a.description || "", id: a.agent_id }
      }
      return {
        title: name,
        description: FEATURED_AGENT_DESCRIPTIONS[name] || "",
        id: FEATURED_AGENT_SLUGS[i],
      }
    })
  }, [apiAgents])

  const searchAgentCards = useMemo((): IndustryBankingCard[] => {
    const normalize = (s: string) => s.trim().toLowerCase()
    return SEARCH_AGENT_NAMES.map((name, i) => {
      const alt = SEARCH_AGENT_ALTERNATE_NAMES[i]
      const namesToTry = alt ? [name, alt] : [name]
      const a = apiAgents.find((x) => namesToTry.some((n) => normalize(x.agent_name) === normalize(n)))
      if (a) {
        const category = a.tags ? a.tags.split(",").map((t) => t.trim()).filter(Boolean)[0] : "Agents"
        return {
          id: a.agent_id,
          title: a.agent_name,
          description: a.description || undefined,
          author: a.by_value?.trim() || "BY CRAYON DATA",
          category: category || "Agents",
          businessFunction: a.by_persona?.trim() || a.by_capability?.trim() || "Operations",
        }
      }
      const fallbackId = SEARCH_AGENT_KNOWN_IDS[i] ?? SEARCH_AGENT_SLUGS[i]
      return {
        id: fallbackId,
        title: name,
        description: SEARCH_AGENT_DESCRIPTIONS[name] || undefined,
        author: "BY CRAYON DATA",
        category: "Agents",
        businessFunction: "Operations",
      }
    })
  }, [apiAgents])

  const cardsForGrid = searchAgentCards
  const q = searchQuery.trim().toLowerCase()
  const filteredCards = cardsForGrid.filter((card) => {
    return !q || card.title.toLowerCase().includes(q) || card.category.toLowerCase().includes(q) || card.businessFunction.toLowerCase().includes(q)
  })
  return (
    <div className="industry-banking-page-wrap flex flex-col min-h-screen" style={{ scrollBehavior: "smooth" }}>
      {/* Breadcrumb: same structure and spacing as agents page sub-nav (e.g. /agents/lea) – 1px divider then nav with 12px 0 padding, 48px min-height; horizontal padding matches header 25px */}
      <section className="industry-banking-section-breadcrumb fade-in-section bg-white">
        <div className="industry-banking-section-breadcrumb-divider" aria-hidden />
        <div className="mx-auto w-full" style={{ paddingLeft: "25px", paddingRight: "25px", maxWidth: "100%" }}>
          <nav
            aria-label="Section navigation"
            className="industry-banking-section-breadcrumb-inner flex flex-wrap items-center overflow-x-auto scrollbar-hide"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            <div className="flex items-center gap-6 md:gap-8 shrink-0" style={{ minWidth: "min-content" }}>
              <Link
                href={backToBankingBase ? "/industry/banking" : "/agents-store"}
                className="flex items-center gap-1.5 text-[#374151] hover:text-[#007BFF] transition-colors whitespace-nowrap no-underline"
                style={{ fontWeight: 400, fontSize: "14px", lineHeight: "24px", letterSpacing: "0px" }}
              >
                <ChevronLeft size={18} strokeWidth={2} aria-hidden />
                Back to Store
              </Link>
              <span
                aria-hidden
                className="shrink-0 bg-[#E5E7EB]"
                style={{ width: 1, height: 16 }}
              />
              {pageSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  className="text-[#374151] hover:text-[#007BFF] transition-colors whitespace-nowrap bg-transparent border-0 cursor-pointer p-0 text-left"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 400, fontSize: "14px", lineHeight: "24px", letterSpacing: "0px" }}
                >
                  {section.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 shrink-0 pl-4">
              <button
                type="button"
                className="industry-breadcrumb-icon-btn flex items-center justify-center"
                aria-label="Add to wishlist"
              >
                <Heart size={18} fill="none" stroke="currentColor" strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.share) {
                    navigator.share({ title: document.title, url: typeof window !== "undefined" ? window.location.href : "" }).catch(() => {})
                  } else if (typeof window !== "undefined") {
                    navigator.clipboard?.writeText(window.location.href)
                  }
                }}
                className="industry-breadcrumb-icon-btn flex items-center justify-center"
                aria-label="Share"
              >
                <Share2 size={18} strokeWidth={2} />
              </button>
            </div>
          </nav>
        </div>
      </section>

      <section id="overview" className="industry-banking-section-wrap industry-banking-hero-section industry-banking-section-center fade-in-section scroll-mt-24">
        <div className="industry-banking-section-inner industry-banking-hero-inner industry-banking-hero-stagger">
          <p className="industry-banking-eyebrow industry-banking-hero-stagger-item">Overview</p>
          <h1 className="industry-banking-hero-title industry-banking-hero-stagger-item mb-0">
            AI For Banking
          </h1>
          <h2 className="industry-banking-hero-subtitle industry-banking-hero-stagger-item mt-3 mb-0">
            Simplifying AI Success for Banks
          </h2>
          <p className="industry-banking-hero-desc industry-banking-hero-stagger-item mt-4">
            From pilot to platform — with proven agentic solutions designed for modern banking.
          </p>
        </div>
      </section>

      <div id="ai-mega-trends" className="scroll-mt-24 fade-in-section">
        <TrendsSection variant="industry" />
      </div>

      {config.partnership && (
        <section id="partnership" className="industry-banking-partnership-section industry-banking-section-wrap industry-banking-section-center pt-20 pb-20 fade-in-section scroll-mt-24">
          <div className="industry-banking-section-inner industry-banking-section-stagger">
            <p className="industry-banking-eyebrow industry-banking-stagger-head">Partnership</p>
            <h2 className="industry-banking-section-title industry-banking-stagger-head mb-2" style={{ maxWidth: "720px" }}>
              {config.partnership.title}
            </h2>
            {config.partnership.subtitle ? (
              <p className="industry-banking-section-subtitle industry-banking-stagger-head mb-8" style={{ maxWidth: "560px" }}>
                {config.partnership.subtitle}
              </p>
            ) : null}
            {config.partnership.phases.length === 0 ? (
              <div className="industry-banking-partnership-body pt-4" />
            ) : (
              <>
                <div className="industry-banking-partnership-tabs-wrap industry-banking-stagger-head relative w-full flex justify-center items-center pt-6 mb-8">
                  <div ref={partnershipTabsContainerRef} className="relative flex gap-8 flex-wrap justify-center">
                    {partnershipGreyLineStyle && (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          bottom: "-1px",
                          left: `${partnershipGreyLineStyle.left}px`,
                          width: `${partnershipGreyLineStyle.width}px`,
                          height: "2px",
                          backgroundColor: "#E5E7EB",
                          pointerEvents: "none",
                          zIndex: 0,
                        }}
                      />
                    )}
                    {partnershipIndicatorStyle && (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          bottom: "-1px",
                          left: `${partnershipIndicatorStyle.left}px`,
                          width: `${partnershipIndicatorStyle.width}px`,
                          height: "2px",
                          backgroundColor: "#000",
                          pointerEvents: "none",
                          zIndex: 1,
                        }}
                      />
                    )}
                    {config.partnership.phases.map((phase, idx) => (
                      <button
                        key={phase.title}
                        type="button"
                        role="tab"
                        aria-selected={partnershipTab === idx}
                        aria-controls={`partnership-panel-${idx}`}
                        id={`partnership-tab-${idx}`}
                        ref={(el) => {
                          if (el) partnershipTabRefs.current.set(idx, el)
                          else partnershipTabRefs.current.delete(idx)
                        }}
                        onClick={() => setPartnershipTab(idx)}
                        className="relative pb-2 px-4 bg-transparent border-0 cursor-pointer outline-none"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontSize: "14px",
                          fontWeight: partnershipTab === idx ? 600 : 500,
                          color: partnershipTab === idx ? "#000" : "#344054",
                          paddingBottom: "12px",
                          whiteSpace: "nowrap",
                          transition: "color 0.3s cubic-bezier(0.4, 0, 0.2, 1), font-weight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        {phase.title}
                      </button>
                    ))}
                  </div>
                </div>
                {config.partnership.phases.map((phase, idx) => (
                  <div
                    key={phase.title}
                    id={`partnership-panel-${idx}`}
                    role="tabpanel"
                    aria-labelledby={`partnership-tab-${idx}`}
                    hidden={partnershipTab !== idx}
                    className="industry-banking-partnership-panel industry-banking-section-center-panel overflow-hidden industry-banking-panel-in"
                  >
                    <div className="industry-banking-partnership-panel-inner">
                      <div className="industry-banking-partnership-body">
                        <span className="industry-banking-partnership-timeframe">{phase.timeframe}</span>
                        <h3 className="industry-banking-partnership-phase-title">{phase.title}</h3>
                        {phase.subBullets ? (
                          <>
                            <p className="industry-banking-partnership-headline">{phase.bullets[0]?.text ?? "New Projects in Discussion"}</p>
                            <div className="industry-banking-partnership-project-boxes">
                              {phase.subBullets.map((project, j) => {
                                const numberColor = ["#1e3a5f", "#9e2a6e", "#5c3d8a", "#0d9488", "#b45309", "#059669"][j % 6]
                                return (
                                  <div key={j} className="industry-banking-partnership-project-box">
                                    <span className="industry-banking-partnership-project-box-number" style={{ color: numberColor }} aria-hidden>
                                      {String(j + 1).padStart(2, "0")}
                                    </span>
                                    <span className="industry-banking-partnership-project-box-label">{project}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </>
                        ) : (
                          <div className="industry-banking-partnership-cards">
                            {phase.bullets.map((bullet, i) => {
                              const numberColor = ["#1e3a5f", "#9e2a6e", "#5c3d8a", "#0d9488", "#b45309", "#059669"][i % 6]
                              return (
                                <div key={i} className="industry-banking-partnership-card">
                                  <span className="industry-banking-partnership-card-number" style={{ color: numberColor }} aria-hidden>
                                    {String(i + 1).padStart(2, "0")}
                                  </span>
                                  <p className="industry-banking-partnership-card-text">
                                    <PartnershipBullet text={bullet.text} bold={bullet.bold.length ? bullet.bold : undefined} />
                                  </p>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>
      )}

      <section id="featured-agents" className="industry-banking-section-wrap industry-banking-section-center section-bg-alt pt-20 pb-24 fade-in-section w-full scroll-mt-24">
        <div className="industry-banking-section-inner industry-banking-section-stagger">
          <p className="industry-banking-eyebrow industry-banking-stagger-head">Featured Agents</p>
          <h2 className="industry-banking-section-title industry-banking-stagger-head">
            {featuresHeading}
          </h2>
          <p className="industry-banking-section-subtitle industry-banking-stagger-head mb-10" style={{ maxWidth: "600px" }}>
            Explore AI-powered agents built to automate workflows and help your team work smarter.
          </p>

          {(() => {
            const cardWidth = 560
            const cardHeight = 270
            const gap = 24
            const totalPages = Math.max(1, featuredAgents.length)
            const goToPage = (page: number) => {
              const p = Math.max(0, Math.min(page, totalPages - 1))
              setFeaturedCarouselPage(p)
              const el = featuredCarouselRef.current
              if (el) el.scrollTo({ left: p * (cardWidth + gap), behavior: "smooth" })
            }
            return (
              <div className="relative industry-banking-featured-carousel-wrap">
                <div
                  ref={featuredCarouselRef}
                  className="industry-banking-featured-carousel flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                    scrollSnapType: "x mandatory",
                  }}
                  onScroll={() => {
                    const el = featuredCarouselRef.current
                    if (!el) return
                    const page = Math.round(el.scrollLeft / (cardWidth + gap))
                    setFeaturedCarouselPage(Math.min(page, totalPages - 1))
                  }}
                >
                  {featuredAgents.map((f, i) => (
                    <div
                      key={f.id ?? `featured-${i}`}
                      className="industry-banking-featured-card browse-card-interactive flex-shrink-0 overflow-hidden"
                      style={{
                        width: cardWidth,
                        height: cardHeight,
                        borderRadius: "24px",
                        scrollSnapAlign: "start",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
                        background: FEATURED_AGENT_GRADIENTS[i % FEATURED_AGENT_GRADIENTS.length],
                      }}
                    >
                      <Link
                        href={`/agents/${f.id}`}
                        className="block p-6 h-full min-h-0 flex flex-col no-underline text-inherit"
                        style={{ textDecoration: "none" }}
                      >
                        <div className="flex justify-between items-start gap-4 flex-1 min-h-0">
                          <div className="industry-banking-featured-card-text min-w-0 flex flex-col flex-1">
                            <h3
                              className="industry-banking-featured-card-title mb-2"
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 500,
                                fontSize: "24px",
                                lineHeight: "32px",
                                letterSpacing: "0.17px",
                                color: "rgba(255, 255, 255, 0.87)",
                              }}
                            >
                              {f.title}
                            </h3>
                            <p
                              className="industry-banking-featured-card-desc line-clamp-2"
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 400,
                                fontSize: "14px",
                                lineHeight: "18px",
                                letterSpacing: "0.17px",
                                color: "rgba(255, 255, 255, 0.87)",
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical" as const,
                              }}
                            >
                              {f.description || ""}
                            </p>
                            <div
                              className="mt-auto pt-3 inline-flex items-center gap-1.5 browse-card-arrow"
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 400,
                                fontSize: "14px",
                                lineHeight: "20px",
                                color: "#FFFFFF",
                              }}
                            >
                              Know More
                              <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden style={{ width: 16, height: 16, flexShrink: 0 }} />
                            </div>
                          </div>
                          <div
                            className="industry-banking-featured-card-img flex-shrink-0 relative overflow-hidden rounded-[18px]"
                            style={{ width: 199, height: 180 }}
                          >
                            <Image
                              src={FEATURED_AGENT_CARD_IMAGE}
                              alt=""
                              role="presentation"
                              fill
                              className="object-contain object-right rounded-[18px]"
                            />
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3 mt-8" style={{ fontFamily: "Inter, sans-serif" }}>
                  <span className="text-sm font-medium text-[#6B7280]">
                    {featuredCarouselPage + 1} / {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => goToPage(featuredCarouselPage - 1)}
                    disabled={featuredCarouselPage === 0}
                    className="industry-banking-carousel-btn flex items-center justify-center w-10 h-10 rounded-xl border border-[#E5E7EB] bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ color: "#6B7280", fontFamily: "Inter, sans-serif" }}
                    aria-label="Previous"
                  >
                    <span style={{ fontSize: "18px", lineHeight: 1 }}>‹</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => goToPage(featuredCarouselPage + 1)}
                    disabled={featuredCarouselPage >= totalPages - 1}
                    className="industry-banking-carousel-btn flex items-center justify-center w-10 h-10 rounded-xl border border-[#E5E7EB] bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ color: "#091917", fontFamily: "Inter, sans-serif" }}
                    aria-label="Next"
                  >
                    <span style={{ fontSize: "18px", lineHeight: 1 }}>›</span>
                  </button>
                </div>
              </div>
            )
          })()}
        </div>
      </section>

      <section id="search-agents" className="industry-banking-section-wrap industry-banking-section-center pt-16 pb-2 overflow-visible scroll-mt-24 fade-in-section">
        <div className="industry-banking-section-inner overflow-visible industry-banking-animate-in">
          <p className="industry-banking-eyebrow">Search Agents</p>
          <h2 className="industry-banking-section-title mb-4">Search agents</h2>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="industry-banking-search relative flex items-center w-full min-w-[240px] max-w-[480px] h-12 bg-transparent">
              <Search className="absolute left-4 w-5 h-5 shrink-0 pointer-events-none" style={{ color: "#6B7280" }} aria-hidden />
              <input
                type="search"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-full bg-transparent border-0 pl-12 pr-5 outline-none placeholder:text-[#828282] focus:ring-0 rounded-[8px]"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 400, fontSize: "16px", lineHeight: "22px", color: "#1C1C1C" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="agent-cards" className="industry-banking-section-wrap industry-banking-section-center pb-24 pt-0 scroll-mt-24 fade-in-section">
        <div className="industry-banking-section-inner">
          <div className="industry-banking-cards-wrapper w-full">
            <div className="industry-banking-cards grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCards.map((card, i) => {
                const iconSrc = CATEGORY_ICON_SRC[card.category] ?? "/img/agents/workflows-icon.png"
                return (
                  <div key={card.id} className="agent-card-stagger">
                    <Link
                      href={card.id ? `/agents/${card.id}` : "#"}
                      className="industry-banking-agent-card group block relative rounded-xl overflow-hidden transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#007BFF]"
                      style={{
                        width: "100%",
                        minHeight: "257px",
                        background: "#F5F5F5",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)",
                        textDecoration: "none",
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"
                        style={{
                          background: "linear-gradient(132.48deg, #F7F7F7 60.17%, #FF757B 94.82%), linear-gradient(246.59deg, rgba(247, 247, 247, 0.6) 58.7%, rgba(255, 232, 232, 0.6) 99.81%)",
                        }}
                        aria-hidden
                      />
                      <div className="relative z-10 p-6 flex flex-col min-h-[257px] text-left">
                        <div className="flex justify-between items-start">
                          <span
                            className="text-left"
                            style={{
                              fontFamily: "Inter, sans-serif",
                              fontWeight: 400,
                              fontSize: "13.3px",
                              lineHeight: "14px",
                              letterSpacing: "0.17px",
                              color: "rgba(0, 0, 0, 0.87)",
                            }}
                          >
                            {card.category}
                          </span>
                          <div className="flex items-center justify-center rounded-full flex-shrink-0 bg-transparent" style={{ width: "36px", height: "36px" }}>
                            <img src={iconSrc} alt="" width={28} height={28} className="object-contain" />
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-end min-h-0 mt-3">
                          <h3
                            className="transition-colors duration-300 ease-out text-left"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                              fontWeight: 400,
                              fontSize: "24px",
                              lineHeight: "32px",
                              letterSpacing: "0.17px",
                              color: "rgba(0, 0, 0, 0.87)",
                            }}
                          >
                            {card.title}
                          </h3>
                          {card.description && (
                            <p
                              className="mt-2 line-clamp-3 max-h-0 overflow-hidden opacity-0 group-hover:max-h-[100px] group-hover:opacity-100 transition-all duration-300 ease-out text-left"
                              style={{
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 400,
                                fontSize: "12px",
                                lineHeight: "18px",
                                color: "#475467",
                              }}
                            >
                              {card.description}
                            </p>
                          )}
                        </div>
                        <p
                          className="mt-auto pt-4 uppercase flex-shrink-0 text-left"
                          style={{
                            fontFamily: "Inter, sans-serif",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "15px",
                            letterSpacing: "0.5px",
                            color: "rgba(0, 0, 0, 0.87)",
                          }}
                        >
                          {card.author}
                        </p>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
            <div className="flex justify-center mt-10 industry-banking-cta-in">
              <Link
                href="/tangram-ai-agents"
                className="industry-banking-btn-secondary inline-flex items-center gap-2"
              >
                Show more
                <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

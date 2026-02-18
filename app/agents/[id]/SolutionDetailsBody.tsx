"use client"

import React, { useRef, useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Maximize2, ChevronRight, ChevronLeft, Search, ChevronDown } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"
import { CurrentAgentSetter } from "../../../components/current-agent-setter"
import type { AgentDetailsContentProps } from "./types"

/** Default How It Works steps when API has no workflow field (e.g. earnings analyst / agent_001 style). */
const DEFAULT_WORKFLOW_STEPS = [
  { num: '01', title: 'Document Upload', desc: 'User provides earnings documents in PDF or transcript format' },
  { num: '02', title: 'Content Parsing', desc: 'AI extracts all financial metrics and key insights automatically' },
  { num: '03', title: 'Comparative Mapping', desc: 'System compares metrics across institutions and time periods' },
  { num: '04', title: 'Insight Generation', desc: 'AI synthesizes findings into actionable intelligence' },
  { num: '05', title: 'Presentation Creation', desc: 'Generates executive summaries and visual analytics' },
  { num: '06', title: 'User Review', desc: 'Team validates and customizes findings before delivery' },
]

type WorkflowStep = { num: string; title: string; desc: string }

/** True if steps look like placeholders (e.g. "Step 1", "Step 2" with no real content). */
function isPlaceholderSteps(steps: WorkflowStep[]): boolean {
  if (!steps.length) return true
  return steps.every(
    (s, i) =>
      (s.title === `Step ${i + 1}` || /^Step\s*\d+$/i.test(s.title)) &&
      !s.desc.trim()
  )
}

/** Get title from workflow item (multiple possible API keys). */
function getStepTitle(item: any, i: number): string {
  const raw = (item?.title ?? item?.step_title ?? item?.name ?? item?.heading ?? item?.label ?? '').trim()
  return raw || `Step ${i + 1}`
}

/** Get description from workflow item. */
function getStepDesc(item: any): string {
  return (item?.description ?? item?.step_description ?? item?.body ?? item?.content ?? item?.text ?? '').trim()
}

/** Parse workflow from API: array, JSON string, or pipe/tab delimited lines. */
function parseWorkflow(workflow: unknown): WorkflowStep[] | null {
  if (workflow == null || workflow === '') return null
  if (typeof workflow === 'object' && !Array.isArray(workflow)) return null
  if (Array.isArray(workflow)) {
    if (workflow.length === 0) return null
    const steps = workflow.map((item: any, i: number) => ({
      num: (item.step_number ?? item.step ?? String(i + 1).padStart(2, '0')),
      title: getStepTitle(item, i),
      desc: getStepDesc(item),
    }))
    return isPlaceholderSteps(steps) ? null : steps
  }
  if (typeof workflow !== 'string') return null
  const str = String(workflow).replace(/\\n/g, '\n').trim()
  if (!str) return null
  try {
    const parsed = JSON.parse(str) as unknown
    if (Array.isArray(parsed)) {
      const steps = parsed.map((item: any, i: number) => ({
        num: (item.step_number ?? item.step ?? String(i + 1).padStart(2, '0')),
        title: getStepTitle(item, i),
        desc: getStepDesc(item),
      }))
      return isPlaceholderSteps(steps) ? null : steps
    }
  } catch {
    /* not JSON */
  }
  const lines = str.split(/\n|;/).map((s) => s.trim()).filter(Boolean)
  if (lines.length === 0) return null
  const steps = lines.map((line, i) => {
    const dashMatch = line.match(/\s+[-–—]\s+/) // "Title - Description" or "Title – Description"
    const sep = dashMatch ? dashMatch[0] : ''
    const dashIndex = sep ? line.indexOf(sep) : -1
    if (dashIndex >= 0) {
      const title = line.slice(0, dashIndex).trim()
      const desc = line.slice(dashIndex + sep.length).trim()
      return { num: String(i + 1).padStart(2, '0'), title: title || `Step ${i + 1}`, desc }
    }
    const parts = line.split(/\s*\|\s*|\t/).map((p) => p.trim())
    const num = parts[0] && /^\d+/.test(parts[0]) ? parts[0].padStart(2, '0') : String(i + 1).padStart(2, '0')
    return { num, title: parts[1] ?? `Step ${i + 1}`, desc: parts[2] ?? '' }
  })
  return isPlaceholderSteps(steps) ? null : steps
}

/** Parse "Title - Description" or "Title – Description" steps from features string (semicolon or newline separated). */
function parseWorkflowFromFeatures(featuresStr: string | undefined): WorkflowStep[] | null {
  if (!featuresStr || !String(featuresStr).trim() || String(featuresStr).toLowerCase() === 'na') return null
  const raw = String(featuresStr).replace(/\\n/g, '\n').trim()
  const parts = raw.split(/[;\n]+/).map((s) => s.trim()).filter(Boolean)
  if (parts.length === 0) return null
  const steps: WorkflowStep[] = parts.map((p, i) => {
    const dashMatch = p.match(/\s+[-–—]\s+/) // space + hyphen/en-dash/em-dash + space
    const sep = dashMatch ? dashMatch[0] : ''
    const dashIndex = sep ? p.indexOf(sep) : -1
    const title = dashIndex >= 0 ? p.slice(0, dashIndex).trim() : p
    const desc = dashIndex >= 0 ? p.slice(dashIndex + sep.length).trim() : ''
    return { num: String(i + 1).padStart(2, '0'), title: title || `Step ${i + 1}`, desc }
  })
  if (isPlaceholderSteps(steps)) return null
  return steps.length > 0 ? steps : null
}

function isVideoPreviewUrl(url: string | undefined): boolean {
  if (!url || !url.trim()) return false
  const u = url.trim()
  const isYoutube = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i.test(u)
  const isVimeo = /vimeo\.com\/(\d+)/i.test(u)
  const isVideoFile = /\.(mp4|webm|ogg|mov)(\?|$|&|%3F|%2F)/i.test(u) || /\.(mp4|webm|ogg|mov)/i.test(u)
  return Boolean(isYoutube || isVimeo || isVideoFile)
}

type DemoAssetLike = {
  asset_url?: string
  asset_file_path?: string
  demo_asset_link?: string
  demo_link?: string
  demo_asset_name?: string
  demo_asset_type?: string
}

function getUrlFromAsset(asset: DemoAssetLike | undefined): string | undefined {
  if (!asset) return undefined
  const url = asset.asset_url || asset.asset_file_path || asset.demo_asset_link || asset.demo_link
  return url?.trim() || undefined
}

function isAssetVideo(asset: DemoAssetLike): boolean {
  const url = getUrlFromAsset(asset) || ''
  const name = (asset.demo_asset_name || '').toLowerCase()
  const type = (asset.demo_asset_type || '').toLowerCase()
  if (/\.(mp4|webm|ogg|mov)(\?|$|&)/i.test(url) || /\.(mp4|webm|ogg|mov)$/i.test(name)) return true
  if (type.startsWith('video/') || type === 'video') return true
  if (/(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(url)) return true
  return false
}

function isUrlVideo(url: string): boolean {
  const u = url.trim()
  if (/\.(mp4|webm|ogg|mov)(\?|$|&|%3F|%2F)/i.test(u)) return true
  if (/(?:youtube\.com|youtu\.be|vimeo\.com)/i.test(u)) return true
  return false
}

/** Prefer video for playback: first video in array, else first asset. */
function getPreviewUrlFromDemoAssets(assets: DemoAssetLike[] | undefined): string | undefined {
  if (!Array.isArray(assets) || assets.length === 0) return undefined
  const video = assets.find(isAssetVideo)
  const first = assets[0]
  return getUrlFromAsset((video || first) as DemoAssetLike)
}

/** Parse comma-separated demo_preview string; prefer first video URL, else first URL. */
function getPreviewUrlFromDemoPreviewString(str: string | undefined): string | undefined {
  if (!str || !str.trim()) return undefined
  const urls = str.split(',').map((u) => u.trim()).filter(Boolean)
  if (urls.length === 0) return undefined
  const videoUrl = urls.find(isUrlVideo)
  return videoUrl || urls[0]
}

/** Normalize preview URL: S3 and relative paths go through proxy so video/image loads correctly */
function normalizePreviewUrl(url: string | undefined): string | undefined {
  if (!url || !url.trim()) return undefined
  const u = url.trim()
  if (u.startsWith('blob:')) return u
  if (/(?:youtube\.com|youtu\.be)/i.test(u) || /vimeo\.com/i.test(u)) return u
  if (u.startsWith('https://') || u.startsWith('http://')) {
    if (u.includes('.s3.') || u.includes('amazonaws.com')) {
      try {
        return `/api/image-proxy?url=${encodeURIComponent(u)}`
      } catch {
        return u
      }
    }
    return u
  }
  const bucket = 'agentsstore'
  const region = 'us-east-1'
  const key = u.startsWith('/') ? u.slice(1) : u
  const s3Url = `https://${bucket}.s3.${region}.amazonaws.com/${key}`
  try {
    return `/api/image-proxy?url=${encodeURIComponent(s3Url)}`
  } catch {
    return s3Url
  }
}

function isYoutubeUrl(url: string): boolean {
  return /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i.test(url)
}
function isVimeoUrl(url: string): boolean {
  return /vimeo\.com\/(\d+)/i.test(url)
}
function getYoutubeEmbedUrl(url: string, opts?: { autoplay?: boolean; mute?: boolean; loop?: boolean }): string {
  const match = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i)
  if (!match || !match[1]) return url
  const id = match[1]
  const params = new URLSearchParams()
  if (opts?.autoplay) params.set('autoplay', '1')
  if (opts?.mute) params.set('mute', '1')
  if (opts?.loop) {
    params.set('loop', '1')
    params.set('playlist', id)
  }
  const qs = params.toString()
  return `https://www.youtube.com/embed/${id}${qs ? `?${qs}` : ''}`
}
function getVimeoEmbedUrl(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/i)
  return match && match[1] ? `https://player.vimeo.com/video/${match[1]}` : url
}

export function SolutionDetailsBody(props: AgentDetailsContentProps) {
  const { id, title, description, data, agent, relatedAgents = [], agentsSource, overviewVariant } = props
  const demoPreviewContainerRef = useRef<HTMLDivElement>(null)
  const [techSecurityTab, setTechSecurityTab] = useState<string>('')
  const [techSecurityExpandedTabs, setTechSecurityExpandedTabs] = useState<Set<string>>(new Set())
  const [selectedWorkflowStepIndex, setSelectedWorkflowStepIndex] = useState(0)
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null)
  const [agentPoweringCategory, setAgentPoweringCategory] = useState<string>('All')
  const [agentPoweringTag, setAgentPoweringTag] = useState<string | null>(null)
  const [agentPoweringSearch, setAgentPoweringSearch] = useState('')
  const [agentPoweringVisibleCount, setAgentPoweringVisibleCount] = useState(4)
  const [agentPoweringScrollOffset, setAgentPoweringScrollOffset] = useState(0)
  const [agentPoweringAtStart, setAgentPoweringAtStart] = useState(true)
  const [agentPoweringAtEnd, setAgentPoweringAtEnd] = useState(false)
  const [agentPoweringSortOrder, setAgentPoweringSortOrder] = useState<'recommended' | 'a-z'>('recommended')
  const [agentPoweringSortDropdownOpen, setAgentPoweringSortDropdownOpen] = useState(false)
  const agentPoweringSortDropdownRef = useRef<HTMLDivElement>(null)
  const agentPoweringScrollRef = useRef<HTMLDivElement>(null)
  const [agentPoweringContainerWidth, setAgentPoweringContainerWidth] = useState(0)
  type AgentPoweringCard = { agent_id?: string; agent_name?: string; description?: string; category: string; tags: readonly string[]; isLink?: boolean; placeholder?: { label?: string; title?: string; icon?: string } }
  const [agentPoweringModalCard, setAgentPoweringModalCard] = useState<AgentPoweringCard | null>(null)
  /** Fetched agent from API for modal (description, capabilities, roi, agent_name) */
  type ApiAgentForModal = {
    agent_id?: string
    agent_name?: string
    description?: string
    by_capability?: string
    roi?: string
    capabilities?: Array<{ serial_id?: string; by_capability?: string }>
  }
  const [modalAgentFromApi, setModalAgentFromApi] = useState<ApiAgentForModal | null>(null)
  const TECH_SECURITY_VISIBLE_ROWS = 5
  /** For use-case capabilities: which item index is expanded (description visible). null = none. */
  const [expandedCapabilityIndex, setExpandedCapabilityIndex] = useState<number | null>(0)

  /** When agent powering modal opens, fetch full agent detail from API for description, capabilities, ROI */
  useEffect(() => {
    if (!agentPoweringModalCard) {
      setModalAgentFromApi(null)
      return
    }
    const aid = (agentPoweringModalCard.agent_id || '').toString()
    const aname = (agentPoweringModalCard.agent_name || '').trim()
    const isPlaceholderId = /^placeholder-\d+$/i.test(aid)
    setModalAgentFromApi(null)
    let cancelled = false

    const applyDetail = (detail: { agent?: { agent_id?: string; agent_name?: string; description?: string; by_capability?: string; roi?: string }; capabilities?: Array<{ serial_id?: string; by_capability?: string }> }) => {
      const agent = detail?.agent
      if (!agent) return
      setModalAgentFromApi({
        agent_id: agent.agent_id,
        agent_name: agent.agent_name,
        description: agent.description,
        by_capability: agent.by_capability,
        roi: agent.roi,
        capabilities: Array.isArray(detail.capabilities) ? detail.capabilities : undefined,
      })
    }

    if (!isPlaceholderId && aid) {
      fetch(`https://agents-store.onrender.com/api/agents/${aid}`, { cache: 'no-store' })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Not found'))))
        .then((data: { agent?: { agent_id?: string; agent_name?: string; description?: string; by_capability?: string; roi?: string }; capabilities?: Array<{ serial_id?: string; by_capability?: string }> }) => {
          if (cancelled) return
          applyDetail(data)
        })
        .catch(() => {
          if (!cancelled) setModalAgentFromApi(null)
        })
      return () => { cancelled = true }
    }

    fetch('https://agents-store.onrender.com/api/agents', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json: { agents?: Array<{ agent_id?: string; agent_name?: string; description?: string; by_capability?: string; roi?: string }> }) => {
        if (cancelled) return
        const list = Array.isArray(json?.agents) ? json.agents : []
        let found = list.find((a) => (a.agent_id || '').toString() === aid)
        if (!found && aname) {
          found = list.find((a) => (a.agent_name || '').trim().toLowerCase() === aname.toLowerCase())
        }
        if (found) {
          setModalAgentFromApi({
            agent_id: found.agent_id,
            agent_name: found.agent_name,
            description: found.description,
            by_capability: found.by_capability,
            roi: found.roi,
          })
        }
      })
      .catch(() => { if (!cancelled) setModalAgentFromApi(null) })
    return () => { cancelled = true }
  }, [agentPoweringModalCard?.agent_id, agentPoweringModalCard?.agent_name])

  /** Agent-powering category tabs; tag pills are derived from API (agentPoweringTagsFromApi) */
  const AGENT_POWERING_CATEGORIES = ['All', 'Banking', 'Retail', 'Healthcare', 'Manufacturing'] as const

  // Sorted (alphabetically by name) image URLs from agent API demo_assets / demo_preview for How it works panel
  const workflowPanelImageUrls = useMemo((): string[] => {
    const agentAssets = (data?.agent?.demo_assets || data?.demo_assets) as DemoAssetLike[] | undefined
    const list: { name: string; url: string }[] = []
    if (Array.isArray(agentAssets)) {
      agentAssets.forEach((a) => {
        const url = getUrlFromAsset(a)
        if (url && !isAssetVideo(a)) {
          const name = (a.demo_asset_name || url || '').trim()
          list.push({ name, url })
        }
      })
    }
    const previewStr = data?.agent?.demo_preview?.trim()
    if (previewStr) {
      previewStr.split(',').map((u) => u.trim()).filter(Boolean).forEach((url) => {
        if (!isUrlVideo(url) && !list.some((x) => x.url === url)) {
          list.push({ name: url, url })
        }
      })
    }
    list.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
    return list.map((x) => x.url)
  }, [data?.agent?.demo_assets, data?.demo_assets, data?.agent?.demo_preview])

  // How It Works steps: only from API `workflow` field. Do not use `features` here — features is for Capabilities section.
  const workflowSteps = useMemo((): WorkflowStep[] => {
    const a = agent as { workflow?: unknown }
    const d = data?.agent as { workflow?: unknown } | undefined
    const workflow = a?.workflow ?? d?.workflow
    const fromWorkflow = parseWorkflow(workflow)
    if (fromWorkflow && fromWorkflow.length > 0) return fromWorkflow
    return DEFAULT_WORKFLOW_STEPS
  }, [agent, data?.agent])

  // Agent-powering: card list from API (bundled or similar agents only); category/tags from API when available
  const AGENT_POWERING_CATEGORIES_LIST = ['Banking', 'Retail', 'Healthcare', 'Manufacturing'] as const
  const agentPoweringCardsSource = useMemo(() => {
    if (relatedAgents.length === 0) return []
    return relatedAgents.map((ra: { agent_id?: string; agent_name?: string; description?: string; tags?: string[] | string }) => {
      const tagsArray = Array.isArray(ra.tags)
        ? ra.tags
        : typeof ra.tags === 'string'
          ? ra.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : []
      const category =
        AGENT_POWERING_CATEGORIES_LIST.find((c) => tagsArray.some((t) => t.toLowerCase().includes(c.toLowerCase()))) ??
        (tagsArray[0] || 'All')
      return {
        agent_id: ra.agent_id || '',
        agent_name: ra.agent_name || 'Agent',
        description: ra.description || '',
        category: AGENT_POWERING_CATEGORIES_LIST.includes(category as typeof AGENT_POWERING_CATEGORIES_LIST[number]) ? category : 'All',
        tags: tagsArray.length > 0 ? tagsArray : ['AI Agent'],
        isLink: true,
      }
    })
  }, [relatedAgents])

  /** Unique tags from related agents (API), sorted, excluding "More..." and empty */
  const agentPoweringTagsFromApi = useMemo(() => {
    const set = new Set<string>()
    agentPoweringCardsSource.forEach((card) => {
      (card.tags || []).forEach((t) => {
        const s = (t || '').trim()
        if (s && s.toLowerCase() !== 'more...') set.add(s)
      })
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  }, [agentPoweringCardsSource])

  const agentPoweringFiltered = useMemo(() => {
    const q = agentPoweringSearch.trim().toLowerCase()
    return agentPoweringCardsSource.filter((card) => {
      if (agentPoweringCategory !== 'All' && card.category !== agentPoweringCategory) return false
      if (agentPoweringTag != null && !card.tags.includes(agentPoweringTag)) return false
      const label = (card as { placeholder?: { label?: string; title?: string } }).placeholder?.label ?? ''
      const title = (card as { placeholder?: { label?: string; title?: string } }).placeholder?.title ?? ''
      if (q && !(card.agent_name?.toLowerCase().includes(q) || (card.description ?? '').toLowerCase().includes(q) || label.toLowerCase().includes(q) || title.toLowerCase().includes(q))) return false
      return true
    })
  }, [agentPoweringCardsSource, agentPoweringCategory, agentPoweringTag, agentPoweringSearch])

  const agentPoweringSortedList = useMemo(() => {
    return agentPoweringSortOrder === 'a-z'
      ? [...agentPoweringFiltered].sort((a, b) => (a.agent_name ?? '').localeCompare(b.agent_name ?? '', undefined, { sensitivity: 'base' }))
      : agentPoweringFiltered
  }, [agentPoweringFiltered, agentPoweringSortOrder])

  const AGENT_POWERING_CARDS_PER_ROW = 4
  const AGENT_POWERING_GAP = 18
  const agentPoweringHasMore = agentPoweringSortedList.length > AGENT_POWERING_CARDS_PER_ROW
  const agentPoweringCardWidth = agentPoweringContainerWidth > 0
    ? (agentPoweringContainerWidth - (AGENT_POWERING_CARDS_PER_ROW - 1) * AGENT_POWERING_GAP) / AGENT_POWERING_CARDS_PER_ROW
    : 280
  const agentPoweringScrollStep = agentPoweringCardWidth * AGENT_POWERING_CARDS_PER_ROW + (AGENT_POWERING_CARDS_PER_ROW - 1) * AGENT_POWERING_GAP

  useEffect(() => {
    const el = agentPoweringScrollRef.current
    if (!el) return
    const ro = new ResizeObserver(() => {
      setAgentPoweringContainerWidth(el.clientWidth)
      setTimeout(updateAgentPoweringScrollState, 0)
    })
    ro.observe(el)
    setAgentPoweringContainerWidth(el.clientWidth)
    return () => ro.disconnect()
  }, [agentPoweringSortedList.length])

  useEffect(() => {
    const t = setTimeout(updateAgentPoweringScrollState, 100)
    return () => clearTimeout(t)
  }, [agentPoweringSortedList.length, agentPoweringContainerWidth])

  const scrollAgentPowering = (direction: 'prev' | 'next') => {
    const el = agentPoweringScrollRef.current
    if (!el) return
    const step = agentPoweringScrollStep
    el.scrollTo({ left: el.scrollLeft + (direction === 'next' ? step : -step), behavior: 'smooth' })
  }

  const updateAgentPoweringScrollState = () => {
    const el = agentPoweringScrollRef.current
    if (!el) return
    const atStart = el.scrollLeft <= 1
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1
    setAgentPoweringAtStart(atStart)
    setAgentPoweringAtEnd(atEnd)
  }

  React.useEffect(() => {
    setAgentPoweringVisibleCount(AGENT_POWERING_CARDS_PER_ROW)
    if (agentPoweringScrollRef.current) agentPoweringScrollRef.current.scrollLeft = 0
  }, [agentPoweringCategory, agentPoweringTag, agentPoweringSearch, agentPoweringSortOrder])

  // Close sort dropdown when clicking outside
  useEffect(() => {
    if (!agentPoweringSortDropdownOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (agentPoweringSortDropdownRef.current && !agentPoweringSortDropdownRef.current.contains(e.target as Node)) {
        setAgentPoweringSortDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [agentPoweringSortDropdownOpen])

  // Reset selected workflow step when steps or image list change (e.g. different agent)
  React.useEffect(() => {
    setSelectedWorkflowStepIndex((prev) => Math.min(prev, Math.max(0, workflowSteps.length - 1)))
  }, [workflowSteps.length])

  const content = (<>
    {/* Agent Powering modal – popup when clicking an agent in Agents & Model Powering */}
    {agentPoweringModalCard && (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="agent-powering-modal-title"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'rgba(0,0,0,0.5)',
        }}
        onClick={() => setAgentPoweringModalCard(null)}
      >
        <style dangerouslySetInnerHTML={{ __html: '.agent-detail-modal-scroll-no-bar::-webkit-scrollbar { display: none; }' }} />
        <div
          className="agent-detail-modal-scroll-no-bar"
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1340px',
            maxHeight: 'calc(100vh - 48px)',
            overflow: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            background: '#FFFFFF',
            borderRadius: '42px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top gradient strip – blue → purple/magenta → lavender */}
          <div
            style={{
              width: '100%',
              height: '28px',
              borderRadius: '42px 42px 0 0',
              background: 'linear-gradient(90deg, #0023F6 0%, #8F2B8C 50%, #C4B5FD 100%)',
              flexShrink: 0,
            }}
            aria-hidden
          />
          {/* Close button */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setAgentPoweringModalCard(null)}
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: '1px solid #E5E7EB',
              background: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#374151',
              zIndex: 1,
            }}
          >
            ×
          </button>

          <div style={{ padding: '72px 86px 80px', position: 'relative' }}>
            {/* Header – Sub-Agent | Bundled/Similar in [Clicked agent name only]; then agent name as title; then description */}
            <div style={{ textAlign: 'center', marginBottom: '48px', maxWidth: '970px', marginLeft: 'auto', marginRight: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '18px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '24px', color: '#091917' }}>
                  {agentsSource === 'similar'
                    ? <>Sub-Agent | Similar to{' '}
                      {(modalAgentFromApi?.agent_id || agentPoweringModalCard?.agent_id) && !/^placeholder-\d+$/i.test((agentPoweringModalCard?.agent_id || '').toString()) ? (
                        <Link href={`/agents/${modalAgentFromApi?.agent_id || agentPoweringModalCard?.agent_id}`} style={{ color: '#0019FF', textDecoration: 'underline', fontWeight: 500 }}>
                          {modalAgentFromApi?.agent_name || agentPoweringModalCard?.agent_name || 'Agent'}
                        </Link>
                      ) : (
                        <span style={{ color: '#091917' }}>{modalAgentFromApi?.agent_name || agentPoweringModalCard?.agent_name || 'Agent'}</span>
                      )}
                    </>
                    : <>Sub-Agent | Bundled in{' '}
                      {(modalAgentFromApi?.agent_id || agentPoweringModalCard?.agent_id) && !/^placeholder-\d+$/i.test((agentPoweringModalCard?.agent_id || '').toString()) ? (
                        <Link href={`/agents/${modalAgentFromApi?.agent_id || agentPoweringModalCard?.agent_id}`} style={{ color: '#0019FF', textDecoration: 'underline', fontWeight: 500 }}>
                          {modalAgentFromApi?.agent_name || agentPoweringModalCard?.agent_name || 'Agent'}
                        </Link>
                      ) : (
                        <span style={{ color: '#091917' }}>{modalAgentFromApi?.agent_name || agentPoweringModalCard?.agent_name || 'Agent'}</span>
                      )}
                    </>
                  }
                </span>
              </div>
              <h2
                id="agent-powering-modal-title"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: 'clamp(32px, 5vw, 60px)',
                  lineHeight: 1.1,
                  letterSpacing: '-1.5px',
                  background: 'linear-gradient(90deg, #E300DE 0%, #0019FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  margin: '0 0 18px 0',
                }}
              >
                Discovery Call Scorecard
              </h2>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '16px', lineHeight: '160%', color: '#344054', margin: 0, textAlign: 'center' }}>
                {(modalAgentFromApi?.description ?? agentPoweringModalCard?.description) || 'A customer-facing recommendation engine that analyzes demographics, transaction history, and existing card features to suggest the most relevant credit card. Designed to enhance acquisition conversion rates while aligning with user lifestyle and preferences.'}
              </p>
            </div>

            {/* Capabilities – from API: detail capabilities array or agent.by_capability string */}
            <div style={{ marginBottom: '48px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
                <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} />
                <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '12px', lineHeight: '16px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#111827' }}>Capabilities</span>
                <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} />
              </div>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300, fontSize: '24px', lineHeight: '40px', textAlign: 'center', margin: '0 auto 32px', maxWidth: '570px', background: 'linear-gradient(90deg, #0023F6 0%, #008F59 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Enterprise AI scales when product and execution move together
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', maxWidth: '1128px', margin: '0 auto' }}>
                {((() => {
                  const iconColors = ['#FF9231', '#722ED1', '#1C69E3']
                  let caps: string[] = []
                  if (Array.isArray(modalAgentFromApi?.capabilities) && modalAgentFromApi.capabilities.length > 0) {
                    caps = modalAgentFromApi.capabilities.map((c) => (c.by_capability || '').trim()).filter(Boolean)
                  } else {
                    const capStr = (modalAgentFromApi?.by_capability ?? '').trim()
                    caps = capStr ? capStr.split(',').map((c) => c.trim()).filter(Boolean) : []
                  }
                  const fromApi = caps.slice(0, 3).map((title, idx) => ({ title, desc: 'Capability provided by this agent.', iconColor: iconColors[idx] ?? iconColors[0] }))
                  const fallbacks = [
                    { title: 'Document & Knowledge', desc: 'Intelligent document processing and knowledge extraction for enterprise workflows.', iconColor: '#1C69E3' },
                    { title: 'Data Intelligence', desc: 'Analytics and insights from structured and unstructured data.', iconColor: '#722ED1' },
                    { title: 'Workflow & Process', desc: 'Automation and orchestration of business processes.', iconColor: '#FF9231' },
                  ]
                  const displayItems = fromApi.length >= 3 ? fromApi : fromApi.length > 0 ? [...fromApi, ...fallbacks].slice(0, 3) : fallbacks
                  return displayItems.map((cap, idx) => (
                    <div key={idx} style={{ background: '#F9FAFB', borderRadius: '8px', padding: '24px', minHeight: '230px', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: cap.iconColor, marginBottom: '16px' }} />
                      <h3 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '16px', lineHeight: '26px', color: '#333333', margin: '0 0 8px 0' }}>{cap.title}</h3>
                      <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '14px', lineHeight: '24px', color: '#4B4B4B', margin: 0 }}>{cap.desc}</p>
                    </div>
                  ))
                })())}
              </div>
            </div>

            {/* Key Benefits & Value Proposition – dynamic from API roi */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
                <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} />
                <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '12px', lineHeight: '16px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#111827' }}>Key Benefits & Value Proposition</span>
                <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} />
              </div>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300, fontSize: '24px', lineHeight: '40px', textAlign: 'center', margin: '0 auto 32px', maxWidth: '555px', background: 'linear-gradient(90deg, #0023F6 0%, #008F59 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Enterprise AI scales when product and execution move together
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0', maxWidth: '924px', margin: '0 auto', border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
                {((() => {
                  const roiStr = modalAgentFromApi?.roi?.trim()
                  const benefits: { value: string; label: string; description: string; color: string }[] = []
                  if (roiStr) {
                    const segments = roiStr.split(/\s*;\s*|\n/).map((s) => s.trim()).filter(Boolean)
                    const colors = ['#1C69E3', '#7C52EE', '#CF57C8']
                    for (let i = 0; i < Math.min(3, segments.length); i++) {
                      const seg = segments[i]
                      const lastDash = seg.lastIndexOf(' - ')
                      const value = lastDash >= 0 ? seg.slice(lastDash + 3).trim() : seg
                      const rest = lastDash >= 0 ? seg.slice(0, lastDash) : ''
                      const firstDash = rest.indexOf(' - ')
                      const label = firstDash >= 0 ? rest.slice(0, firstDash).trim() : rest || 'Benefit'
                      const description = firstDash >= 0 ? rest.slice(firstDash + 3).trim() : ''
                      benefits.push({ value, label, description, color: colors[i] ?? colors[0] })
                    }
                  }
                  if (benefits.length < 3) {
                    benefits.push(
                      { value: '85%', label: 'HDFC Bank', description: '', color: '#1C69E3' },
                      { value: '4x', label: 'HDFC Bank', description: '', color: '#7C52EE' },
                      { value: '90%', label: 'HDFC Bank', description: '', color: '#CF57C8' },
                    )
                    benefits.splice(3)
                  }
                  const looksLikeNumber = (v: string) => /^[\d.]+%?x?$/i.test((v || '').trim())
                  return benefits.map((benefit, idx) => {
                    const hasNumber = looksLikeNumber(benefit.value)
                    if (hasNumber) {
                      return (
                        <div key={idx} style={{ boxSizing: 'border-box', padding: '32px 27px', background: '#FFFFFF', borderLeft: idx === 0 ? 'none' : '1px solid #E5E7EB', minHeight: '192px' }}>
                          <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(115, 115, 115, 0.4)', marginBottom: '24px' }} />
                          <div style={{ fontFamily: 'Geist, var(--font-geist-sans), sans-serif', fontWeight: 300, fontSize: '32px', lineHeight: '100%', color: benefit.color, marginBottom: '24px' }}>{benefit.value}</div>
                          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', lineHeight: '24px', color: benefit.color, marginBottom: benefit.description ? '8px' : 0 }}>{benefit.label}</div>
                          {benefit.description ? (
                            <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '13px', lineHeight: '20px', color: '#344054' }}>{benefit.description}</div>
                          ) : null}
                        </div>
                      )
                    }
                    // No number: always show "Benefit" above the text (coloured), description below (normal black)
                    // API may send "Description - Benefit" (value=Benefit, label=Description) or "Benefit - Description" (value=Description, label=Benefit)
                    const isBenefitFirstFormat = /^Benefit$/i.test((benefit.label || '').trim())
                    const benefitLabel = 'Benefit'
                    const descriptionText = isBenefitFirstFormat
                      ? (benefit.value?.trim() || '')
                      : (benefit.description?.trim() || benefit.label?.trim() || '')
                    return (
                      <div key={idx} style={{ boxSizing: 'border-box', padding: '32px 27px', background: '#FFFFFF', borderLeft: idx === 0 ? 'none' : '1px solid #E5E7EB', minHeight: '192px' }}>
                        <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(115, 115, 115, 0.4)', marginBottom: '24px' }} />
                        <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '14px', lineHeight: '24px', color: benefit.color, marginBottom: descriptionText ? '8px' : 0 }}>{benefitLabel}</div>
                        {descriptionText ? (
                          <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400, fontSize: '13px', lineHeight: '20px', color: '#0A0A0A' }}>{descriptionText}</div>
                        ) : null}
                      </div>
                    )
                  })
                })())}
              </div>
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="agent-details-page">
      <CurrentAgentSetter agentId={id} agentName={title} />
      <ScrollToTop />
      {/* Main Content - Overview (Rectangle #D9D9D9 + Screenshot image + Mask group darken) */}
      <section id="overview" style={{ position: 'relative', width: '100%', minHeight: '838px', overflow: 'hidden' }}>
        {/* Rectangle 34624662 – 1512×838, #D9D9D9 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '1512px',
            maxWidth: '100%',
            height: '838px',
            background: '#D9D9D9',
            zIndex: 0,
          }}
        />
        {/* Screenshot – 1512×982, top -88px, theme background image */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '-88px',
            width: '1512px',
            maxWidth: '100%',
            height: '982px',
            backgroundImage: 'url(/assets/theme-dots.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
          aria-hidden
        />
        {/* Mask group – 1512×838, mix-blend-mode darken, opacity 0.4 */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '1512px',
            maxWidth: '100%',
            height: '838px',
            mixBlendMode: 'darken',
            opacity: 0.4,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Centered text box – Group 1410104269: 720px wide, centered; top padding 6×24px */}
        <div
                style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '720px',
            margin: '0 auto',
            padding: '144px 24px 80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          {/* Link pill – agent name + icon (Group 1410104267) */}
              <div
                style={{
                  display: 'flex',
              flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
              gap: '10px',
              padding: '10px 20px',
              background: 'rgba(247, 244, 237, 0.2)',
              borderRadius: '9999px',
              marginBottom: '24px',
            }}
          >
            {data?.agent?.icon_url?.trim() ? (
              <img src={data.agent.icon_url.trim()} alt="" style={{ width: 19, height: 19, borderRadius: '4px', objectFit: 'cover' }} />
            ) : (
              <img src="/img/agents/research-icon.png" alt="" style={{ width: 19, height: 19, objectFit: 'contain' }} />
            )}
                  <span
                    style={{
                fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                fontSize: '12.9px',
                lineHeight: '21px',
                color: '#1C1C1C',
              }}
            >
              {title || data?.agent?.agent_name || 'Solution'}
                  </span>
          </div>

          {/* Transform NPA Management With */}
          <div
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
              fontSize: '42px',
              lineHeight: '54px',
              textAlign: 'center',
              color: '#091917',
              marginBottom: '0',
            }}
          >
            {(() => {
              const descStr = (description || '').trim()
              const fromDescription = descStr.includes(' - ') ? descStr.split(/\s+-\s+/)[0]?.trim() : ''
              const firstLine = fromDescription || data?.agent?.by_persona || 'Transform NPA Management With'
              const words = (firstLine || '').split(' ')
              const lastWord = words.pop()
              return (
                <>
                  {words.length ? words.join(' ') + ' ' : ''}
                  <span
                    style={{
                      background: 'linear-gradient(90deg, #091917 0%, #2E7F75 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {lastWord || firstLine}
                  </span>
                </>
              )
            })()}
          </div>

          {/* AI-Powered Automation (second line – full gradient) */}
          <div
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '42px',
                      lineHeight: '54px',
                      textAlign: 'center',
                      background: 'linear-gradient(90deg, #091917 0%, #2E7F75 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
              marginBottom: '24px',
            }}
          >
            {data?.agent?.by_value?.trim() || 'AI-Powered Automation'}
          </div>

          {/* Description – 618px max, 14px / 24px */}
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '24px',
              textAlign: 'center',
              color: '#091917',
              maxWidth: '618px',
              margin: '0 0 24px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {(() => {
              const descStr = (description || '').trim()
              const restOnly = descStr.includes(' - ') ? descStr.split(/\s+-\s+/).slice(1).join(' - ').trim() : descStr
              const text = restOnly || description
              return text
                ? text.replace(/\\n/g, ' ').slice(0, 200) + (text.length > 200 ? '...' : '')
                : 'Streamline your non-performing asset workflow from email intake to valuation. Reduce processing time by 70% with AI-assisted automation and real-time analytics.'
            })()}
          </p>

          {/* Actions – DEMO NOW button with glow/stroke/fill */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '24px 0', opacity: 0.93 }}>
          {(() => {
            const demoUrl = (data?.agent?.demo_link || data?.agent?.application_demo_url || '').trim()
            const hasDemo = Boolean(demoUrl)
            return (
              <a
                href={hasDemo ? demoUrl : '#'}
                {...(hasDemo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '232px',
                    height: '48px',
                    background: 'rgba(0, 159, 163, 0.05)',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    isolation: 'isolate',
                  }}
                >
                  {/* Glow */}
                  <span
                    style={{
                      position: 'absolute',
                      left: -2,
                      right: -2,
                      top: -2,
                      bottom: -2,
                      background: 'radial-gradient(25% 44.15% at 31.25% 18.75%, #00AE8E 0%, rgba(0, 174, 142, 0) 100%)',
                      filter: 'blur(7.5px)',
                      zIndex: 0,
                    }}
                  />
                  {/* Stroke */}
                  <span
                    style={{
                      position: 'absolute',
                      left: -2,
                      right: -2,
                      top: -2,
                      bottom: -2,
                      background: 'radial-gradient(19.16% 47.41% at 31.25% 18.75%, #00AE8E 0%, rgba(0, 174, 142, 0) 100%)',
                      zIndex: 1,
                    }}
                  />
                  {/* Fill */}
                  <span
                    style={{
                      position: 'absolute',
                      left: 2,
                      right: 2,
                      top: 2,
                      bottom: 2,
                      background: '#000000',
                      borderRadius: 4,
                      zIndex: 2,
                    }}
                  />
                  {/* Text */}
                  <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontSize: '14px',
                      lineHeight: '21px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                      zIndex: 3,
                }}
              >
                {hasDemo ? 'DEMO NOW' : 'Join Waiting list'}
                  </span>
              </a>
            )
          })()}
          </div>

          {/* Divider line – 345px width, 1px #E5E7EB */}
          <div
            style={{
              width: '345px',
              height: 0,
              borderTop: '1px solid #E5E7EB',
              margin: '24px 0',
            }}
          />

          {/* Just Ask AI + provider icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '21px',
                color: '#181818',
                whiteSpace: 'nowrap',
              }}
            >
              Just Ask AI
                    </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {[
                { src: '/img/footer/icon-1.png', style: { filter: 'brightness(0)' } },
                { src: '/img/footer/icon-2.png', style: { filter: 'contrast(1.5) saturate(1.5) brightness(0.8)' } },
                { src: '/img/footer/gemini-color 1.png', style: {} },
                { src: '/img/footer/icon-4.png', style: { filter: 'brightness(0)' } },
                { src: '/img/footer/icon-5.png', style: { filter: 'contrast(1.2)' } },
              ].map((icon) => (
                <span key={icon.src} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, overflow: 'hidden' }}>
                  <Image src={icon.src} alt="" width={20} height={20} className="object-contain" style={icon.style} />
                </span>
              ))}
                </div>
              </div>
        </div>

        {/* ΓöÇΓöÇ 6. Floating Video Preview (bottom-right) ΓÇô prefer video from demo_assets / demo_preview for playback ΓöÇΓöÇ */}
        {(() => {
          const agentAssets = (data?.agent?.demo_assets || data?.demo_assets) as DemoAssetLike[] | undefined
          const demoPreviewStr = data?.agent?.demo_preview?.trim()
          const rawPreviewUrl =
            getPreviewUrlFromDemoAssets(agentAssets)
            || getPreviewUrlFromDemoPreviewString(demoPreviewStr)
            || (demoPreviewStr ? demoPreviewStr.split(',')[0]?.trim() : undefined)
          const previewUrl = normalizePreviewUrl(rawPreviewUrl) || rawPreviewUrl
          const hasPreview = Boolean(
            demoPreviewStr
            || (agentAssets && agentAssets.length > 0)
          )
          const isVideo = isVideoPreviewUrl(rawPreviewUrl)
          const isYoutube = previewUrl ? isYoutubeUrl(previewUrl) : false
          const isVimeo = previewUrl ? isVimeoUrl(previewUrl) : false
          if (!hasPreview || !previewUrl) return null
          return (
                <div
                  ref={demoPreviewContainerRef}
                  style={{
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                width: '280px',
                height: '180px',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#E5E7EB',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                zIndex: 10,
                cursor: isVideo ? 'default' : 'pointer',
              }}
            >
              {/* Expand button – fullscreen video/preview on click */}
              <button
                type="button"
                onClick={() => {
                  const el = demoPreviewContainerRef.current
                  if (el && typeof el.requestFullscreen === 'function') {
                    el.requestFullscreen().catch(() => {})
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.5)',
                  border: 'none',
                  color: '#fff',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
                aria-label="Expand video"
              >
                <Maximize2 size={14} strokeWidth={2.5} />
              </button>

              {/* Play overlay only when preview is image (not video) */}
              {!isVideo && (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.95)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="#344054">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
              </div>
              )}

              {/* Auto-playing video when API returns a video URL */}
              {isVideo && previewUrl ? (
                isYoutube ? (
                  <iframe
                    src={getYoutubeEmbedUrl(previewUrl, { autoplay: true, mute: true, loop: true })}
                    title="Demo video"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : isVimeo ? (
                  <iframe
                    src={`${getVimeoEmbedUrl(previewUrl)}?autoplay=1&muted=1&loop=1`}
                    title="Demo video"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={previewUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    title="Demo preview"
                  />
                )
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Demo preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #E5E7EB, #D1D5DB)' }} />
              )}
            </div>
          )
        })()}

      </section>

      {/* Capabilities – Rectangle 34624664 gradient + Group 1410104279 */}
      <section id="capabilities" className="relative py-16 px-4 md:px-8" style={{ overflowX: 'hidden', minHeight: '600px', background: 'linear-gradient(180deg, #FEFEFF 0%, #F5F5F5 49.52%, #FFFFFF 100%)' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1280px', minHeight: '510px' }}>
          {overviewVariant === 'usecase' ? (
            /* Use-case layout: two columns – left label+heading, right capability list with click-to-expand */
            (() => {
              const featuresStr = (agent?.features && String(agent.features).trim() && agent.features !== 'na') ? String(agent.features).replace(/\\n/g, '\n') : ''
              const partsBySemicolon = featuresStr ? featuresStr.split(';').map((s: string) => s.trim()).filter(Boolean) : []
              const capabilitiesHeading = partsBySemicolon.length > 0
                ? partsBySemicolon[0]
                : (agent?.by_value?.trim() || (agent?.description?.trim() ? (agent.description.split(/[.!?]/)[0]?.trim() || agent.description.slice(0, 80)) : '') || 'Everything you need to manage NPA portfolios efficiently and accurately.')
              const rawFromFeatures = partsBySemicolon.length > 1 ? partsBySemicolon.slice(1) : (featuresStr && partsBySemicolon.length <= 1 ? [] : [])
              const fromCapabilities = (data?.capabilities ?? []).map((c: { by_capability?: string }) => (c.by_capability || '').trim()).filter(Boolean)
              const rawItems = rawFromFeatures.length > 0 ? rawFromFeatures : (fromCapabilities.length > 0 ? fromCapabilities : (featuresStr && !featuresStr.includes(';') ? featuresStr.split(/\s*[|]\s*|\n+/).map((s: string) => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, '').replace(/^\d+\.\s*/, '')).filter(Boolean) : []))
              const parsedFeatures = rawItems.map((item: string) => {
                const colonMatch = item.match(/^([^:]{2,80}):\s*(.+)$/)
                const dashMatch = item.match(/^([^\u2013\u2014-]{2,80})\s*[\u2013\u2014-]\s*(.+)$/)
                if (colonMatch) return { title: colonMatch[1].trim(), description: colonMatch[2].trim() }
                if (dashMatch) return { title: dashMatch[1].trim(), description: dashMatch[2].trim() }
                const words = item.split(/\s+/)
                if (words.length > 5) return { title: words.slice(0, 3).join(' '), description: item }
                return { title: item, description: '' }
              })
              const defaultUseCaseItems: Array<{ title: string; description: string }> = [
                { title: 'Automated Email Intake', description: 'Automatically capture and process NPA pool submissions from email with intelligent attachment parsing and data extraction' },
                { title: 'Smart Data Mapping', description: 'Map and transform data across sources with intelligent field mapping and validation.' },
                { title: 'AI Sampling Strategies', description: 'Apply AI-driven sampling strategies for efficient portfolio analysis and risk assessment.' },
                { title: 'ARCIL Valuation', description: 'Perform ARCIL-compliant valuation and reporting for NPA portfolios.' },
                { title: 'External Valuation', description: 'Integrate external valuation sources and reconcile with internal models.' },
                { title: 'Legal Due Diligence', description: 'Support legal due diligence with document review and compliance checks.' },
              ]
              const displayItems = parsedFeatures.length > 0
                ? parsedFeatures.slice(0, 6).map((f, i) => ({ title: f.title, description: f.description || defaultUseCaseItems[i]?.description || '' }))
                : defaultUseCaseItems

              const useCaseIcons = [
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-0"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#FF9231" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M22 6l-10 7L2 6" stroke="#FF9231" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-1"><ellipse cx="12" cy="6" rx="4" ry="2" stroke="#F05283" strokeWidth="1.5" /><path d="M4 6v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6" stroke="#F05283" strokeWidth="1.5" strokeLinecap="round" /><path d="M4 12h16" stroke="#F05283" strokeWidth="1.5" strokeLinecap="round" /></svg>,
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-2"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="#8F2B8C" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="12" r="3" stroke="#8F2B8C" strokeWidth="1.5" /></svg>,
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-3"><circle cx="9" cy="9" r="3" stroke="#F5319D" strokeWidth="1.5" /><circle cx="15" cy="15" r="3" stroke="#F5319D" strokeWidth="1.5" /><path d="M9 12h6" stroke="#F5319D" strokeWidth="1.5" strokeLinecap="round" /></svg>,
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-4"><path d="M18 20V10M12 20V4M6 20v-6" stroke="#722ED1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="uc-5"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#FF9231" strokeWidth="1.5" strokeDasharray="2 2" /><path d="M8 8h8v8H8z" stroke="#FF9231" strokeWidth="1" strokeOpacity={0.72} /></svg>,
              ]

              return (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', justifyContent: 'center', alignItems: 'flex-start' }}>
                  {/* Left: Group 1410104272 – label + heading (579px) */}
                  <div style={{ width: '100%', maxWidth: '579px', flex: '1 1 379px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ width: '32px', height: '1px', background: '#0A0A0A', flexShrink: 0 }} aria-hidden />
                      <span style={{ fontFamily: "'Geist Mono', monospace", fontWeight: 400, fontSize: '12px', lineHeight: '16px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#0A0A0A' }}>
                        CAPABILITIES
                      </span>
                    </div>
                    <h2
                      style={{
                        fontFamily: "'Geist', var(--font-geist-sans), sans-serif",
                        fontWeight: 300,
                        fontSize: '36px',
                        lineHeight: '40px',
                        margin: 0,
                        background: 'linear-gradient(90deg, #0023F6 0%, #008F59 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      {capabilitiesHeading}
                    </h2>
                  </div>
                  {/* Right: Group 1410104331 – capability list (576px) */}
                  <div style={{ width: '100%', maxWidth: '576px', flex: '1 1 576px', minWidth: 0 }}>
                    {displayItems.map((feature, i) => {
                      const isExpanded = expandedCapabilityIndex === i
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setExpandedCapabilityIndex(isExpanded ? null : i)}
                          style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: isExpanded ? '15px 0 24px' : '27px 0',
                            minHeight: isExpanded ? 110 : 80,
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            borderBottom: i < displayItems.length - 1 ? '1px solid #E5E7EB' : undefined,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <span style={{ flexShrink: 0, marginTop: 2 }}>{useCaseIcons[i % useCaseIcons.length]}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h3
                                style={{
                                  fontFamily: "'Poppins', sans-serif",
                                  fontWeight: 500,
                                  fontSize: '18px',
                                  lineHeight: '26px',
                                  color: '#333333',
                                  margin: 0,
                                }}
                              >
                                {feature.title}
                              </h3>
                              {isExpanded && feature.description && (
                                <p
                                  style={{
                                    fontFamily: "'Geist', var(--font-geist-sans), sans-serif",
                                    fontWeight: 400,
                                    fontSize: '14px',
                                    lineHeight: '23px',
                                    color: '#737373',
                                    margin: '8px 0 0 0',
                                    maxWidth: '528px',
                                  }}
                                >
                                  {feature.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })()
          ) : (
            <>
          {/* Group 1410104272: Capabilities label + heading – 769px centered */}
          <div style={{ width: '100%', maxWidth: '769px', margin: '0 auto 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} aria-hidden />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '12px', lineHeight: '16px', letterSpacing: '1.2px', textAlign: 'center', textTransform: 'uppercase', color: '#111827' }}>
                CAPABILITIES
              </span>
              <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} aria-hidden />
            </div>
          {(() => {
            const featuresStr = (agent?.features && String(agent.features).trim() && agent.features !== 'na') ? String(agent.features).replace(/\\n/g, '\n') : ''
            const partsBySemicolon = featuresStr ? featuresStr.split(';').map((s: string) => s.trim()).filter(Boolean) : []
            const capabilitiesHeading = partsBySemicolon.length > 0
              ? partsBySemicolon[0]
              : (agent?.by_value?.trim() || (agent?.description?.trim() ? (agent.description.split(/[.!?]/)[0]?.trim() || agent.description.slice(0, 80)) : '') || 'Everything you need to manage NPA portfolios efficiently and accurately')
              return (
                <h2
                  style={{
                    fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                    fontWeight: 300,
                    fontStyle: 'normal',
                    fontSize: '36px',
                    lineHeight: '40px',
                    textAlign: 'center',
                    margin: 0,
                    background: 'linear-gradient(90deg, #0023F6 0%, #008F59 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {capabilitiesHeading}
                </h2>
              )
            })()}
          </div>

          {/* Group 1410104253 / 1410104248: List items grid – 1365px, 3 cols x 455px, 229px height */}
          {(() => {
            const featuresStr = (agent?.features && String(agent.features).trim() && agent.features !== 'na') ? String(agent.features).replace(/\\n/g, '\n') : ''
            const partsBySemicolon = featuresStr ? featuresStr.split(';').map((s: string) => s.trim()).filter(Boolean) : []
            const rawFromFeatures = partsBySemicolon.length > 1
              ? partsBySemicolon.slice(1)
              : (featuresStr && partsBySemicolon.length <= 1 ? [] : [])
            const fromCapabilities = (data?.capabilities ?? []).map((c: { by_capability?: string }) => (c.by_capability || '').trim()).filter(Boolean)
            const rawItems = rawFromFeatures.length > 0 ? rawFromFeatures : (fromCapabilities.length > 0 ? fromCapabilities : (featuresStr && !featuresStr.includes(';') ? featuresStr.split(/\s*[|]\s*|\n+/).map((s: string) => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, '').replace(/^\d+\.\s*/, '')).filter(Boolean) : []))
            const features = rawItems.map((item: string) => {
              const colonMatch = item.match(/^([^:]{2,80}):\s*(.+)$/)
              const dashMatch = item.match(/^([^\u2013\u2014-]{2,80})\s*[\u2013\u2014-]\s*(.+)$/)
              if (colonMatch) return { title: colonMatch[1].trim(), description: colonMatch[2].trim() }
              if (dashMatch) return { title: dashMatch[1].trim(), description: dashMatch[2].trim() }
              const words = item.split(/\s+/)
              if (words.length > 5) return { title: words.slice(0, 3).join(' '), description: item }
              return { title: item, description: '' }
            })
            const displayItems = features.length > 0 ? features : [{ title: 'Everything you need', description: description || 'Capabilities and features for this agent.' }]

            const featureIcons = [
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="icon-0"><path d="M4 8l8 5 8-5M4 8v8a2 2 0 002 2h12a2 2 0 002-2V8M4 8l8-3 8 3" stroke="#FF9231" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="icon-1"><path d="M8 6h8M8 10h8M8 14h5" stroke="#F05283" strokeWidth="1.5" strokeLinecap="round" /><circle cx="17" cy="17" r="3" stroke="#F05283" strokeWidth="1.5" /></svg>,
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="icon-2"><path d="M12 4v4m0 8v4m-6-8H4m16 0h-2m-1.5-5.5L15 8m-6 8l-1.5 1.5m9-1.5L15 16M9 8L7.5 6.5" stroke="#8F2B8C" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="12" r="3" stroke="#8F2B8C" strokeWidth="1.5" /></svg>,
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="icon-3"><path d="M4 20l5-5 3 3 8-8" stroke="#F5319D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 8h4v4" stroke="#F5319D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="icon-4"><path d="M10 14l4-4m0 0v3m0-3h-3" stroke="#722ED1" strokeWidth="1.5" strokeLinecap="round" /><rect x="5" y="5" width="14" height="14" rx="2" stroke="#722ED1" strokeWidth="1.5" /></svg>,
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" key="icon-5"><path d="M12 3l7 4v5c0 4.5-3 8.5-7 9.5-4-1-7-5-7-9.5V7l7-4z" stroke="#FF9231" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" stroke="#FF9231" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>,
            ]

            const totalRows = Math.ceil(displayItems.length / 3)
            return (
                <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(280px, 1fr))',
                  maxWidth: '100%',
                  margin: '0 auto',
                }}
              >
                {displayItems.map((feature, i) => {
                  const col = i % 3
                  const row = Math.floor(i / 3)
                  const isLastRow = row === totalRows - 1
                  return (
                  <div
                    key={i}
                    style={{
                        width: '100%',
                        maxWidth: '455px',
                        minHeight: '229px',
                        padding: '29px 21px',
                        borderBottom: '1px solid #E5E7EB',
                        borderLeft: col !== 0 ? '1px solid #E5E7EB' : undefined,
                        borderRadius: isLastRow ? 4 : undefined,
                        boxSizing: 'border-box',
                      }}
                    >
                      {/* Icon – 32x32 at top 29px */}
                      <div style={{ marginBottom: '32px' }}>
                      {featureIcons[i % featureIcons.length]}
                    </div>
                      {/* Title – Poppins 500, 18px, 26px, #333333 */}
                    <h3
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontStyle: 'normal',
                        fontSize: '18px',
                        lineHeight: '26px',
                        color: '#333333',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {feature.title}
                    </h3>
                      {/* Description – Poppins 400, 14px, 24px, #4B4B4B, max 400px */}
                    {feature.description && (
                      <p
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '14px',
                          lineHeight: '24px',
                          color: '#4B4B4B',
                          margin: 0,
                            maxWidth: '400px',
                        }}
                      >
                        {feature.description}
                      </p>
                    )}
                  </div>
                  )
                })}
                {displayItems.length % 3 !== 0 &&
                  Array.from({ length: 3 - (displayItems.length % 3) }).map((_, i) => {
                    const col = (displayItems.length + i) % 3
                    const row = Math.floor(displayItems.length / 3)
                    const isLastRow = row === totalRows - 1
                    return (
                    <div
                      key={`empty-${i}`}
                      style={{
                          minHeight: '229px',
                          borderBottom: '1px solid #E5E7EB',
                          borderLeft: col !== 0 ? '1px solid #E5E7EB' : undefined,
                          borderRadius: isLastRow ? 4 : undefined,
                        }}
                      />
                    )
                  })
                }
                  </div>
            )
          })()}
            </>
          )}

          {/* ΓöÇΓöÇ 4. Sidebar: Related Agents (below the grid now) ΓöÇΓöÇ DISABLED
          {relatedAgents.length > 0 && (
            <div style={{ marginTop: '48px', maxWidth: '560px', marginLeft: 'auto', marginRight: 'auto' }}>
              <div className="w-full bg-white rounded-xl shadow-md border border-gray-200">
                <RelatedAgentsSidebar
                  relatedAgents={relatedAgents}
                  agentName={agent?.agent_name}
                  agentsSource={agentsSource}
                />
                </div>
            </div>
          )}
          */}

        </div>
      </section>

      {/* How It Works – Group 1410104280: header 769px + two-column 576px steps | 720px illustration */}
      <section id="how-it-works" className="relative py-16 px-4 md:px-8" style={{ overflowX: 'hidden', background: '#FFFFFF' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1359px' }}>
          {/* Group 1410104278: How It Works label + heading – 769px centered */}
          <div style={{ width: '100%', maxWidth: '769px', margin: '0 auto 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} aria-hidden />
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '1.2px',
                textAlign: 'center',
                textTransform: 'uppercase',
                color: '#111827',
              }}
            >
              {(agent as { workflow_section_label?: string })?.workflow_section_label?.trim() ||
                (data?.agent as { workflow_section_label?: string })?.workflow_section_label?.trim() ||
                'HOW IT WORKS'}
            </span>
              <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} aria-hidden />
          </div>
          <h2
            style={{
              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
              fontWeight: 300,
              fontStyle: 'normal',
              fontSize: '36px',
              lineHeight: '40px',
              textAlign: 'center',
                margin: 0,
              background: 'linear-gradient(90deg, #0023F6 0%, #008F59 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {(agent as { workflow_section_title?: string })?.workflow_section_title?.trim() ||
              (data?.agent as { workflow_section_title?: string })?.workflow_section_title?.trim() ||
              'See how our agent perform each stage in the Npa valuation like an SME'}
          </h2>
          </div>

          {/* Group 1410104255: two-column – left 576px steps (Group 1410104254), right 720px illustration */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 576px) minmax(0, 720px)',
              gap: '63px',
              alignItems: 'start',
              maxWidth: '1359px',
              justifyContent: 'center',
            }}
            className="max-md:grid-cols-1"
          >
            {/* Left column – steps: each Button 576px x 110px */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                maxWidth: '576px',
                minHeight: '660px',
              }}
            >
              {workflowSteps.map((step, idx) => {
                const isSelected = selectedWorkflowStepIndex === idx
                return (
                  <button
                    key={step.num}
                    type="button"
                    onClick={() => setSelectedWorkflowStepIndex(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 0,
                      width: '100%',
                      maxWidth: '576px',
                      minHeight: '110px',
                      padding: '25px 0 28px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      background: isSelected ? 'rgba(0, 35, 246, 0.06)' : 'transparent',
                      border: 'none',
                      borderLeft: isSelected ? '3px solid #0023F6' : '3px solid transparent',
                      paddingLeft: isSelected ? '13px' : '0',
                      marginLeft: 0,
                      boxSizing: 'border-box',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Geist Mono, var(--font-geist-mono), monospace',
                        fontWeight: 400,
                        fontSize: '12px',
                        lineHeight: '16px',
                        color: '#737373',
                        flexShrink: 0,
                        width: '24px',
                      }}
                    >
                      {step.num}
                    </span>
                    <div style={{ paddingLeft: '14px', flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 500,
                          fontSize: '18px',
                          lineHeight: '26px',
                          color: '#333333',
                          margin: '0 0 8px 0',
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '23px',
                          color: '#737373',
                          margin: 0,
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Right column – Rectangle 34624649: 720px x 640px, border-radius 24px */}
            <div
              style={{
                width: '100%',
                maxWidth: '720px',
                height: '640px',
                borderRadius: '24px',
                overflow: 'hidden',
                background: workflowPanelImageUrls.length > 0 ? '#f5f5f5' : 'linear-gradient(180deg, #FFF8E7 0%, #E8F4F0 50%, #D6E8E4 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px',
              }}
            >
              {workflowPanelImageUrls.length > 0 ? (
                (() => {
                  const imgIndex = selectedWorkflowStepIndex % workflowPanelImageUrls.length
                  const src = normalizePreviewUrl(workflowPanelImageUrls[imgIndex])
                  return src ? (
                    <img
                      src={src}
                      alt={`Workflow step ${selectedWorkflowStepIndex + 1}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        borderRadius: '8px',
                      }}
                    />
                  ) : null
                })()
              ) : (
                <svg width="100%" height="280" viewBox="0 0 400 280" fill="none" style={{ maxWidth: '380px' }}>
                  {/* Envelope (left) */}
                  <g transform="translate(48, 72)">
                    <path
                      d="M2 6 L12 14 L22 6 L22 20 L2 20 Z"
                      fill="#B3E5FC"
                      stroke="#81D4FA"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                  </g>
                  {/* Document / card */}
                  <rect x="140" y="70" width="80" height="50" rx="6" fill="white" stroke="#E0E0E0" strokeWidth="1" />
                  <line x1="152" y1="84" x2="208" y2="84" stroke="#E0E0E0" strokeWidth="1" />
                  <line x1="152" y1="92" x2="200" y2="92" stroke="#E0E0E0" strokeWidth="1" />
                  <line x1="152" y1="100" x2="192" y2="100" stroke="#E0E0E0" strokeWidth="1" />
                  {/* Purple circle */}
                  <circle cx="200" cy="55" r="12" fill="#B39DDB" stroke="#9575CD" strokeWidth="1" />
                  <circle cx="200" cy="55" r="4" fill="white" />
                  {/* Flow line: envelope → pill */}
                  <path
                    d="M 85 115 Q 120 140 160 160 L 240 200 L 300 220"
                    stroke="#1E3A8A"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <polygon points="300,220 292,214 292,226" fill="#1E3A8A" />
                  <circle cx="85" cy="115" r="4" fill="#1E3A8A" />
                  {/* Asterisk-like node */}
                  <g transform="translate(108, 128)">
                    <path d="M0-6L0 6M-6 0L6 0M-4-4L4 4M-4 4L4-4" stroke="#9E9E9E" strokeWidth="1.2" strokeLinecap="round" />
                  </g>
                  {/* Pill shape (right) */}
                  <rect x="280" y="195" width="80" height="32" rx="16" fill="url(#howItWorksPill)" />
                  <defs>
                    <linearGradient id="howItWorksPill" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#7E57C2" />
                      <stop offset="100%" stopColor="#1E88E5" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits & Value Proposition – Group 1410104287: 1334×389, header 769×71, cards row 1334×270 */}
      <section id="value-proposition" className="relative py-16 px-4 md:px-8" style={{ overflowX: 'visible' }}>
        <div className="w-full mx-auto" style={{ width: '100%', maxWidth: '1334px', overflow: 'visible' }}>
          {/* Group 1410104278: label + heading – 769×71, centered */}
          <div style={{ width: '100%', maxWidth: '769px', minHeight: '71px', margin: '0 auto 48px' }}>
            {/* Group 1410104274: Horizontal Divider + Key Benefits label + Horizontal Divider */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} aria-hidden />
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  textAlign: 'center',
                  letterSpacing: '1.2px',
                  textTransform: 'uppercase',
                  color: '#111827',
                }}
              >
                KEY BENEFITS & VALUE PROPOSITION
              </span>
              <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} aria-hidden />
            </div>
            {/* Heading 2 – 769×40, Geist 300 36px/40px, center, gradient */}
            <h2
              style={{
                fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                fontStyle: 'normal',
                fontWeight: 300,
                fontSize: '36px',
                lineHeight: '40px',
                textAlign: 'center',
                margin: 0,
                background: 'linear-gradient(90deg, #0023F6 0%, #008F59 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Agent gives better ROI than Manual operations
            </h2>
          </div>

          {/* Group 1410104285: ROI cards row – 1334×270, 4×320px cards, gap 18px */}
          {(() => {
            const accents = [
              { dot: '#1C69E3', numColor: '#1C69E3' },
              { dot: '#00B388', numColor: '#00B388' },
              { dot: '#CF57C8', numColor: '#CF57C8' },
              { dot: '#DE8900', numColor: '#DE8900' },
              { dot: '#1C69E3', numColor: '#1C69E3' },
              { dot: '#00B388', numColor: '#00B388' },
              { dot: '#CF57C8', numColor: '#CF57C8' },
              { dot: '#DE8900', numColor: '#DE8900' },
            ];

            const rawItems = (agent?.roi && agent.roi !== 'na')
              ? agent.roi
                .replace(/\\n/g, '\n')
                .split(/[;\n]+/)
                .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, '').replace(/^\d+\.\s*/, ''))
                .filter(Boolean)
              : [];

            const roiCards = rawItems.map((item) => {
              const colonMatch = item.match(/^([^:]{3,60}):\s*(.+)$/);
              const dashMatch = item.match(/^([^ΓÇôΓÇö-]{3,60})\s*[ΓÇôΓÇö-]\s*(.+)$/);
              let title = '';
              let description = '';
              if (colonMatch) {
                title = colonMatch[1].trim();
                description = colonMatch[2].trim();
              } else if (dashMatch) {
                title = dashMatch[1].trim();
                description = dashMatch[2].trim();
              } else {
                const words = item.split(' ');
                if (words.length > 5) {
                  title = words.slice(0, 3).join(' ');
                  description = item;
                } else {
                  title = item;
                  description = '';
                }
              }
              // "X - Benefit" → show "Benefit" (coloured) and X as description (normal black)
              const isBenefitFormat = /^Benefit$/i.test((description || '').trim());
              if (isBenefitFormat && title) {
                description = title;
                title = 'Benefit';
              }
              const statMatch = (title + ' ' + description).match(/(\d+[\.\d]*\s*[%xX├ù]|\d+[\.\d]*\s*(?:hours?|mins?|days?|patents?|reduction|savings?))/i);
              const stat = statMatch ? statMatch[1].trim() : '';
              return { title, description, stat, isBenefitFormat };
            });

            const displayCards = roiCards.slice(0, 8);
            const colCount = Math.min(displayCards.length, 4);

            return (
              <div
                style={{
                  width: '100%',
                  maxWidth: '1334px',
                  minHeight: '270px',
                  margin: '0 auto',
                  display: 'grid',
                  gridTemplateColumns: `repeat(${colCount}, minmax(0, 320px))`,
                  gap: '18px',
                  justifyContent: 'center',
                }}
              >
                {displayCards.map((card, i) => {
                  const accent = accents[i % accents.length];
                  return (
                    <div
                      key={i}
                      style={{
                        boxSizing: 'border-box',
                        width: '100%',
                        maxWidth: '320px',
                        minWidth: 0,
                        height: '270px',
                        background: '#FFFFFF',
                        border: '1px solid rgba(229, 229, 229, 0.6)',
                        position: 'relative',
                        padding: 0,
                        justifySelf: 'center',
                      }}
                    >
                      {/* Background – 6×6 dot, left 21px, top 25.5px */}
                      <div
                        style={{
                          position: 'absolute',
                          width: '6px',
                          height: '6px',
                          left: '21px',
                          top: '25.5px',
                          borderRadius: '50%',
                          background: accent.dot,
                        }}
                        aria-hidden
                      />
                      {/* Number – Geist Mono 400 10px/15px, letter-spacing 1px, left 35px top 21px */}
                      <span
                        style={{
                          position: 'absolute',
                          left: '35px',
                          top: '21px',
                          fontFamily: "'Geist Mono', monospace",
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '10px',
                          lineHeight: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          letterSpacing: '1px',
                          color: accent.numColor,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {/* Non-numeric Benefit format: Benefit at top (coloured), then description below (normal black). Else: title at top, description below. */}
                      {(card as { isBenefitFormat?: boolean }).isBenefitFormat ? (
                        <>
                          <h3
                            style={{
                              position: 'absolute',
                              left: '21px',
                              top: '52px',
                              right: '21px',
                              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '20px',
                              color: accent.numColor,
                              margin: 0,
                            }}
                          >
                            {card.title}
                          </h3>
                          {card.description && (
                            <p
                              style={{
                                position: 'absolute',
                                left: '21px',
                                top: '82px',
                                right: '21px',
                                maxHeight: '67px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '20px',
                                color: '#0A0A0A',
                                margin: 0,
                              }}
                            >
                              {card.description}
                            </p>
                          )}
                        </>
                      ) : (
                        <>
                          <h3
                            style={{
                              position: 'absolute',
                              left: '21px',
                              top: '52px',
                              right: '21px',
                              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '20px',
                              color: '#0A0A0A',
                              margin: 0,
                            }}
                          >
                            {card.title}
                          </h3>
                          {card.description && (
                            <p
                              style={{
                                position: 'absolute',
                                left: '21px',
                                top: '82px',
                                right: '21px',
                                maxHeight: '67px',
                                overflow: 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                                fontWeight: 400,
                                fontSize: '12px',
                                lineHeight: '20px',
                                color: '#737373',
                                margin: 0,
                              }}
                            >
                              {card.stat
                                ? card.description
                                    .replace(/\s+[-–—]\s*$/, '')
                                    .replace(new RegExp('\\s*[-–—]\\s*' + (card.stat || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$'), '')
                                    .trim()
                                : card.description}
                            </p>
                          )}
                        </>
                      )}
                      {/* Bottom row: stat (left) + arrow (right), vertically aligned with metric baseline */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '21px',
                          right: '21px',
                          bottom: '18px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                            fontStyle: 'normal',
                            fontWeight: 300,
                            fontSize: '18px',
                            lineHeight: '28px',
                            color: '#0A0A0A',
                          }}
                        >
                          {card.stat || card.title.split(' ').slice(0, 2).join(' ')}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          style={{
                            flexShrink: 0,
                            transform: 'rotate(-45deg)',
                          }}
                          aria-hidden
                        >
                          <path d="M3 8h10m0 0L9 4m4 4L9 12" stroke="#737373" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  );
                })}
                {displayCards.length % colCount !== 0 &&
                  Array.from({ length: colCount - (displayCards.length % colCount) }).map((_, i) => (
                    <div key={`empty-${i}`} style={{ width: '320px', height: '270px', boxSizing: 'border-box' }} />
                  ))
                }
              </div>
            );
          })()}

        </div>
      </section>
      {/* Agents & Model Powering – only when we have bundled/similar agents from API; hidden on use case detail page */}
      {overviewVariant !== 'usecase' && relatedAgents.length > 0 && (
      <section id="agent-powering" className="relative pt-16 pb-10 px-4 md:px-8" style={{ overflowX: 'hidden', background: 'linear-gradient(180deg, #FFFFFF 0%, #F7F0E8 76.44%, #FAFAFA 100%)' }}>
        <style dangerouslySetInnerHTML={{ __html: '.agent-powering-scroll-no-bar::-webkit-scrollbar { display: none; }' }} />
        <div className="w-full mx-auto" style={{ maxWidth: '1334px' }}>
          {/* Group 1410104275: label + heading – 769px centered */}
          <div style={{ width: '100%', maxWidth: '769px', margin: '0 auto 48px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} aria-hidden />
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500, fontSize: '12px', lineHeight: '16px', letterSpacing: '1.2px', textAlign: 'center', textTransform: 'uppercase', color: '#111827' }}>
                AGENTS & MODEL POWERING
              </span>
              <span style={{ width: '32px', height: '1px', background: '#1F2937', flexShrink: 0 }} aria-hidden />
            </div>
            <h2
              style={{
                fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                fontWeight: 300,
                fontStyle: 'normal',
                fontSize: '36px',
                lineHeight: '40px',
                textAlign: 'center',
                margin: 0,
                background: 'linear-gradient(90deg, #0023F6 0%, #008F59 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {agentsSource === 'similar'
                ? `Agents similar to ${title || 'this solution'}`
                : agentsSource === 'bundled'
                  ? `Agents and Models that combine to perform ${title || 'this solution'}`
                  : `Agents and Models that combine to perform ${title || 'this solution'}`}
            </h2>
          </div>

          {/* Category tabs – All, Banking, Retail, Healthcare, Manufacturing (working) */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px', maxWidth: '1325px' }}>
            {AGENT_POWERING_CATEGORIES.map((cat) => {
              const active = agentPoweringCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setAgentPoweringCategory(cat)}
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '9px 20px',
                    gap: '10px',
                    background: active ? '#1F1F1F' : '#FFFFFF',
                    border: '1px solid #E5E5E5',
                    borderRadius: '8px',
                    fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                    fontWeight: 400,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: active ? '#FFFFFF' : '#737373',
                    cursor: 'pointer',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Search row + single sort dropdown (Recommended default, Filter A-Z in dropdown) */}
          <div style={{ width: '100%', maxWidth: '1325px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '18px', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px' }}>
            <div
              style={{
                boxSizing: 'border-box',
                flex: 1,
                maxWidth: '1151px',
                height: '40px',
                background: '#FFFFFF',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 13px 0 13px',
                gap: '8px',
              }}
            >
              <Search size={20} style={{ color: '#828282', flexShrink: 0 }} aria-hidden />
              <input
                type="text"
                placeholder="Search agents..."
                aria-label="Search agents"
                value={agentPoweringSearch}
                onChange={(e) => setAgentPoweringSearch(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'Arial, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#1F1F1F',
                }}
              />
            </div>
            <div ref={agentPoweringSortDropdownRef} style={{ position: 'relative' }}>
              <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={agentPoweringSortDropdownOpen}
                aria-label="Sort order"
                onClick={() => setAgentPoweringSortDropdownOpen((prev) => !prev)}
                style={{
                  boxSizing: 'border-box',
                  width: '150px',
                  height: '40px',
                  background: '#FFFFFF',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '0 15px',
                  border: '1px solid #EAECF0',
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontFamily: 'Inter, sans-serif', fontStyle: 'normal', fontWeight: 500, fontSize: '14px', lineHeight: '20px', display: 'flex', alignItems: 'center', color: '#344054' }}>
                  {agentPoweringSortOrder === 'recommended' ? 'Recommended' : 'Filter A-Z'}
                </span>
                <ChevronDown size={16} style={{ color: '#344054', transform: agentPoweringSortDropdownOpen ? 'rotate(180deg)' : 'none' }} />
              </button>
              {agentPoweringSortDropdownOpen && (
                <div
                  role="listbox"
                  aria-label="Sort options"
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    minWidth: '150px',
                    background: '#FFFFFF',
                    border: '1px solid #EAECF0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 10,
                    overflow: 'hidden',
                  }}
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={agentPoweringSortOrder === 'recommended'}
                    onClick={() => { setAgentPoweringSortOrder('recommended'); setAgentPoweringSortDropdownOpen(false) }}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      textAlign: 'left',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#344054',
                      background: agentPoweringSortOrder === 'recommended' ? '#F9FAFB' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Recommended
                  </button>
                  <button
                    type="button"
                    role="option"
                    aria-selected={agentPoweringSortOrder === 'a-z'}
                    onClick={() => { setAgentPoweringSortOrder('a-z'); setAgentPoweringSortDropdownOpen(false) }}
                    style={{
                      width: '100%',
                      padding: '10px 15px',
                      textAlign: 'left',
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#344054',
                      background: agentPoweringSortOrder === 'a-z' ? '#F9FAFB' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Filter A-Z
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tags from API (unique from related agents), excluding "More..." */}
          <div style={{ width: '100%', maxWidth: '1325px', marginLeft: 'auto', marginRight: 'auto', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {agentPoweringTagsFromApi.map((tag) => {
              const active = agentPoweringTag === tag
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setAgentPoweringTag(active ? null : tag)}
                  style={{
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '11px 18px',
                    gap: '10px',
                    height: '42px',
                    background: active ? '#1F1F1F' : '#FFFFFF',
                    border: '1px solid #EAECF0',
                    borderRadius: '999px',
                    fontFamily: 'Inter, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: active ? '#FFFFFF' : '#344054',
                    cursor: 'pointer',
                  }}
                >
                  {tag}
                </button>
              )
            })}
          </div>

          {/* Line 619 – divider 1319px */}
          <div style={{ width: '100%', maxWidth: '1319px', marginLeft: 'auto', marginRight: 'auto', height: 0, borderTop: '1px solid #E5E7EB', marginBottom: '24px' }} />

          {/* Cards: single row, 4 fitted; arrows below right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '1334.13px', margin: '0 auto' }}>
            <div
              ref={agentPoweringScrollRef}
              className="agent-powering-scroll-no-bar"
              onScroll={updateAgentPoweringScrollState}
              style={{
                width: '100%',
                minWidth: 0,
                overflowX: 'auto',
                overflowY: 'hidden',
                display: 'flex',
                flexWrap: 'nowrap',
                gap: `${AGENT_POWERING_GAP}px`,
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
            {agentPoweringSortedList.map((card, i) => {
              const label = agentsSource === 'bundled' ? 'Bundled Agent' : agentsSource === 'similar' ? 'Similar Agent' : 'AI Agent'
              const name = card.agent_name || 'Agent'
              const icon = (card as { placeholder?: { icon?: string } }).placeholder?.icon ?? '/img/agents/research-icon.png'
              const displayLabel = card.isLink ? label : (card as { placeholder?: { label?: string } }).placeholder?.label ?? label
              return (
                <div
                  key={(card.agent_id ?? '') + i}
                  role="button"
                  tabIndex={0}
                  onClick={() => setAgentPoweringModalCard(card)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setAgentPoweringModalCard(card) } }}
                  style={{
                    boxSizing: 'border-box',
                    width: `${agentPoweringCardWidth}px`,
                    minWidth: `${agentPoweringCardWidth}px`,
                    height: '257px',
                    background: '#FFFFFF',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '22px 24px 24px',
                    gap: '12px',
                  }}
                >
                  {/* Top row: label + icon */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', flexShrink: 0 }}>
                    <span
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        fontSize: '13.3px',
                        lineHeight: '14px',
                        letterSpacing: '0.169px',
                        color: 'rgba(0, 0, 0, 0.87)',
                      }}
                    >
                      {displayLabel}
                    </span>
                    <div style={{ width: 48, height: 48, flexShrink: 0 }}>
                      <Image src={icon} alt="" width={48} height={48} className="object-contain" />
                    </div>
                  </div>
                  {/* Title – grows to fill space, clamps to 2 lines */}
                  <h3
                    style={{
                      flex: '1 1 auto',
                      minHeight: 0,
                      fontFamily: 'Inter, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '22.5px',
                      lineHeight: '32px',
                      letterSpacing: '0.169px',
                      color: 'rgba(0, 0, 0, 0.87)',
                      margin: 0,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {name}
                  </h3>
                  {/* BY CRAYON DATA – always below title */}
                  <span
                    style={{
                      flexShrink: 0,
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 400,
                      fontSize: '13.3px',
                      lineHeight: '14px',
                      color: 'rgba(0, 0, 0, 0.87)',
                      textTransform: 'uppercase',
                    }}
                  >
                    BY CRAYON DATA
                  </span>
                </div>
              )
            })}
            </div>
            {agentPoweringHasMore ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  aria-label="Previous agents"
                  onClick={() => scrollAgentPowering('prev')}
                  disabled={agentPoweringAtStart}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    background: !agentPoweringAtStart ? '#FFFFFF' : '#F3F4F6',
                    color: !agentPoweringAtStart ? '#374151' : '#9CA3AF',
                    cursor: !agentPoweringAtStart ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    lineHeight: 1,
                  }}
                >
                  &lt;
                </button>
                <button
                  type="button"
                  aria-label="Next agents"
                  onClick={() => scrollAgentPowering('next')}
                  disabled={agentPoweringAtEnd}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    background: !agentPoweringAtEnd ? '#FFFFFF' : '#F3F4F6',
                    color: !agentPoweringAtEnd ? '#374151' : '#9CA3AF',
                    cursor: !agentPoweringAtEnd ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    lineHeight: 1,
                  }}
                >
                  &gt;
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      )}
      <section id="tech-security" className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden', background: '#FFFFFF' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1102px' }}>

          {/* 1. "TECH & SECURITY" Label with left/right lines (32px #1F2937) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px', maxWidth: '769px', marginLeft: 'auto', marginRight: 'auto' }}>
            <span style={{ width: '32px', height: '1px', backgroundColor: '#1F2937', flexShrink: 0 }} aria-hidden />
            <span
                                style={{
                                  fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                                  fontStyle: 'normal',
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '1.2px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                textTransform: 'uppercase',
                color: '#111827',
              }}
            >
              TECH & SECURITY
            </span>
            <span style={{ width: '32px', height: '1px', backgroundColor: '#1F2937', flexShrink: 0 }} aria-hidden />
                            </div>

          {/* 2. Section Heading (gradient text, 769px centered) */}
          <h2
            style={{
              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
              fontWeight: 300,
              fontStyle: 'normal',
              fontSize: '36px',
              lineHeight: '40px',
              textAlign: 'center',
              maxWidth: '769px',
              margin: '0 auto 48px',
              background: 'linear-gradient(90deg, #0023F6 0%, #008F59 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Enterprise-Grade Tech Stack, Security, Compliance & Governance
          </h2>

          {/* ΓöÇΓöÇ 4. Two-column layout: Tabs + Tech rows (from deployment API) left, Image right – grouped by AWS, Azure, GCP, Self-hosted, etc. ΓöÇΓöÇ */}
          {(() => {
            type DepItem = { by_capability_id?: string; capability_name?: string; by_capability?: string; service_provider?: string; service_name?: string; deployment?: string; cloud_region?: string }
            type CapItem = { serial_id?: string; by_capability?: string }
            const deployments = (data?.deployments ?? []) as DepItem[]
            const capabilitiesList = (data?.capabilities ?? []) as CapItem[]
            const securityDetails = data?.documentation?.[0]?.security_details?.trim()
            function getProviderGroup(d: DepItem): string {
              const raw = [d.service_provider, d.deployment, d.cloud_region].filter(Boolean).map((s) => String(s).toLowerCase()).join(' ')
              if (/aws|amazon/.test(raw)) return 'AWS'
              if (/azure|microsoft/.test(raw)) return 'Azure'
              if (/gcp|google|gke/.test(raw)) return 'GCP'
              if (/self|on-prem|onprem|premise|self-hosted|selfhosted|on-premise|private/.test(raw)) return 'Self-hosted'
              if (d.service_provider) return String(d.service_provider).trim()
              if (d.deployment) return String(d.deployment).trim()
              return 'Other'
            }
            function resolveTitleFromCapability(d: DepItem): string {
              if (d.by_capability_id && capabilitiesList.length > 0) {
                const cap = capabilitiesList.find((c: CapItem) => String(c.serial_id) === String(d.by_capability_id))
                if (cap?.by_capability?.trim()) return cap.by_capability.trim()
              }
              return (d.by_capability || d.capability_name || d.service_name || getProviderGroup(d)).trim() || getProviderGroup(d)
            }
            const providerOrder = ['AWS', 'Azure', 'GCP', 'Self-hosted', 'Other']
            const groups = new Map<string, { title: string; desc: string }[]>()
            if (deployments.length > 0 || securityDetails) {
              deployments.forEach((d: DepItem) => {
                const groupKey = getProviderGroup(d)
                const title = resolveTitleFromCapability(d)
                const parts = [d.service_provider, d.service_name, d.deployment, d.cloud_region].filter(Boolean).map((s) => String(s).trim())
                const desc = parts.length > 0 ? parts.join(' · ') : '—'
                if (!groups.has(groupKey)) groups.set(groupKey, [])
                groups.get(groupKey)!.push({ title, desc })
              })
              if (securityDetails) groups.set('Security', [{ title: 'Security', desc: securityDetails }])
            } else {
              groups.set('Overview', [
                { title: 'Core Platform', desc: 'FastAPI · SQLAlchemy · Pydantic · PostgreSQL · MySQL · UltraDB' },
                { title: 'AI & Automation', desc: 'OpenAI GPT-4 · LangChain · Natural language to SQL' },
                { title: 'Security', desc: 'Encrypted credentials · SSL/TLS · Audit logging · Role-based access' },
                { title: 'Deployment', desc: 'On-premise · Docker · Hybrid · Container-ready architecture' },
              ])
            }
            const tabKeys = Array.from(groups.keys()).sort((a, b) => {
              const ai = providerOrder.indexOf(a)
              const bi = providerOrder.indexOf(b)
              if (ai !== -1 && bi !== -1) return ai - bi
              if (ai !== -1) return -1
              if (bi !== -1) return 1
              if (a === 'Security') return 1
              if (b === 'Security') return -1
              return a.localeCompare(b)
            })
            const activeTab = tabKeys.includes(techSecurityTab) ? techSecurityTab : (tabKeys[0] ?? '')
            const activeRows = activeTab ? (groups.get(activeTab) ?? []) : []
            const isExpanded = activeTab ? techSecurityExpandedTabs.has(activeTab) : false
            const displayedRows = isExpanded ? activeRows : activeRows.slice(0, TECH_SECURITY_VISIBLE_ROWS)
            const hasMore = activeRows.length > TECH_SECURITY_VISIBLE_ROWS
            const rowStyle = { borderBottom: '1px solid #E5E5E5' as const }
            const lastRowStyle = { borderBottom: 'none' as const }
            const numberStyle = { fontFamily: "'Geist Mono', monospace", fontWeight: 400, fontSize: '10px', lineHeight: '15px', letterSpacing: '1px', color: '#737373', flexShrink: 0, minWidth: '24px' }
            const titleRowStyle = { fontFamily: 'Geist, var(--font-geist-sans), sans-serif', fontWeight: 500, fontStyle: 'normal' as const, fontSize: '14px', lineHeight: '20px', color: '#0A0A0A', marginBottom: '4px' }
            const descStyle = { fontFamily: 'Geist, var(--font-geist-sans), sans-serif', fontWeight: 400, fontStyle: 'normal' as const, fontSize: '12px', lineHeight: '16px', color: '#737373' }
            const firstColLen = Math.ceil(displayedRows.length / 2)
            return (
              <>
                {/* Tabs row: centered, spec styles (All active #1F1F1F, others #E5E5E5) */}
                {tabKeys.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '24px',
                      flexWrap: 'wrap',
                    }}
                  >
                    {tabKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setTechSecurityTab(key)}
                        style={{
                          boxSizing: 'border-box',
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '9px 14px',
                          gap: '10px',
                          fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: activeTab === key ? '#FFFFFF' : '#737373',
                          background: activeTab === key ? '#1F1F1F' : 'transparent',
                          border: '1px solid #E5E5E5',
                          cursor: 'pointer',
                          transition: 'color 0.2s, background 0.2s, border-color 0.2s',
                        }}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                )}
                {/* Two columns 520px each, gap 62px; rows 89px min-height, Geist Mono number, Geist title/desc */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '520px 520px',
                    gap: '62px',
                    width: '100%',
                    maxWidth: '1102px',
                    margin: '0 auto',
                  }}
                >
                  {[displayedRows.slice(0, firstColLen), displayedRows.slice(firstColLen)].map((columnRows, colIdx) => (
                    <div key={colIdx} style={{ width: '520px' }}>
                      {columnRows.map((row, idx) => {
                        const rowNum = colIdx * firstColLen + idx + 1
                        return (
                          <div
                            key={idx}
                            style={{
                              ...(idx < columnRows.length - 1 ? rowStyle : lastRowStyle),
                              minHeight: '89px',
                              boxSizing: 'border-box',
                              paddingTop: '25px',
                              paddingBottom: '24px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                              <span style={numberStyle}>{String(rowNum).padStart(2, '0')}</span>
                              <div style={{ marginLeft: '49px', flex: 1 }}>
                                <div style={titleRowStyle}>{row.title}</div>
                          <div style={descStyle}>{row.desc}</div>
                        </div>
                            </div>
                          </div>
                        )
                      })}
                      </div>
                    ))}
                </div>
                    {hasMore && (
                  <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '16px' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (!activeTab) return
                            setTechSecurityExpandedTabs((prev) => {
                              const next = new Set(prev)
                              if (next.has(activeTab)) next.delete(activeTab)
                              else next.add(activeTab)
                              return next
                            })
                          }}
                          style={{
                        fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                        fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '20px',
                        color: '#737373',
                            background: 'transparent',
                        border: '1px solid #E5E5E5',
                        padding: '9px 14px',
                            cursor: 'pointer',
                          }}
                        >
                          {isExpanded ? 'View less' : `View more (${activeRows.length - TECH_SECURITY_VISIBLE_ROWS} more)`}
                        </button>
                      </div>
                    )}
              </>
            );
          })()}
                  </div>
      </section>
      {/* FAQ – static content, under Tech & Security */}
      <section id="faq" className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden', background: '#FFFFFF', position: 'relative' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1260px' }}>
          {/* Label: 32px divider | FAQ's | 32px divider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '25px' }}>
            <span style={{ width: '32px', height: '1px', background: 'rgba(10, 10, 10, 0.4)', flexShrink: 0 }} aria-hidden />
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontWeight: 400,
                fontSize: '11px',
                lineHeight: '16px',
                letterSpacing: '1.1px',
                textTransform: 'uppercase',
                color: 'rgba(10, 10, 10, 0.7)',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              FAQ&apos;s
            </span>
            <span style={{ width: '32px', height: '1px', background: 'rgba(10, 10, 10, 0.4)', flexShrink: 0 }} aria-hidden />
                </div>

          {/* Heading 2 – gradient */}
          <h2
                  style={{
              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
              fontWeight: 300,
              fontStyle: 'normal',
              fontSize: '36px',
              lineHeight: '40px',
              textAlign: 'center',
              maxWidth: '559px',
              margin: '0 auto 48px',
              background: 'linear-gradient(90deg, #0023F6 0%, #008F59 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Ready to move AI into production?
          </h2>

          {/* FAQ accordion – static questions, expand/collapse, + / − */}
          <div style={{ width: '100%', maxWidth: '1260px', background: '#FFFFFF' }}>
            {[
              { q: 'What solutions are supported?', a: 'Tangram.ai supports a wide range of AI solutions including workflow automation, research agents, and industry-specific applications. Contact us for the full catalog.' },
              { q: 'Do I need existing customers?', a: 'No. You can get started with or without an existing customer base. Our platform helps you discover, deploy, and scale AI solutions for your use case.' },
              { q: 'How does the store work?', a: 'The store lets you browse, compare, and deploy pre-built AI agents and solutions. Choose a solution, configure it for your environment, and launch in minutes.' },
              { q: 'Why Tangram.ai vs other stores?', a: 'Tangram.ai focuses on enterprise-ready AI with security, compliance, and support built in. We combine agents and execution so you can move from pilots to production quickly.' },
            ].map((item, index) => {
              const isOpen = faqOpenIndex === index
              return (
                <div key={index} style={{ borderBottom: '1px solid #E5E5E5' }}>
                  <button
                    type="button"
                    onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '16px',
                      padding: '18px 0',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                    }}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                  >
                    <span
                      style={{
                        fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                        fontWeight: 400,
                        fontSize: '17px',
                        lineHeight: '24px',
                        color: '#1F1F1F',
                        flex: 1,
                      }}
                    >
                      {item.q}
                    </span>
                    <span
                      style={{
                        flexShrink: 0,
                        width: '24px',
                        height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                        fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                        fontSize: '20px',
                        lineHeight: 1,
                        color: '#1F1F1F',
                        fontWeight: 300,
                      }}
                      aria-hidden
                    >
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-question-${index}`}
                    style={{
                      overflow: 'hidden',
                      maxHeight: isOpen ? '200px' : 0,
                      transition: 'max-height 0.2s ease-out',
                    }}
                  >
                    <div
                    style={{
                        paddingBottom: '18px',
                        paddingRight: '32px',
                        fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                        fontWeight: 400,
                        fontSize: '15px',
                        lineHeight: '22px',
                        color: '#737373',
                      }}
                    >
                      {item.a}
                </div>
              </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Get Started – CTA block: same content (heading, description, button), spec CSS only */}
      <section id="get-started" className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden', background: '#FFFFFF', position: 'relative' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '590px', margin: '0 auto' }}>
          {/* Label: 32px divider | Get Started | 32px divider */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
            <span style={{ width: '32px', height: '1px', background: 'rgba(10, 10, 10, 0.4)', flexShrink: 0 }} aria-hidden />
            <span
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontWeight: 400,
                fontSize: '11px',
                lineHeight: '16px',
                letterSpacing: '1.1px',
                textTransform: 'uppercase',
                color: 'rgba(10, 10, 10, 0.7)',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              Get Started
                </span>
            <span style={{ width: '32px', height: '1px', background: 'rgba(10, 10, 10, 0.4)', flexShrink: 0 }} aria-hidden />
          </div>

          {/* Heading 2 – gradient #0060FF → #DC3DD5 */}
          <h2
            style={{
              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
              fontWeight: 300,
              fontStyle: 'normal',
              fontSize: '36px',
              lineHeight: '40px',
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'center',
              margin: '0 auto 27px',
              maxWidth: '409px',
              marginLeft: 'auto',
              marginRight: 'auto',
                background: 'linear-gradient(90deg, #0060FF 0%, #DC3DD5 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
            Ready to move AI into production?
          </h2>

          {/* Description – keep existing content intent */}
          <p
            style={{
              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              textAlign: 'center',
              color: '#737373',
              margin: '0 auto 24px',
              maxWidth: '590px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Join leading financial institutions leveraging AI to streamline asset recovery and maximize returns
          </p>

          {/* Actions: button with glow/stroke/fill – same CTA logic (demo link vs Join Waiting list) */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '24px 0', opacity: 0.93 }}>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', width: '232px' }}>
              {(() => {
                const demoUrl = (data?.agent?.demo_link || data?.agent?.application_demo_url || '').trim()
                const hasDemo = Boolean(demoUrl)
                return (
                  <a
                    href={hasDemo ? demoUrl : '#'}
                    {...(hasDemo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="inline-flex flex-col justify-center items-center no-underline cursor-pointer"
                    style={{
                      position: 'relative',
                      isolation: 'isolate',
                      width: '232px',
                      height: '48px',
                      padding: '20px 28px',
                      boxSizing: 'border-box',
                    }}
                  >
                    {/* Glow */}
                    <span
                      style={{
                        position: 'absolute',
                        left: '-2px',
                        right: '-2px',
                        top: '-2px',
                        bottom: '-2px',
                        background: 'radial-gradient(25% 44.15% at 31.25% 18.75%, #00AE8E 0%, rgba(0, 174, 142, 0) 100%)',
                        filter: 'blur(7.5px)',
                        zIndex: 0,
                      }}
                      aria-hidden
                    />
                    {/* Stroke */}
                    <span
                      style={{
                        position: 'absolute',
                        left: '-2px',
                        right: '-2px',
                        top: '-2px',
                        bottom: '-2px',
                        background: 'radial-gradient(19.16% 47.41% at 31.25% 18.75%, #00AE8E 0%, rgba(0, 174, 142, 0) 100%)',
                        zIndex: 1,
                      }}
                      aria-hidden
                    />
                    {/* Fill */}
                    <span
                      style={{
                        position: 'absolute',
                        left: '2px',
                        right: '2px',
                        top: '2px',
                        bottom: '2px',
                        background: '#000000',
                      borderRadius: '4px',
                        zIndex: 2,
                      }}
                      aria-hidden
                    />
                    {/* Text */}
                    <span
                      style={{
                        position: 'relative',
                        zIndex: 3,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontSize: '14px',
                        lineHeight: '21px',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                    }}
                  >
                    {hasDemo ? 'GET STARTED TODAY' : 'Join Waiting list'}
                    </span>
                  </a>
                )
              })()}
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
  return content
}

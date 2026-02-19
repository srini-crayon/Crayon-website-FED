"use client"

import React, { useRef, useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Maximize2, ChevronRight } from "lucide-react"
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

/** True if the raw preview URL is a real media URL; false for placeholders like "na" so we don't show the video window */
function isPreviewUrlValid(url: string | undefined): boolean {
  if (!url || !url.trim()) return false
  const u = url.trim().toLowerCase()
  if (u === 'na' || u === 'n/a') return false
  if (/\/na\/?$/i.test(u) || /\/n\/a\/?$/i.test(u)) return false
  if (u.length < 8) return false
  return true
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

export function AgentDetailsBody(props: AgentDetailsContentProps) {
  const { id, title, description, data, agent, relatedAgents = [], agentsSource } = props
  const demoPreviewContainerRef = useRef<HTMLDivElement>(null)
  const [techSecurityTab, setTechSecurityTab] = useState<string>('')
  const [techSecurityExpandedTabs, setTechSecurityExpandedTabs] = useState<Set<string>>(new Set())
  const [techSecurityListExpanded, setTechSecurityListExpanded] = useState(false)
  const [techSecurityContentOverflow, setTechSecurityContentOverflow] = useState(false)
  const techSecurityColumnRef = useRef<HTMLDivElement>(null)
  const techSecurityContentRef = useRef<HTMLDivElement>(null)
  const techSecurityImageRef = useRef<HTMLDivElement>(null)
  const [selectedWorkflowStepIndex, setSelectedWorkflowStepIndex] = useState(0)
  const [workflowPanelImageError, setWorkflowPanelImageError] = useState(false)
  const TECH_SECURITY_VISIBLE_ROWS = 5
  const TECH_SECURITY_BOX_HEIGHT = 510
  const TECH_SECURITY_BUTTON_AREA = 52

  useEffect(() => {
    if (techSecurityListExpanded) {
      setTechSecurityContentOverflow(false)
      return
    }
    const t = setTimeout(() => {
      const content = techSecurityContentRef.current
      if (!content) return
      const maxContentHeight = TECH_SECURITY_BOX_HEIGHT - TECH_SECURITY_BUTTON_AREA
      setTechSecurityContentOverflow(content.scrollHeight > maxContentHeight)
    }, 0)
    return () => clearTimeout(t)
  }, [techSecurityListExpanded, techSecurityTab])

  // Skip clearly invalid image URLs (e.g. "na", placeholder paths) so fallback is used instead
  const isWorkflowPanelUrlValid = (url: string): boolean => {
    const u = url.trim().toLowerCase()
    if (!u || u === 'na' || u === 'n/a') return false
    if (/\/na\/?$/i.test(u) || /\/n\/a\/?$/i.test(u)) return false
    if (u.length < 8) return false
    return true
  }

  // Sorted (alphabetically by name) image URLs from agent API demo_assets / demo_preview for How it works panel
  const workflowPanelImageUrls = useMemo((): string[] => {
    const agentAssets = (data?.agent?.demo_assets || data?.demo_assets) as DemoAssetLike[] | undefined
    const list: { name: string; url: string }[] = []
    if (Array.isArray(agentAssets)) {
      agentAssets.forEach((a) => {
        const url = getUrlFromAsset(a)
        if (url && !isAssetVideo(a) && isWorkflowPanelUrlValid(url)) {
          const name = (a.demo_asset_name || url || '').trim()
          list.push({ name, url })
        }
      })
    }
    const previewStr = data?.agent?.demo_preview?.trim()
    if (previewStr) {
      previewStr.split(',').map((u) => u.trim()).filter(Boolean).forEach((url) => {
        if (isWorkflowPanelUrlValid(url) && !isUrlVideo(url) && !list.some((x) => x.url === url)) {
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

  // Reset selected workflow step when steps or image list change (e.g. different agent)
  React.useEffect(() => {
    setSelectedWorkflowStepIndex((prev) => Math.min(prev, Math.max(0, workflowSteps.length - 1)))
  }, [workflowSteps.length])

  // Reset image error when step or URL list changes so we retry loading
  React.useEffect(() => {
    setWorkflowPanelImageError(false)
  }, [selectedWorkflowStepIndex, workflowPanelImageUrls.length])

  const content = (<>
    <div className="agent-details-page">
      <CurrentAgentSetter agentId={id} agentName={title} />
      <ScrollToTop />
      {/* Main Content - Overview (for sub-nav scroll) */}
      <section id="overview" style={{ position: 'relative', width: '100%', minHeight: '80vh', overflow: 'hidden' }}>

        {/* ΓöÇΓöÇ Background Gradient ΓöÇΓöÇ */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '480px',
            background: 'radial-gradient(ellipse 80% 100% at 50% 0%, #D6D6FF 0%, #E8E4FF 30%, #F5F3FF 60%, #FFFFFF 100%)',
            zIndex: 0,
          }}
        />

        {/* ΓöÇΓöÇ Centered Content Wrapper ΓöÇΓöÇ */}
        <div
          className="px-8 md:px-12 lg:px-16"
                style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '160px 0 80px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >

          {/* ΓöÇΓöÇ 1. Agent Name with Icon ΓöÇΓöÇ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            {/* Agent Icon - replace src with your actual icon */}
            {(data?.agent?.agent_name === 'NPA Valuation Assistant' || !data?.agent?.agent_name) ? (
              <img
                src="/img/agents/research-icon.png"
                alt="NPA Valuation Assistant"
                style={{ width: 24, height: 24, borderRadius: '6px', objectFit: 'cover' }}
              />
            ) : data?.agent?.icon_url ? (
              <img
                src={data.agent.icon_url}
                alt={data?.agent?.agent_name || 'Agent'}
                style={{ width: 24, height: 24, borderRadius: '6px', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '6px',
                  background: 'linear-gradient(135deg, #6EE7B7, #3B82F6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
                  <span
                    style={{
                fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '12.9px',
                lineHeight: '21px',
                letterSpacing: '0%',
                textAlign: 'center',
                verticalAlign: 'middle',
                color: '#1C1C1C',
              }}
            >
              {title || data?.agent?.agent_name || 'NPA Valuation Assistant'}
                  </span>
          </div>

          {/* ΓöÇΓöÇ 2. Main Heading (tagline; last word = teal gradient) ΓöÇΓöÇ */}
          <h1
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
              fontStyle: 'normal',
              fontSize: '42px',
              lineHeight: '54px',
              letterSpacing: '0%',
              textAlign: 'center',
              color: '#091917',
              margin: '0 0 20px 0',
              maxWidth: '780px',
            }}
          >
            {(() => {
              const descStr = (description || '').trim();
              const fromDescription = descStr.includes(' - ') ? descStr.split(/\s+-\s+/)[0]?.trim() : '';
              const tagline = fromDescription || data?.agent?.by_persona || data?.agent?.agent_name || 'NPA Valuation Assistant';
              const words = (tagline || '').split(' ');
              const lastWord = words.pop();
              return (
                <>
                  {words.join(' ')}{' '}
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontStyle: 'normal',
                      fontSize: '42px',
                      lineHeight: '54px',
                      letterSpacing: '0%',
                      textAlign: 'center',
                      background: 'linear-gradient(90deg, #091917 0%, #2E7F75 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    {lastWord}
                  </span>
                </>
              );
            })()}
          </h1>

          {/* ΓöÇΓöÇ 3. Description (only the rest after " - "; tagline is in span above) ΓöÇΓöÇ */}
          <p
            style={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '14px',
              lineHeight: '24px',
              letterSpacing: '0px',
              textAlign: 'center',
              verticalAlign: 'middle',
              color: '#091917',
              maxWidth: '540px',
              margin: '0 0 32px 0',
            }}
          >
            {(() => {
              const descStr = (description || '').trim();
              const restOnly = descStr.includes(' - ') ? descStr.split(/\s+-\s+/).slice(1).join(' - ').trim() : descStr;
              const text = restOnly || description;
              return text
                ? text.replace(/\\n/g, ' ').slice(0, 200) + (text.length > 200 ? '...' : '')
                : 'Streamline your non-performing asset workflow from email intake to valuation. Reduce processing time by 70% with AI-assisted automation and real-time analytics.';
            })()}
          </p>

          {/* ΓöÇΓöÇ 4. DEMO NOW / Join Waiting list Button ΓöÇΓöÇ */}
          {(() => {
            const demoUrl = (data?.agent?.demo_link || data?.agent?.application_demo_url || '').trim()
            const hasDemo = Boolean(demoUrl)
            return (
              <a
                href={hasDemo ? demoUrl : '#'}
                {...(hasDemo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="inline-flex items-center justify-center bg-black no-underline mb-7 cursor-pointer border-none transition-all duration-200 hover:bg-[#1a1a1a] hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:-translate-y-px"
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 500,
                  fontStyle: 'normal',
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '0.5px',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  textTransform: 'uppercase',
                  color: '#FFFFFF',
                  width: 228,
                  height: 44,
                  borderRadius: 4,
                  opacity: 1,
                }}
              >
                {hasDemo ? 'DEMO NOW' : 'Join Waiting list'}
              </a>
            )
          })()}

          {/* ΓöÇΓöÇ 5. Just Ask AI + Provider Icons ΓöÇΓöÇ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                fontWeight: 400,
                        fontStyle: 'normal',
                fontSize: '14px',
                lineHeight: '100%',
                letterSpacing: '0%',
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
                { src: '/img/footer/icon-5.png', style: { filter: 'contrast(1.2)' } }
              ].map((icon) => (
                <span key={icon.src} className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm overflow-hidden">
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
          if (!hasPreview || !previewUrl || !isPreviewUrlValid(rawPreviewUrl)) return null
          const isVideo = isVideoPreviewUrl(rawPreviewUrl)
          const isYoutube = previewUrl ? isYoutubeUrl(previewUrl) : false
          const isVimeo = previewUrl ? isVimeoUrl(previewUrl) : false
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

      {/* Features, ROI, Deployment, Docs Section - Capabilities (for sub-nav scroll) */}
      <section id="capabilities" className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1200px' }}>

          {/* ΓöÇΓöÇ 1. "CAPABILITIES" Label with left/right lines ΓöÇΓöÇ */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span
                    style={{
                width: '48px',
                height: '1px',
                backgroundColor: '#111827',
                flexShrink: 0,
              }}
              aria-hidden
            />
            <span
              style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '1.2px',
                textAlign: 'center',
                verticalAlign: 'middle',
                textTransform: 'uppercase',
                color: '#111827',
              }}
            >
              CAPABILITIES
                  </span>
            <span
              style={{
                width: '48px',
                height: '1px',
                backgroundColor: '#111827',
                flexShrink: 0,
              }}
              aria-hidden
            />
          </div>

          {/* ΓöÇΓöÇ 2. Section Heading + 3. Features Grid – first segment of features = h2, rest = cards ΓöÇΓöÇ */}
          {(() => {
            const featuresStr = (agent?.features && String(agent.features).trim() && agent.features !== 'na') ? String(agent.features).replace(/\\n/g, '\n') : ''
            const partsBySemicolon = featuresStr ? featuresStr.split(';').map((s: string) => s.trim()).filter(Boolean) : []
            const capabilitiesHeading = partsBySemicolon.length > 0
              ? partsBySemicolon[0]
              : (agent?.by_value?.trim() || (agent?.description?.trim() ? (agent.description.split(/[.!?]/)[0]?.trim() || agent.description.slice(0, 80)) : '') || 'Everything you need to manage NPA portfolios efficiently and accurately')
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
              /* Icon 1 - Email/Inbox */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="icon-0">
                <path d="M4 8l8 5 8-5M4 8v8a2 2 0 002 2h12a2 2 0 002-2V8M4 8l8-3 8 3" stroke="#43A047" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>,
              /* Icon 2 - Data/Mapping */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="icon-1">
                <path d="M8 6h8M8 10h8M8 14h5" stroke="#FB8C00" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="17" cy="17" r="3" stroke="#FB8C00" strokeWidth="1.5" />
              </svg>,
              /* Icon 3 - AI/Brain */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="icon-2">
                <path d="M12 4v4m0 8v4m-6-8H4m16 0h-2m-1.5-5.5L15 8m-6 8l-1.5 1.5m9-1.5L15 16M9 8L7.5 6.5" stroke="#AB47BC" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="12" r="3" stroke="#AB47BC" strokeWidth="1.5" />
              </svg>,
              /* Icon 4 - Valuation/Chart */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="icon-3">
                <path d="M4 20l5-5 3 3 8-8" stroke="#1E88E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 8h4v4" stroke="#1E88E5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>,
              /* Icon 5 - External/Link */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="icon-4">
                <path d="M10 14l4-4m0 0v3m0-3h-3" stroke="#F9A825" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="5" y="5" width="14" height="14" rx="2" stroke="#F9A825" strokeWidth="1.5" />
              </svg>,
              /* Icon 6 - Legal/Shield */
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" key="icon-5">
                <path d="M12 3l7 4v5c0 4.5-3 8.5-7 9.5-4-1-7-5-7-9.5V7l7-4z" stroke="#5C6BC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12l2 2 4-4" stroke="#5C6BC0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>,
            ];

            return (
              <>
                <h2
                  style={{
                    fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                    fontWeight: 300,
                    fontStyle: 'normal',
                    fontSize: '36px',
                    lineHeight: '40px',
                    letterSpacing: '0%',
                    textAlign: 'center',
                    maxWidth: '640px',
                    margin: '0 auto 48px',
                    background: 'linear-gradient(90deg, #0023F6 0%, #008F59 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {capabilitiesHeading}
                </h2>
                <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                }}
              >
                {displayItems.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '28px 24px',
                      borderRight: (i % 3 !== 2) ? '1px solid #E5E7EB' : 'none',
                      borderBottom: i < Math.ceil(displayItems.length / 3) * 3 - 3 ? '1px solid #E5E7EB' : 'none',
                    }}
                  >
                    {/* Icon */}
                    <div style={{ marginBottom: '16px' }}>
                      {featureIcons[i % featureIcons.length]}
                    </div>

                    {/* Title */}
                    <h3
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: 500,
                        fontStyle: 'normal',
                        fontSize: '18px',
                        lineHeight: '26px',
                        letterSpacing: '0%',
                        color: '#333333',
                        margin: '0 0 8px 0',
                      }}
                    >
                      {feature.title}
                    </h3>

                    {/* Description */}
                    {feature.description && (
                      <p
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '14px',
                          lineHeight: '24px',
                          letterSpacing: '0%',
                          color: '#4B4B4B',
                          margin: 0,
                        }}
                      >
                        {feature.description}
                      </p>
                    )}
                  </div>
                ))}

                {displayItems.length % 3 !== 0 &&
                  Array.from({ length: 3 - (displayItems.length % 3) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      style={{
                        padding: '28px 24px',
                        borderRight: ((displayItems.length + i) % 3 !== 2) ? '1px solid #E5E7EB' : 'none',
                      }}
                    />
                  ))
                }
                  </div>
              </>
            );
          })()}

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

      {/* How It Works – NPA valuation process steps + illustration */}
      <section id="how-it-works" className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden', background: '#FFFFFF' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1200px' }}>
          {/* "HOW IT WORKS" Label – from API workflow_section_label or default */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ width: '48px', height: '1px', backgroundColor: '#111827', flexShrink: 0 }} aria-hidden />
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
            <span style={{ width: '48px', height: '1px', backgroundColor: '#111827', flexShrink: 0 }} aria-hidden />
          </div>

          {/* Main title – from API workflow_section_title or default; same style as capabilities h2 */}
          <h2
            style={{
              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
              fontWeight: 300,
              fontStyle: 'normal',
              fontSize: '36px',
              lineHeight: '40px',
              letterSpacing: '0%',
              textAlign: 'center',
              maxWidth: '640px',
              margin: '0 auto 48px',
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

          {/* Two-column: steps (left) + illustration (right) */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-12 items-start"
            style={{
              borderBottom: '1px solid #E5E5E5',
            }}
          >
            {/* Left column – numbered steps (height matches illustration 640px); click to change right-panel image */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                width: '100%',
                maxWidth: '576px',
                height: '640px',
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
                      gap: '16px',
                      alignItems: 'flex-start',
                      maxWidth: '576px',
                      flex: '1 1 0',
                      minHeight: 0,
                      borderBottom: '1px solid #E5E5E5',
                      paddingBottom: '10px',
                      paddingLeft: isSelected ? '13px' : '16px',
                      marginLeft: 0,
                      cursor: 'pointer',
                      textAlign: 'left',
                      border: 'none',
                      background: isSelected ? '#F8FAFC' : 'transparent',
                      borderLeft: isSelected ? '3px solid #94A3B8' : '3px solid transparent',
                      borderRadius: '0 0 0 6px',
                      transition: 'background 0.2s ease, border-color 0.2s ease',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Geist Mono, var(--font-geist-mono), monospace',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '12px',
                        lineHeight: '16px',
                        letterSpacing: '0%',
                        verticalAlign: 'middle',
                        color: isSelected ? '#475569' : '#737373',
                        flexShrink: 0,
                      }}
                    >
                      {step.num}
                    </span>
                    <div>
                      <h3
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: isSelected ? 600 : 500,
                          fontStyle: 'normal',
                          fontSize: '18px',
                          lineHeight: '26px',
                          letterSpacing: '0%',
                          verticalAlign: 'middle',
                          color: isSelected ? '#1E293B' : '#333333',
                          margin: '0 0 4px 0',
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '14px',
                          lineHeight: '22.75px',
                          letterSpacing: '0%',
                          color: isSelected ? '#64748B' : '#737373',
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

            {/* Right column – illustration panel: image from agent API assets (alphabetical), changes on workflow step click */}
            <div
              style={{
                width: '100%',
                maxWidth: '720px',
                height: '640px',
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
              }}
            >
              {(() => {
                const imageStyle: React.CSSProperties = {
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                }
                if (workflowPanelImageUrls.length > 0 && !workflowPanelImageError) {
                  const imgIndex = selectedWorkflowStepIndex % workflowPanelImageUrls.length
                  const src = normalizePreviewUrl(workflowPanelImageUrls[imgIndex])
                  if (!src || !isWorkflowPanelUrlValid(workflowPanelImageUrls[imgIndex])) {
                    return <img src="/img/agents/workflow-fallback.png" alt={`Workflow step ${selectedWorkflowStepIndex + 1}`} style={imageStyle} />
                  }
                  return (
                    <img
                      src={src}
                      alt={`Workflow step ${selectedWorkflowStepIndex + 1}`}
                      onError={() => setWorkflowPanelImageError(true)}
                      style={imageStyle}
                    />
                  )
                }
                return <img src="/img/agents/workflow-fallback.png" alt="Workflow step 1" style={imageStyle} />
              })()}
            </div>
          </div>
        </div>
      </section>

      <section id="value-proposition" className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1200px' }}>

          {/* ΓöÇΓöÇ 2. "KEY BENEFITS & VALUE PROPOSITION" Label with left/right lines ΓöÇΓöÇ */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span
                    style={{
                width: '48px',
                height: '1px',
                backgroundColor: '#111827',
                flexShrink: 0,
              }}
              aria-hidden
            />
            <span
              style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '1.2px',
                textAlign: 'center',
                verticalAlign: 'middle',
                textTransform: 'uppercase',
                color: '#111827',
              }}
            >
              KEY BENEFITS & VALUE PROPOSITION
                  </span>
            <span
              style={{
                width: '48px',
                height: '1px',
                backgroundColor: '#111827',
                flexShrink: 0,
              }}
              aria-hidden
            />
                  </div>

          {/* ΓöÇΓöÇ 3. Section Heading (gradient text) ΓöÇΓöÇ */}
          <h2
            style={{
              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
              fontWeight: 300,
              fontStyle: 'normal',
              fontSize: '36px',
              lineHeight: '40px',
              letterSpacing: '0%',
              textAlign: 'center',
              maxWidth: '640px',
              margin: '0 auto 48px',
              background: 'linear-gradient(90deg, #0023F6 0%, #008F59 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Agent gives better ROI than Manual operations
          </h2>

          {/* ΓöÇΓöÇ 4. ROI Cards Grid (4 columns) ΓöÇΓöÇ */}
          {(() => {
            /* ΓöÇΓöÇ Card accent colors (dot + number) ΓöÇΓöÇ */
            const accents = [
              { dot: '#12B76A', numColor: '#12B76A' },  /* Green  */
              { dot: '#2E90FA', numColor: '#2E90FA' },  /* Blue   */
              { dot: '#0D9488', numColor: '#0D9488' },  /* Teal   */
              { dot: '#F79009', numColor: '#F79009' },  /* Gold   */
              { dot: '#7C3AED', numColor: '#7C3AED' },  /* Purple */
              { dot: '#F43F5E', numColor: '#F43F5E' },  /* Rose   */
              { dot: '#0EA5E9', numColor: '#0EA5E9' },  /* Sky    */
              { dot: '#84CC16', numColor: '#84CC16' },  /* Lime   */
            ];

            /* ΓöÇΓöÇ Parse ROI items from agent.roi ΓöÇΓöÇ */
            const rawItems = (agent?.roi && agent.roi !== 'na')
              ? agent.roi
                .replace(/\\n/g, '\n')
                .split(/[;\n]+/)
                .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, '').replace(/^\d+\.\s*/, ''))
                .filter(Boolean)
              : [];

            /* ΓöÇΓöÇ Extract title, description, and stat from each item ΓöÇΓöÇ */
            const roiCards = rawItems.map((item) => {
              /* Try "Title: Description" */
              const colonMatch = item.match(/^([^:]{3,60}):\s*(.+)$/);
              /* Try "Title - Description" */
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

              /* Try to extract a stat/number from the text (e.g. "70%", "3x", "5 hours") */
              const statMatch = (title + ' ' + description).match(/(\d+[\.\d]*\s*[%xX├ù]|\d+[\.\d]*\s*(?:hours?|mins?|days?|patents?|reduction|savings?))/i);
              const stat = statMatch ? statMatch[1].trim() : '';

              return { title, description, stat };
            });

            /* ΓöÇΓöÇ Limit to max 4 cards per row as shown in screenshot ΓöÇΓöÇ */
            const displayCards = roiCards.slice(0, 8);
            const colCount = Math.min(displayCards.length, 4);

            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${colCount}, 1fr)`,
                }}
              >
                {displayCards.map((card, i) => {
                  const accent = accents[i % accents.length];
                  const isLastInRow = (i + 1) % colCount === 0;

                  return (
                    <div
                      key={i}
                      style={{
                        padding: '24px 24px 24px 24px',
                        borderRight: !isLastInRow ? '1px solid #E5E7EB' : 'none',
                        borderBottom: (i < displayCards.length - colCount) ? '1px solid #E5E7EB' : 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        minHeight: '200px',
                      }}
                    >
                      {/* Top section */}
                      <div>
                        {/* Colored Dot + Number */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                          <div
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: accent.dot,
                              flexShrink: 0,
                            }}
                          />
                  <span
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: accent.numColor,
                              letterSpacing: '0.5px',
                            }}
                          >
                            {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>

                        {/* Title */}
                        <h3
                          style={{
                            fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                            fontWeight: 500,
                            fontStyle: 'normal',
                      fontSize: '14px',
                            lineHeight: '20px',
                            letterSpacing: '0%',
                            verticalAlign: 'middle',
                            color: '#0A0A0A',
                            margin: '0 0 8px 0',
                          }}
                        >
                          {card.title}
                        </h3>

                        {/* Description (strip stat from text when stat is shown in span below to avoid duplication) */}
                        {card.description && (
                          <p
                            style={{
                              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                              fontWeight: 400,
                      fontStyle: 'normal',
                              fontSize: '12px',
                              lineHeight: '19.5px',
                              letterSpacing: '0%',
                              verticalAlign: 'middle',
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
                      </div>

                      {/* Bottom Stat */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: '20px',
                          paddingTop: '12px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                            fontWeight: 300,
                            fontStyle: 'normal',
                            fontSize: '18px',
                            lineHeight: '28px',
                            letterSpacing: '0%',
                            verticalAlign: 'middle',
                            color: '#0A0A0A',
                          }}
                        >
                          {card.stat || card.title.split(' ').slice(0, 2).join(' ')}
                  </span>
                        {/* Small arrow icon */}
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3 8h10m0 0L9 4m4 4L9 12"
                            stroke="#98A2B3"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                  </div>
                </div>
                  );
                })}

                {/* Fill empty cells to complete the row */}
                {displayCards.length % colCount !== 0 &&
                  Array.from({ length: colCount - (displayCards.length % colCount) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      style={{
                        padding: '24px',
                        borderRight: ((displayCards.length + i + 1) % colCount !== 0) ? '1px solid #E5E7EB' : 'none',
                      }}
                    />
                  ))
                }
              </div>
            );
          })()}

        </div>
      </section>
      <section id="how-it-works" className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden', background: '#FAFAFA' }}>
        <div id="agent-powering" className="w-full mx-auto" style={{ maxWidth: '1200px' }}>

          {/* ΓöÇΓöÇ 1. "AGENTS & MODEL POWERING" Label with left/right lines ΓöÇΓöÇ */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span
                    style={{
                width: '48px',
                height: '1px',
                backgroundColor: '#111827',
                flexShrink: 0,
              }}
              aria-hidden
            />
            <span
              style={{
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '1.2px',
                textAlign: 'center',
                verticalAlign: 'middle',
                textTransform: 'uppercase',
                color: '#111827',
              }}
            >
              AGENTS & MODEL POWERING
                  </span>
            <span
              style={{
                width: '48px',
                height: '1px',
                backgroundColor: '#111827',
                flexShrink: 0,
              }}
              aria-hidden
            />
                  </div>

          {/* ΓöÇΓöÇ 3. Section Heading (gradient text) ΓöÇΓöÇ */}
          <h2
            style={{
              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
              fontWeight: 300,
              fontStyle: 'normal',
              fontSize: '36px',
              lineHeight: '40px',
              letterSpacing: '0%',
              textAlign: 'center',
              maxWidth: '640px',
              margin: '0 auto 48px',
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

          {/* ΓöÇΓöÇ 4. Cards Grid – 2 rows; 4 cards in view (2×2), rest horizontally scrollable; scrollbar hidden, scroll hint on right ΓöÇΓöÇ */}
          {(() => {
            const agentCards = relatedAgents.length > 0 ? relatedAgents : []
            const isScrollable = agentCards.length > 6
            const cardWidth = 280
            const gap = 16
            const columns = Math.ceil(agentCards.length / 2) || 1
            return (
              <div style={{ position: isScrollable ? 'relative' : undefined }}>
                <div
                  className={isScrollable ? 'scrollbar-hide' : undefined}
                  style={{
                    overflowX: isScrollable ? 'auto' : 'visible',
                    overflowY: 'hidden',
                    marginLeft: isScrollable ? '-8px' : 0,
                    marginRight: isScrollable ? '-8px' : 0,
                    paddingLeft: isScrollable ? '8px' : 0,
                    paddingRight: isScrollable ? '8px' : 0,
                    paddingBottom: isScrollable ? '8px' : 0,
                  }}
                >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: 'auto auto',
                    ...(isScrollable
                      ? {
                          gridAutoFlow: 'column',
                          gridAutoColumns: `${cardWidth}px`,
                          minWidth: columns * cardWidth + (columns - 1) * gap,
                        }
                      : {
                          gridTemplateColumns: 'repeat(3, 1fr)',
                        }),
                    gap: `${gap}px`,
                  }}
                >
            {agentCards.length > 0
              ? agentCards.map((ra: { agent_id?: string; agent_name?: string; description?: string }) => {
                  const agentId = ra.agent_id || ''
                  const name = ra.agent_name || 'Agent'
                  const desc = ra.description || ''
                  const label = agentsSource === 'bundled' ? 'Bundled Agent' : agentsSource === 'similar' ? 'Similar Agent' : 'AI Agent'
                  return (
                    <Link
                      key={agentId}
                      href={`/agents/${agentId}`}
                      scroll
                      className="group block relative rounded-xl overflow-hidden transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400"
                      style={{
                        width: '100%',
                        minHeight: '257px',
                        background: '#F5F5F5',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)',
                        textDecoration: 'none',
                      }}
                    >
                      {/* Gradient overlay on hover – same as agents library cards */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none"
                        style={{
                          background: 'linear-gradient(132.48deg, #F7F7F7 60.17%, #FF757B 94.82%), linear-gradient(246.59deg, rgba(247, 247, 247, 0.6) 58.7%, rgba(255, 232, 232, 0.6) 99.81%)',
                        }}
                        aria-hidden
                      />
                      <div className="relative z-10 p-6 flex flex-col min-h-[257px]">
                        <div className="flex justify-between items-start">
                          <span
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 400,
                              fontStyle: 'normal',
                              fontSize: '13.3px',
                              lineHeight: '14px',
                              letterSpacing: '0.17px',
                              verticalAlign: 'middle',
                              color: 'rgba(0, 0, 0, 0.87)',
                            }}
                          >
                            {label}
                          </span>
                          <div className="flex items-center justify-center rounded-full flex-shrink-0" style={{ width: '36px', height: '36px' }}>
                            <Image src="/img/agents/research-icon.png" alt="" width={28} height={28} className="object-contain" />
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-end min-h-0 mt-3">
                          <h3
                            className="transition-colors duration-300 ease-out"
                            style={{
                              fontFamily: 'Poppins, sans-serif',
                              fontWeight: 400,
                              fontStyle: 'normal',
                              fontSize: '24px',
                              lineHeight: '32px',
                              letterSpacing: '0.17px',
                              color: 'rgba(0, 0, 0, 0.87)',
                            }}
                          >
                            {name}
                          </h3>
                          {desc ? (
                            <p
                              className="mt-2 line-clamp-3 max-h-0 overflow-hidden opacity-0 group-hover:max-h-[100px] group-hover:opacity-100 transition-all duration-300 ease-out"
                              style={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 400,
                                fontStyle: 'normal',
                                fontSize: '12px',
                                lineHeight: '18px',
                                letterSpacing: '0%',
                                color: '#475467',
                              }}
                            >
                              {desc}
                            </p>
                          ) : null}
                        </div>
                        <p
                          className="mt-auto pt-4 uppercase flex-shrink-0"
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontStyle: 'normal',
                            fontSize: '10px',
                            lineHeight: '15px',
                            letterSpacing: '0.5px',
                            verticalAlign: 'middle',
                            textTransform: 'uppercase',
                            color: 'rgba(0, 0, 0, 0.87)',
                          }}
                        >
                          BY CRAYON DATA
                        </p>
                      </div>
                    </Link>
                  )
                })
              : (
                [
                  { label: 'Workflows & Automations', title: 'Ask Happy Customers for Referrals', icon: '/img/agents/workflows-icon.png' },
                  { label: 'AI Research Prompts', title: 'Assign as B2B or B2C', icon: '/img/agents/research-icon.png' },
                  { label: 'Sequences', title: 'Congratulate on New Role', icon: '/img/agents/sequences-icon.png' },
                  { label: 'Conversations', title: 'Discovery Call Scorecard', icon: '/img/agents/conversations-icon.png' },
                ].map((card, i) => (
                  <div
                    key={i}
                    style={{ background: '#F5F5F5', borderRadius: '8px', padding: '20px 20px 24px', display: 'flex', flexDirection: 'column', minHeight: '257px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13.3px', lineHeight: '14px', letterSpacing: '0.17px', color: '#000000DE' }}>{card.label}</span>
                      <Image src={card.icon} alt="" width={28} height={28} className="object-contain" />
                    </div>
                    <div style={{ marginTop: 'auto' }}>
                      <h3 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '22.5px', lineHeight: '32px', letterSpacing: '0.17px', color: '#000000DE', margin: '0 0 6px 0' }}>{card.title}</h3>
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13.3px', lineHeight: '14px', color: '#000000DE', textTransform: 'uppercase' }}>BY CRAYON DATA</span>
                    </div>
                  </div>
                ))
              )}

                </div>
              </div>
                {isScrollable && (
                  <div
                    aria-hidden
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 8,
                      width: 64,
                      pointerEvents: 'none',
                      background: 'linear-gradient(to left, #FAFAFA 40%, rgba(250,250,250,0.6) 70%, transparent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      paddingLeft: 8,
                    }}
                  >
                    <span
                      style={{
                        animation: 'agent-powering-scroll-hint 1.8s ease-in-out infinite',
                      }}
                    >
                      <ChevronRight size={28} strokeWidth={2} style={{ color: 'rgba(0,0,0,0.4)' }} />
                    </span>
                  </div>
                )}
              </div>
            )
          })()}
        </div>
      </section>
      {/* Placeholder section for sub-nav "Use Cases" scroll target; content can be added later */}
      <section id="use-cases" className="relative py-8 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden', background: '#FAFAFA' }} aria-hidden>
        <div className="w-full mx-auto" style={{ maxWidth: '1200px' }} />
      </section>
      <section id="tech-security" className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden', background: '#FFFFFF' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1200px' }}>

          {/* ΓöÇΓöÇ 1. "TECH & SECURITY" Label with left/right lines ΓöÇΓöÇ */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <span
              style={{
                width: '48px',
                height: '1px',
                backgroundColor: '#111827',
                flexShrink: 0,
              }}
              aria-hidden
            />
            <span
                                style={{
                                  fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                                  fontStyle: 'normal',
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '1.2px',
                textAlign: 'center',
                verticalAlign: 'middle',
                textTransform: 'uppercase',
                color: '#111827',
              }}
            >
              TECH & SECURITY
            </span>
            <span
              style={{
                width: '48px',
                height: '1px',
                backgroundColor: '#111827',
                flexShrink: 0,
              }}
              aria-hidden
            />
                            </div>

          {/* ΓöÇΓöÇ 3. Section Heading (gradient text) ΓöÇΓöÇ */}
          <h2
            style={{
              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
              fontWeight: 300,
              fontStyle: 'normal',
              fontSize: '36px',
              lineHeight: '40px',
              letterSpacing: '0%',
              textAlign: 'center',
              maxWidth: '640px',
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
                const rawParts = [d.service_name, d.deployment, d.cloud_region].filter(Boolean).map((s) => String(s).trim())
                const parts = rawParts.filter((p) => p.toLowerCase() !== 'na')
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
            // Group by title so same title shows once with all its desc (fields) listed
            const titleToDescs = new Map<string, string[]>()
            activeRows.forEach((row) => {
              const t = row.title.trim() || '—'
              if (!titleToDescs.has(t)) titleToDescs.set(t, [])
              const d = row.desc.trim() || '—'
              if (d && !titleToDescs.get(t)!.includes(d)) titleToDescs.get(t)!.push(d)
            })
            const groupedByTitle = Array.from(titleToDescs.entries()).map(([title, descs]) => ({ title, descs }))
            const displayedGroups = isExpanded ? groupedByTitle : groupedByTitle.slice(0, TECH_SECURITY_VISIBLE_ROWS)
            const hasMore = groupedByTitle.length > TECH_SECURITY_VISIBLE_ROWS
            const rowStyle = { display: 'flex' as const, alignItems: 'flex-start' as const, gap: '20px', padding: '20px 0', borderBottom: '1px solid #F2F4F7' }
            const lastRowStyle = { ...rowStyle, borderBottom: 'none' }
            const numberStyle = { fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: 500, color: '#D0D5DD', minWidth: '24px', lineHeight: '20px', paddingTop: '2px' }
            const titleRowStyle = { fontFamily: 'Geist, var(--font-geist-sans), sans-serif', fontWeight: 500, fontStyle: 'normal' as const, fontSize: '14px', lineHeight: '20px', letterSpacing: '0%', verticalAlign: 'middle' as const, color: '#0A0A0A', marginBottom: '4px' }
            const descStyle = { fontFamily: 'Geist, var(--font-geist-sans), sans-serif', fontWeight: 400, fontStyle: 'normal' as const, fontSize: '12px', lineHeight: '16px', letterSpacing: '0%', verticalAlign: 'middle' as const, color: '#737373' }
            return (
              <>
                {/* Tabs row: full-width, centered, directly below h2 */}
                {tabKeys.length > 0 && (
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      gap: '8px',
                      marginBottom: '24px',
                    }}
                  >
                    {tabKeys.map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setTechSecurityTab(key)}
                        style={{
                          fontFamily: 'Poppins, sans-serif',
                          fontWeight: 500,
                          fontSize: '14px',
                          lineHeight: '20px',
                          color: activeTab === key ? '#0023F6' : '#374151',
                          background: activeTab === key ? 'rgba(0, 35, 246, 0.08)' : 'transparent',
                          border: '1px solid ' + (activeTab === key ? '#0023F6' : '#E5E7EB'),
                          borderRadius: '8px',
                          padding: '8px 16px',
                          cursor: 'pointer',
                          transition: 'color 0.2s, background 0.2s, border-color 0.2s',
                        }}
                      >
                        {key}
                      </button>
                    ))}
                  </div>
                )}
                <div
                  ref={techSecurityImageRef}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '48px',
                    width: '100%',
                    maxWidth: '1026px',
                    minHeight: '510px',
                    opacity: 1,
                    margin: '0 auto',
                  }}
                >
                  <div
                    ref={techSecurityColumnRef}
                    style={{
                      flex: '0 0 55%',
                      maxWidth: '55%',
                      height: techSecurityListExpanded ? 'auto' : TECH_SECURITY_BOX_HEIGHT,
                      maxHeight: techSecurityListExpanded ? 'none' : TECH_SECURITY_BOX_HEIGHT,
                      overflow: techSecurityListExpanded ? 'visible' : 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                  <div
                    ref={techSecurityContentRef}
                    style={{
                      flex: techSecurityListExpanded ? 'none' : 1,
                      minHeight: techSecurityListExpanded ? undefined : 0,
                      maxHeight: techSecurityListExpanded ? undefined : TECH_SECURITY_BOX_HEIGHT - TECH_SECURITY_BUTTON_AREA,
                      overflow: techSecurityListExpanded ? 'visible' : 'hidden',
                    }}
                  >
                    {displayedGroups.map((group, idx) => (
                      <div key={group.title + idx} style={idx < displayedGroups.length - 1 ? rowStyle : lastRowStyle}>
                        <span style={numberStyle}>{String(idx + 1).padStart(2, '0')}</span>
                        <div>
                          <div style={titleRowStyle}>
                            {group.title}
                          </div>
                          {group.descs.map((desc, i) => (
                            <div key={i} style={i < group.descs.length - 1 ? { ...descStyle, marginBottom: '4px' } : descStyle}>
                              {desc}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {hasMore && (
                      <div style={{ paddingTop: '16px' }}>
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
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#0023F6',
                            background: 'transparent',
                            border: '1px solid #0023F6',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            transition: 'color 0.2s, background 0.2s, border-color 0.2s',
                          }}
                        >
                          {isExpanded ? 'View less' : `View more (${groupedByTitle.length - TECH_SECURITY_VISIBLE_ROWS} more)`}
                        </button>
                      </div>
                    )}
                    {techSecurityContentOverflow && !techSecurityListExpanded && (
                      <div style={{ paddingTop: '12px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => setTechSecurityListExpanded(true)}
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#0023F6',
                            background: 'transparent',
                            border: '1px solid #0023F6',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            transition: 'color 0.2s, background 0.2s, border-color 0.2s',
                          }}
                        >
                          View more
                        </button>
                      </div>
                    )}
                    {techSecurityListExpanded && (
                      <div style={{ paddingTop: '12px', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => setTechSecurityListExpanded(false)}
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                            fontWeight: 500,
                            fontSize: '14px',
                            lineHeight: '20px',
                            color: '#0023F6',
                            background: 'transparent',
                            border: '1px solid #0023F6',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            transition: 'color 0.2s, background 0.2s, border-color 0.2s',
                          }}
                        >
                          View less
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: Tree Diagram Image */}
                <div
                  style={{
                    flex: '0 0 42%',
                    maxWidth: '42%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage:
                        'linear-gradient(to right, #F2F4F7 1px, transparent 1px), linear-gradient(to bottom, #F2F4F7 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                      borderRadius: '8px',
                      opacity: 0.6,
                    }}
                  />
                  <img
                    src="/tech-tree-diagram.png"
                    alt="Technology architecture diagram"
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      width: '100%',
                      maxWidth: '380px',
                      height: 'auto',
                      objectFit: 'contain',
                    }}
                  />
                </div>

              </div>
              </>
            );
          })()}
        </div>
      </section>
      <section id="faq" className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden', background: '#FFFFFF', position: 'relative' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1200px' }}>

          {/* ΓöÇΓöÇ Decorative curved line - LEFT side ΓöÇΓöÇ */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            style={{
              position: 'absolute',
              left: '8%',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: 0.5,
            }}
          >
            <path
              d="M80 10 C 60 10, 20 30, 30 60 S 50 100, 80 110"
              stroke="#D0D5DD"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '12px',
                lineHeight: '16px',
                letterSpacing: '1.2px',
                textAlign: 'center',
                verticalAlign: 'middle',
                textTransform: 'uppercase',
                color: '#111827',
              }}
            >
              GET STARTED
                </span>
            <span
              style={{
                width: '48px',
                height: '1px',
                backgroundColor: '#111827',
                flexShrink: 0,
              }}
              aria-hidden
            />
          </svg>

          {/* ΓöÇΓöÇ Decorative curved line - RIGHT side ΓöÇΓöÇ */}
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            style={{
              position: 'absolute',
              right: '8%',
              top: '50%',
              transform: 'translateY(-50%) scaleX(-1)',
              opacity: 0.5,
            }}
          >
            <path
              d="M80 10 C 60 10, 20 30, 30 60 S 50 100, 80 110"
              stroke="#D0D5DD"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* ΓöÇΓöÇ 3. Get Started heading ΓöÇΓöÇ */}
          <h2
            style={{
              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
              fontWeight: 300,
              fontStyle: 'normal',
              fontSize: '36px',
              lineHeight: '40px',
              letterSpacing: '0%',
              textAlign: 'center',
              verticalAlign: 'middle',
              margin: '0 auto 20px',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(90deg, #0060FF 0%, #DC3DD5 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Experience the Impact of{' '}
            </span>
            <span>
              {agent?.agent_name ?? title}
            </span>
          </h2>

          {/* ΓöÇΓöÇ 4. Description ΓöÇΓöÇ */}
          <p
            style={{
              fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '16px',
              lineHeight: '24px',
              letterSpacing: '0%',
              textAlign: 'center',
              verticalAlign: 'middle',
              color: '#737373',
              maxWidth: '460px',
              margin: '0 auto 32px',
            }}
          >
            Turn operational complexity into
          
            measurable
            <br /> performance gains.
          </p>

            {/* ΓöÇΓöÇ 5. CTA Button – DEMO / Join Waiting list ΓöÇΓöÇ */}
            <div style={{ textAlign: 'center' }}>
              {(() => {
                const demoUrl = (data?.agent?.demo_link || data?.agent?.application_demo_url || '').trim()
                const hasDemo = Boolean(demoUrl)
                return (
                  <a
                    href={hasDemo ? demoUrl : '#'}
                    {...(hasDemo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="inline-flex items-center justify-center bg-[#1A1A1A] no-underline cursor-pointer border-none transition-all duration-200 hover:bg-black hover:shadow-[0_4px_24px_rgba(0,0,0,0.18)] hover:-translate-y-px"
                    style={{
                      width: '228px',
                      height: '44px',
                      borderRadius: '4px',
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: 500,
                      fontStyle: 'normal',
                      fontSize: '14px',
                      lineHeight: '100%',
                      letterSpacing: '0.5px',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                    }}
                  >
                    {hasDemo ? 'GET STARTED TODAY' : 'Join Waiting list'}
                  </a>
                )
              })()}
            </div>

        </div>
      </section>
    </div>
    </>
  )
  return content
}

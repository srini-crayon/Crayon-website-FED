"use client"

import React, { useRef } from "react"
import Image from "next/image"
import { Maximize2 } from "lucide-react"
import ScrollToTop from "@/components/scroll-to-top"
import { CurrentAgentSetter } from "../../../components/current-agent-setter"
import type { AgentDetailsContentProps } from "./types"

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

export function AgentDetailsBody(props: AgentDetailsContentProps) {
  const { id, title, description, data, agent } = props
  const demoPreviewContainerRef = useRef<HTMLDivElement>(null)
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
              {data?.agent?.agent_name || 'NPA Valuation Assistant'}
                  </span>
          </div>

          {/* ΓöÇΓöÇ 2. Main Heading (last word = italic teal) ΓöÇΓöÇ */}
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
              const words = (title || '').split(' ');
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

          {/* ΓöÇΓöÇ 3. Description ΓöÇΓöÇ */}
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
            {description
              ? description.replace(/\\n/g, ' ').slice(0, 200) + (description.length > 200 ? '...' : '')
              : 'Streamline your non-performing asset workflow from email intake to valuation. Reduce processing time by 70% with AI-assisted automation and real-time analytics.'}
          </p>

          {/* ΓöÇΓöÇ 4. DEMO NOW Button ΓöÇΓöÇ */}
          <a
            href={data?.agent?.demo_link || data?.agent?.application_demo_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
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
            DEMO NOW
          </a>

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

          {/* ΓöÇΓöÇ 2. Section Heading (gradient text) ΓöÇΓöÇ */}
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
            Everything you need to manage NPA portfolios     efficiently and accurately
          </h2>

          {/* ΓöÇΓöÇ 3. Features Grid (3 columns ├ù 2 rows) ΓöÇΓöÇ */}
          {(() => {
            /* ΓöÇΓöÇ Parse features from agent data ΓöÇΓöÇ */
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

            /* Parse the features string into individual items */
            const rawItems = (agent?.features && agent.features !== 'na')
              ? agent.features
                .replace(/\\n/g, '\n')
                .split(/[;\n]+/)
                .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, '').replace(/^\d+\.\s*/, ''))
                .filter(Boolean)
              : [];

            /* Try to split each item into title : description */
            const features = rawItems.map((item, idx) => {
              /* Check for "Title: Description" or "Title - Description" pattern */
              const colonMatch = item.match(/^([^:]{3,50}):\s*(.+)$/);
              const dashMatch = item.match(/^([^ΓÇôΓÇö-]{3,50})\s*[ΓÇôΓÇö-]\s*(.+)$/);

              if (colonMatch) {
                return { title: colonMatch[1].trim(), description: colonMatch[2].trim() };
              } else if (dashMatch) {
                return { title: dashMatch[1].trim(), description: dashMatch[2].trim() };
              } else {
                /* No clear split ΓÇö use first few words as title, rest as desc */
                const words = item.split(' ');
                if (words.length > 6) {
                  return {
                    title: words.slice(0, 3).join(' '),
                    description: item,
                  };
                }
                return { title: item, description: '' };
              }
            });

            return (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                }}
              >
                {features.map((feature, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '28px 24px',
                      borderRight: (i % 3 !== 2) ? '1px solid #E5E7EB' : 'none',
                      borderBottom: (i < features.length - 3 || (features.length <= 3 && false)) && i < Math.floor((features.length - 1) / 3) * 3 + 3 ? '1px solid #E5E7EB' : 'none',
                      /* Simpler: add bottom border to first row */
                      ...(i < 3 && features.length > 3 ? { borderBottom: '1px solid #E5E7EB' } : {}),
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

                {/* Fill empty cells if features.length is not a multiple of 3 */}
                {features.length % 3 !== 0 &&
                  Array.from({ length: 3 - (features.length % 3) }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      style={{
                        padding: '28px 24px',
                        borderRight: ((features.length + i) % 3 !== 2) ? '1px solid #E5E7EB' : 'none',
                      }}
                    />
                  ))
                }
                  </div>
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

                        {/* Description */}
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
                            {card.description}
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
            Agents and Models that combine to perform NPA Valuation Assistant
          </h2>

          {/* ΓöÇΓöÇ 4. Cards Grid (4 columns ├ù 2 rows) ΓöÇΓöÇ */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
            }}
          >

            {/* ΓöÇΓöÇΓöÇΓöÇΓöÇ ROW 1 ΓöÇΓöÇΓöÇΓöÇΓöÇ */}

            {/* Card 1: Workflows & Automations */}
            <div
              style={{
                background: '#F5F5F5',
                borderRadius: '8px',
                padding: '20px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '257px',
              }}
            >
              {/* Top row: label + icon */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                  }}
                >
                  Workflows & Automations
                </span>
                <Image src="/img/agents/workflows-icon.png" alt="" width={28} height={28} className="object-contain" />
                </div>
              {/* Title at bottom */}
              <div style={{ marginTop: 'auto' }}>
                <h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '22.5px',
                    lineHeight: '32px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    margin: '0',
                  }}
                >
                  Ask Happy Customers for Referrals
                </h3>
              </div>
            </div>

            {/* Card 2: AI Research Prompts */}
            <div
              style={{
                background: '#F5F5F5',
                borderRadius: '8px',
                padding: '20px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '257px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                  }}
                >
                  AI Research Prompts
                </span>
                <Image src="/img/agents/research-icon.png" alt="" width={28} height={28} className="object-contain" />
            </div>
              <div style={{ marginTop: 'auto' }}>
                <h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '22.5px',
                    lineHeight: '32px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    margin: '0 0 6px 0',
                  }}
                >
                  Assign as B2B or B2C
                </h3>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    textTransform: 'uppercase',
                  }}
                >
                  BY CRAYON DATA
                </span>
          </div>
        </div>

            {/* Card 3: Sequences */}
            <div
                    style={{
                background: '#F5F5F5',
                borderRadius: '8px',
                padding: '20px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '257px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                    style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                  }}
                >
                  Sequences
                </span>
                <Image src="/img/agents/sequences-icon.png" alt="" width={28} height={28} className="object-contain" />
              </div>
              <div style={{ marginTop: 'auto' }}>
                <h3
                      style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '22.5px',
                    lineHeight: '32px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    margin: '0 0 6px 0',
                  }}
                >
                  Congratulate on New Role
                </h3>
                <span
                          style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    textTransform: 'uppercase',
                  }}
                >
                  BY CRAYON DATA
                </span>
              </div>
            </div>

            {/* Card 4: Conversations */}
            <div
              style={{
                background: '#F5F5F5',
                borderRadius: '8px',
                padding: '20px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '257px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                  }}
                >
                  Conversations
                </span>
                <Image src="/img/agents/conversations-icon.png" alt="" width={28} height={28} className="object-contain" />
              </div>
              <div style={{ marginTop: 'auto' }}>
                <h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '22.5px',
                    lineHeight: '32px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    margin: '0 0 6px 0',
                  }}
                >
                  Discovery Call Scorecard
                </h3>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    textTransform: 'uppercase',
                  }}
                >
                  BY CRAYON DATA
                </span>
              </div>
            </div>

            {/* ΓöÇΓöÇΓöÇΓöÇΓöÇ ROW 2 (identical to row 1) ΓöÇΓöÇΓöÇΓöÇΓöÇ */}

            {/* Card 5: Workflows & Automations */}
            <div
              style={{
                background: '#F5F5F5',
                borderRadius: '8px',
                padding: '20px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '257px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                  }}
                >
                  Workflows & Automations
                </span>
                <Image src="/img/agents/workflows-icon.png" alt="" width={28} height={28} className="object-contain" />
              </div>
              <div style={{ marginTop: 'auto' }}>
                              <h3
                                style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '22.5px',
                    lineHeight: '32px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    margin: '0',
                  }}
                >
                  Ask Happy Customers for Referrals
                </h3>
              </div>
            </div>

            {/* Card 6: AI Research Prompts */}
            <div
              style={{
                background: '#F5F5F5',
                borderRadius: '8px',
                padding: '20px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '257px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                  }}
                >
                  AI Research Prompts
                </span>
                <Image src="/img/agents/research-icon.png" alt="" width={28} height={28} className="object-contain" />
              </div>
              <div style={{ marginTop: 'auto' }}>
                <h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '22.5px',
                    lineHeight: '32px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    margin: '0 0 6px 0',
                  }}
                >
                  Assign as B2B or B2C
                              </h3>
                <span
                                style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                                  fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    textTransform: 'uppercase',
                  }}
                >
                  BY CRAYON DATA
                </span>
              </div>
            </div>

            {/* Card 7: Sequences */}
            <div
              style={{
                background: '#F5F5F5',
                borderRadius: '8px',
                padding: '20px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '257px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                                  fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                  }}
                >
                  Sequences
                </span>
                <Image src="/img/agents/workflows-icon.png" alt="" width={28} height={28} className="object-contain" />
                            </div>
              <div style={{ marginTop: 'auto' }}>
                <h3
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '22.5px',
                    lineHeight: '32px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    margin: '0 0 6px 0',
                  }}
                >
                  Congratulate on New Role
                </h3>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    textTransform: 'uppercase',
                  }}
                >
                  BY CRAYON DATA
                </span>
              </div>
            </div>

            {/* Card 8: Conversations */}
            <div
              style={{
                background: '#F5F5F5',
                borderRadius: '8px',
                padding: '20px 20px 24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '257px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                  }}
                >
                  Conversations
                </span>
                <Image src="/img/agents/conversations-icon.png" alt="" width={28} height={28} className="object-contain" />
              </div>
              <div style={{ marginTop: 'auto' }}>
                              <h3
                                style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '22.5px',
                    lineHeight: '32px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    margin: '0 0 6px 0',
                  }}
                >
                  Discovery Call Scorecard
                              </h3>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontStyle: 'normal',
                    fontSize: '13.3px',
                    lineHeight: '14px',
                    letterSpacing: '0.17px',
                    verticalAlign: 'middle',
                    color: '#000000DE',
                    textTransform: 'uppercase',
                  }}
                >
                  BY CRAYON DATA
                </span>
              </div>
            </div>

          </div>
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

          {/* ΓöÇΓöÇ 4. Two-column layout: Tech rows left + Image right ΓöÇΓöÇ */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '48px',
            }}
          >

            {/* ΓöÇΓöÇΓöÇΓöÇ LEFT: Deployment / Tech Rows ΓöÇΓöÇΓöÇΓöÇ */}
            <div style={{ flex: '0 0 55%', maxWidth: '55%' }}>

              {/* ΓöÇΓöÇ Row 01: Core Platform ΓöÇΓöÇ */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  padding: '20px 0',
                  borderBottom: '1px solid #F2F4F7',
                }}
              >
                {/* Number */}
                <span
                              style={{
                                fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#D0D5DD',
                    minWidth: '24px',
                    lineHeight: '20px',
                    paddingTop: '2px',
                  }}
                >
                  01
                </span>
                {/* Content */}
                <div>
                  <div
                    style={{
                      fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                      fontWeight: 500,
                                fontStyle: 'normal',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0%',
                      verticalAlign: 'middle',
                      color: '#0A0A0A',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ color: '#0A0A0A', fontWeight: 500, marginRight: '6px' }}>//</span>
                    Core Platform
                  </div>
                  <div
                    style={{
                      fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                                fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '12px',
                      lineHeight: '16px',
                      letterSpacing: '0%',
                      verticalAlign: 'middle',
                      color: '#737373',
                    }}
                  >
                    FastAPI ┬╖ SQLAlchemy ┬╖ Pydantic ┬╖ PostgreSQL ┬╖ MySQL ┬╖ UltraDB
                        </div>
                </div>
              </div>

              {/* ΓöÇΓöÇ Row 02: AI & Automation ΓöÇΓöÇ */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  padding: '20px 0',
                  borderBottom: '1px solid #F2F4F7',
                }}
              >
                <span
                          style={{
                            fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#D0D5DD',
                    minWidth: '24px',
                    lineHeight: '20px',
                    paddingTop: '2px',
                  }}
                >
                  02
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                      fontWeight: 500,
                            fontStyle: 'normal',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0%',
                      verticalAlign: 'middle',
                      color: '#0A0A0A',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ color: '#0A0A0A', fontWeight: 500, marginRight: '6px' }}>//</span>
                    AI & Automation
                  </div>
                  <div
                    style={{
                      fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                            fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '12px',
                      lineHeight: '16px',
                      letterSpacing: '0%',
                      verticalAlign: 'middle',
                      color: '#737373',
                    }}
                  >
                    OpenAI GPT-4 ┬╖ LangChain ┬╖ Natural language to SQL
                  </div>
                </div>
              </div>

              {/* ΓöÇΓöÇ Row 03: Security ΓöÇΓöÇ */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  padding: '20px 0',
                  borderBottom: '1px solid #F2F4F7',
                }}
              >
                <span
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#D0D5DD',
                    minWidth: '24px',
                    lineHeight: '20px',
                    paddingTop: '2px',
                  }}
                >
                  03
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                      fontWeight: 500,
                        fontStyle: 'normal',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0%',
                      verticalAlign: 'middle',
                      color: '#0A0A0A',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ color: '#0A0A0A', fontWeight: 500, marginRight: '6px' }}>//</span>
                    Security
                  </div>
                  <div
                    style={{
                      fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                        fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '12px',
                      lineHeight: '16px',
                      letterSpacing: '0%',
                      verticalAlign: 'middle',
                      color: '#737373',
                    }}
                  >
                    Encrypted credentials ┬╖ SSL/TLS ┬╖ Audit logging ┬╖ Role-based access
                                      </div>
                                      </div>
                                      </div>

              {/* ΓöÇΓöÇ Row 04: Deployment ΓöÇΓöÇ */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                  padding: '20px 0',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#D0D5DD',
                    minWidth: '24px',
                    lineHeight: '20px',
                    paddingTop: '2px',
                  }}
                >
                  04
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                      fontWeight: 500,
                      fontStyle: 'normal',
                      fontSize: '14px',
                      lineHeight: '20px',
                      letterSpacing: '0%',
                      verticalAlign: 'middle',
                      color: '#0A0A0A',
                      marginBottom: '4px',
                    }}
                  >
                    <span style={{ color: '#0A0A0A', fontWeight: 500, marginRight: '6px' }}>//</span>
                    Deployment
                                    </div>
                  <div
                    style={{
                      fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '12px',
                      lineHeight: '16px',
                      letterSpacing: '0%',
                      verticalAlign: 'middle',
                      color: '#737373',
                    }}
                  >
                    On-premise ┬╖ Docker ┬╖ Hybrid ┬╖ Container-ready architecture
                                </div>
                </div>
            </div>

            </div>

            {/* ΓöÇΓöÇΓöÇΓöÇ RIGHT: Tree Diagram Image ΓöÇΓöÇΓöÇΓöÇ */}
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
              {/* Grid background behind the image */}
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
              {/* 
          IMPORTANT: Replace the src below with your actual image path.
          Copy Mask_group__4_.png ΓåÆ /public/images/tech-tree-diagram.png
        */}
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
              Ready to Transform Your
            </span>
            <br />
            <span>
              NPA Workflow?
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
            Join leading financial institutions leveraging AI to streamline asset recovery and
            maximize returns
          </p>

            {/* ΓöÇΓöÇ 5. CTA Button ΓöÇΓöÇ */}
            <div style={{ textAlign: 'center' }}>
              <a
                href={data?.agent?.demo_link || data?.agent?.application_demo_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
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
                GET STARTED TODAY
              </a>
            </div>

        </div>
      </section>
    </div>
    </>
  )
  return content
}

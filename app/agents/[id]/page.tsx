import Link from "next/link"
import Image from "next/image"
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Card, CardContent } from "../../../components/ui/card"
import { ChevronLeft, Code, Lock, ExternalLink, FileText } from "lucide-react"
import DemoAssetsViewer from "../../../components/demo-assets-viewer"
import ReadMore from "../../../components/read-more"
import CollapsibleList from "../../../components/collapsible-list"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion"
import { readFileSync } from "fs"
import { join } from "path"
import ScrollToTop from "@/components/scroll-to-top"
import { DocumentationSection } from "../../../components/documentation-section"
import { DemoAccessLink } from "../../../components/demo-access-link"
import { AgentIcon } from "../../../components/agent-icon"
// import { RelatedAgentsSidebar } from "../../../components/related-agents-sidebar" // unused while Related Agents section is disabled
import { CurrentAgentSetter } from "../../../components/current-agent-setter"

type AgentDetailApiResponse = {
  agent?: {
    agent_id: string
    agent_name?: string
    description?: string
    by_persona?: string
    by_value?: string
    asset_type?: string
    demo_link?: string
    application_demo_url?: string // Alias for demo_link
    demo_preview?: string
    demo_assets?: Array<{
      demo_asset_link?: string
      demo_link?: string
      asset_url?: string
      asset_file_path?: string
      demo_asset_name?: string
      demo_asset_type?: string
      demo_asset_id?: string
    }>
    features?: string
    roi?: string
    tags?: string
    by_capability?: string
    service_provider?: string
  }
  capabilities?: Array<{ serial_id?: string; by_capability?: string }>
  deployments?: Array<{
    by_capability_id?: string
    service_id?: string
    by_capability?: string
    service_provider?: string
    service_name?: string
    deployment?: string
    cloud_region?: string
    deployment_id?: string
    capability_name?: string
  }>
  demo_assets?: Array<{
    demo_asset_link?: string
    demo_link?: string
    asset_url?: string
    asset_file_path?: string
    demo_asset_name?: string
    demo_asset_type?: string
    demo_asset_id?: string
  }>
  documentation?: Array<{
    agent_id?: string
    sdk_details?: string
    swagger_details?: string
    sample_input?: string
    sample_output?: string
    security_details?: string
    related_files?: string
    doc_id?: string
  }>
  isv_info?: {
    isv_id?: string
    isv_name?: string
    isv_address?: string
    isv_domain?: string
    isv_mob_no?: string
    isv_email_no?: string
    mou_file_path?: string
    admin_approved?: string
  }
}

type BundledAgentsResponse = {
  success: boolean
  data?: {
    agent_id: string
    agent_name: string
    created_at: string
    bundled_agents?: Array<{
      agent_id: string
      agent_name: string
      description?: string
      demo_preview?: string
      admin_approved?: string
      isv_id?: string
      asset_type?: string
      by_persona?: string
      by_value?: string
      demo_link?: string
      features?: string
      roi?: string
      tags?: string
      agents_ordering?: string | number
      created_at?: string
    }>
  }
}

type SimilarAgentsResponse = {
  agent_id: string
  similar_agents?: Array<{
    agent_id: string
    agent_name: string
    description?: string
    demo_preview?: string
    admin_approved?: string
    isv_id?: string
    asset_type?: string
    by_persona?: string
    by_value?: string
    demo_link?: string
    features?: string
    roi?: string
    tags?: string
    agents_ordering?: string | number
    created_at?: string
  }>
}

async function fetchAgentDetail(agentId: string) {
  try {
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}`, { cache: "no-store" })
    if (!res.ok) throw new Error(`Failed to fetch agent ${agentId}: ${res.status}`)
    const data: AgentDetailApiResponse = await res.json()
    // Check if agent is approved before returning
    if (data?.agent) {
      // Fetch agent list to check approval status
      const agentsRes = await fetch("https://agents-store.onrender.com/api/agents", { cache: "no-store" })
      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        const agentInList = agentsData?.agents?.find((a: any) => a.agent_id === agentId)
        // Only return data if agent is approved
        if (agentInList?.admin_approved === "yes") {
          return data
        }
      }
    }
    // Return null if not approved or not found
    return null
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
    return null
  }
}

async function fetchBundledAgents(agentId: string) {
  try {
    // Fetch bundled agents from the API
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}/bundled`, { cache: "no-store" })
    if (res.ok) {
      const data: BundledAgentsResponse = await res.json()
      // eslint-disable-next-line no-console
      console.log('Bundled Agents API Response:', JSON.stringify(data, null, 2))

      // Check if response has bundled_agents array
      if (data?.success && data?.data?.bundled_agents && Array.isArray(data.data.bundled_agents) && data.data.bundled_agents.length > 0) {
        // Map bundled_agents directly to the format needed by RelatedAgentsSidebar
        const bundledAgents = data.data.bundled_agents
          .map((agent) => ({
            agent_id: agent.agent_id,
            agent_name: agent.agent_name || 'Agent',
            description: agent.description || 'Agent description',
            demo_preview: agent.demo_preview || '',
          }))
        return bundledAgents
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Bundled agents API error:', err)
  }

  // Return null if no bundled agents found or empty list
  return null
}

async function fetchSimilarAgents(agentId: string) {
  try {
    // Fetch similar agents from the API as fallback
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}/similar?limit=4`, { cache: "no-store" })
    if (res.ok) {
      const data: SimilarAgentsResponse = await res.json()
      // eslint-disable-next-line no-console
      console.log('Similar Agents API Response:', JSON.stringify(data, null, 2))

      // Check if response has similar_agents array
      if (data?.similar_agents && Array.isArray(data.similar_agents) && data.similar_agents.length > 0) {
        // Map similar_agents to the format needed by RelatedAgentsSidebar
        const similarAgents = data.similar_agents
          .map((agent) => ({
            agent_id: agent.agent_id,
            agent_name: agent.agent_name || 'Agent',
            description: agent.description || 'Agent description',
            demo_preview: agent.demo_preview || '',
          }))
        return similarAgents
      }
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Similar agents API error:', err)
  }

  // Return null if no similar agents found or empty list
  return null
}

function readReadmeFile(): string {
  try {
    const readmePath = join(process.cwd(), 'README.md')
    return readFileSync(readmePath, 'utf8')
  } catch (err) {
    console.error('Error reading README.md:', err)
    return '# Documentation\n\nDocumentation content is not available at this time.'
  }
}

function isVideoPreviewUrl(url: string | undefined): boolean {
  if (!url || !url.trim()) return false
  const u = url.trim()
  const isYoutube = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i.test(u)
  const isVimeo = /vimeo\.com\/(\d+)/i.test(u)
  const isVideoFile = /\.(mp4|webm|ogg|mov)(\?|$|&|%3F|%2F)/i.test(u) || /\.(mp4|webm|ogg|mov)/i.test(u)
  return Boolean(isYoutube || isVimeo || isVideoFile)
}

function formatCodeBlock(content: string): string {
  // Enhanced markdown formatter
  return content
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-6 mb-3">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text'
      return `<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto border"><code class="language-${language}">${code.trim()}</code></pre>`
    })
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Lists
    .replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>')
    .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^(?!<[h|l])/gm, '<p class="mb-4">')
    .replace(/(?<!>)$/gm, '</p>')
}

export default async function AgentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchAgentDetail(id)

  // If agent doesn't exist or is not approved, show error and redirect
  if (!data || !data.agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Agent Not Found</h1>
        <p className="text-muted-foreground mb-6">This agent is not available or not approved yet.</p>
        <Link href="/agents" className="inline-flex items-center text-blue-600">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Agents
        </Link>
      </div>
    )
  }

  const agent = data.agent
  const readmeContent = readReadmeFile()

  const title = agent?.agent_name || "Business Representative"
  const description = agent?.description ||
    `Whether you're nurturing inbound leads, answering marketing inquiries, or booking meetings, this tool
                  streamlines engagement and ensures no opportunity slips through the cracks.`
  const categories = data.capabilities?.map((c) => c.by_capability || "").filter(Boolean) || ["Marketing"]
  const personas = agent?.by_persona ? [agent.by_persona] : ["Executives (CXO)"]
  const valueProps = agent?.by_value ? [agent.by_value] : ["Productivity"]
  const worksWith = data.deployments?.slice(0, 1).map((d) => d.service_name || "").filter(Boolean) || ["OpenAI GPT-4o"]

  // Compute next agent id and names (server-side) to enable Next Agent navigation
  let nextAgentId: string | null = null
  let prevAgentId: string | null = null
  let nextAgentName: string | null = null
  let prevAgentName: string | null = null
  let relatedAgents: any[] = []
  let agentsSource: 'bundled' | 'similar' | null = null
  try {
    const agentsRes = await fetch("https://agents-store.onrender.com/api/agents", { cache: "no-store" })
    if (agentsRes.ok) {
      const agentsJson = await agentsRes.json()
      const approvedAgents = (agentsJson?.agents || [])
        .filter((a: any) => a?.admin_approved === "yes")
        .filter((a: any) => a?.agent_id)

      if (approvedAgents.length > 0) {
        const idx = Math.max(0, approvedAgents.findIndex((a: any) => a?.agent_id === id))
        const nextIdx = idx >= 0 ? (idx + 1) % approvedAgents.length : 0
        const prevIdx = idx >= 0 ? (idx - 1 + approvedAgents.length) % approvedAgents.length : 0

        const nextAgent = approvedAgents[nextIdx]
        const prevAgent = approvedAgents[prevIdx]

        nextAgentId = nextAgent?.agent_id || null
        prevAgentId = prevAgent?.agent_id || null
        nextAgentName = nextAgent?.agent_name || null
        prevAgentName = prevAgent?.agent_name || null

        // Fetch bundled agents first, then fallback to similar agents
        const bundledAgents = await fetchBundledAgents(id)
        if (bundledAgents && bundledAgents.length > 0) {
          relatedAgents = bundledAgents
          agentsSource = 'bundled'
        } else {
          // Fallback: Fetch similar agents if bundled agents is empty
          const similarAgents = await fetchSimilarAgents(id)
          if (similarAgents && similarAgents.length > 0) {
            relatedAgents = similarAgents
            agentsSource = 'similar'
          }
        }
        // If no bundled agents or similar agents, relatedAgents remains empty array
        // RelatedAgentsSidebar component will handle empty state by returning null
      }
    }
  } catch {
    // ignore - keep nextAgentId null
  }
  return (
    <>
      <CurrentAgentSetter agentId={id} agentName={title} />
      <ScrollToTop />
      {/* Main Content */}
      <section style={{ position: 'relative', width: '100%', minHeight: '80vh', overflow: 'hidden' }}>

        {/* ── Background Gradient ── */}
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

        {/* ── Centered Content Wrapper ── */}
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

          {/* ── 1. Agent Name with Icon ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            {/* Agent Icon - replace src with your actual icon */}
            {data?.agent?.icon_url ? (
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

          {/* ── 2. Main Heading (last word = italic teal) ── */}
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

          {/* ── 3. Description ── */}
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

          {/* ── 4. DEMO NOW Button ── */}
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

          {/* ── 5. Just Ask AI + Provider Icons ── */}
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
              {['/img/footer/icon-1.png', '/img/footer/icon-2.png', '/img/footer/gemini-color 1.png', '/img/footer/icon-4.png', '/img/footer/icon-5.png'].map((src) => (
                <span key={src} className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-gray-200 shadow-sm overflow-hidden">
                  <Image src={src} alt="" width={20} height={20} className="object-contain" />
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* ── 6. Floating Video Preview (bottom-right) – auto-play video from API when available ── */}
        {(() => {
          const previewUrl = data?.agent?.demo_preview
            || (data?.demo_assets?.[0] as { asset_url?: string; demo_asset_link?: string; demo_link?: string } | undefined)?.asset_url
            || (data?.demo_assets?.[0] as { demo_asset_link?: string; demo_link?: string } | undefined)?.demo_asset_link
            || (data?.demo_assets?.[0] as { demo_link?: string } | undefined)?.demo_link
          const hasPreview = Boolean((data?.demo_assets && data.demo_assets.length > 0) || data?.agent?.demo_preview)
          const isVideo = isVideoPreviewUrl(previewUrl)
          if (!hasPreview) return null
          return (
            <div
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
              {/* Close Button */}
              <button
                type="button"
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
              >
                ×
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
                <video
                  src={previewUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  title="Demo preview"
                />
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

      {/* Features, ROI, Deployment, Docs Section */}
      <section className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1200px' }}>

          {/* ── 1. "CAPABILITIES" Label with left/right lines ── */}
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

          {/* ── 2. Section Heading (gradient text) ── */}
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

          {/* ── 3. Features Grid (3 columns × 2 rows) ── */}
          {(() => {
            /* ── Parse features from agent data ── */
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
              const dashMatch = item.match(/^([^–—-]{3,50})\s*[–—-]\s*(.+)$/);

              if (colonMatch) {
                return { title: colonMatch[1].trim(), description: colonMatch[2].trim() };
              } else if (dashMatch) {
                return { title: dashMatch[1].trim(), description: dashMatch[2].trim() };
              } else {
                /* No clear split — use first few words as title, rest as desc */
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

          {/* ── 4. Sidebar: Related Agents (below the grid now) ── DISABLED
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
      <section className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1200px' }}>

          {/* ── 2. "KEY BENEFITS & VALUE PROPOSITION" Label with left/right lines ── */}
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

          {/* ── 3. Section Heading (gradient text) ── */}
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

          {/* ── 4. ROI Cards Grid (4 columns) ── */}
          {(() => {
            /* ── Card accent colors (dot + number) ── */
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

            /* ── Parse ROI items from agent.roi ── */
            const rawItems = (agent?.roi && agent.roi !== 'na')
              ? agent.roi
                .replace(/\\n/g, '\n')
                .split(/[;\n]+/)
                .map(s => s.trim().replace(/^[,\-\s]+|[,\-\s]+$/g, '').replace(/^\d+\.\s*/, ''))
                .filter(Boolean)
              : [];

            /* ── Extract title, description, and stat from each item ── */
            const roiCards = rawItems.map((item) => {
              /* Try "Title: Description" */
              const colonMatch = item.match(/^([^:]{3,60}):\s*(.+)$/);
              /* Try "Title - Description" */
              const dashMatch = item.match(/^([^–—-]{3,60})\s*[–—-]\s*(.+)$/);

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
              const statMatch = (title + ' ' + description).match(/(\d+[\.\d]*\s*[%xX×]|\d+[\.\d]*\s*(?:hours?|mins?|days?|patents?|reduction|savings?))/i);
              const stat = statMatch ? statMatch[1].trim() : '';

              return { title, description, stat };
            });

            /* ── Limit to max 4 cards per row as shown in screenshot ── */
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
      <section className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden', background: '#FAFAFA' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1200px' }}>

          {/* ── 1. "AGENTS & MODEL POWERING" Label with left/right lines ── */}
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

          {/* ── 3. Section Heading (gradient text) ── */}
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

          {/* ── 4. Cards Grid (4 columns × 2 rows) ── */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
            }}
          >

            {/* ───── ROW 1 ───── */}

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

            {/* ───── ROW 2 (identical to row 1) ───── */}

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
      <section className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden', background: '#FFFFFF' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1200px' }}>

          {/* ── 1. "TECH & SECURITY" Label with left/right lines ── */}
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

          {/* ── 3. Section Heading (gradient text) ── */}
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

          {/* ── 4. Two-column layout: Tech rows left + Image right ── */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '48px',
            }}
          >

            {/* ──── LEFT: Deployment / Tech Rows ──── */}
            <div style={{ flex: '0 0 55%', maxWidth: '55%' }}>

              {/* ── Row 01: Core Platform ── */}
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
                    FastAPI · SQLAlchemy · Pydantic · PostgreSQL · MySQL · UltraDB
                  </div>
                </div>
              </div>

              {/* ── Row 02: AI & Automation ── */}
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
                    OpenAI GPT-4 · LangChain · Natural language to SQL
                  </div>
                </div>
              </div>

              {/* ── Row 03: Security ── */}
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
                    Encrypted credentials · SSL/TLS · Audit logging · Role-based access
                  </div>
                </div>
              </div>

              {/* ── Row 04: Deployment ── */}
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
                    On-premise · Docker · Hybrid · Container-ready architecture
                  </div>
                </div>
              </div>

            </div>

            {/* ──── RIGHT: Tree Diagram Image ──── */}
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
          Copy Mask_group__4_.png → /public/images/tech-tree-diagram.png
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
      <section className="relative py-16 px-8 md:px-12 lg:px-16" style={{ overflowX: 'hidden', background: '#FFFFFF', position: 'relative' }}>
        <div className="w-full mx-auto" style={{ maxWidth: '1200px' }}>

        {/* ── Decorative curved line - LEFT side ── */}
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
          <path
            d="M90 15 C 70 15, 30 35, 40 65 S 60 105, 90 115"
            stroke="#E5E7EB"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        {/* ── Decorative curved line - RIGHT side ── */}
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
          <path
            d="M90 15 C 70 15, 30 35, 40 65 S 60 105, 90 115"
            stroke="#E5E7EB"
            strokeWidth="0.8"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

          {/* ── 1. "GET STARTED" Label with left/right lines ── */}
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
          </div>

          {/* ── 3. Heading: first line gradient, second line normal ── */}
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
            <span
              style={{
                fontFamily: 'Geist, var(--font-geist-sans), sans-serif',
                fontWeight: 500,
                fontStyle: 'normal',
                fontSize: '36px',
                lineHeight: '40px',
                letterSpacing: '0%',
                textAlign: 'center',
                verticalAlign: 'middle',
                color: '#091917',
              }}
            >
              NPA Workflow?
            </span>
          </h2>

          {/* ── 4. Description ── */}
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

          {/* ── 5. CTA Button ── */}
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
        </div>
      </section>
    </>
  )
}

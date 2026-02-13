import React from "react"
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
import { AgentDetailsContent } from "./AgentDetailsContent"

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

async function getNextPrevAndRelated(id: string): Promise<{
  nextAgentId: string | null
  prevAgentId: string | null
  nextAgentName: string | null
  prevAgentName: string | null
  relatedAgents: any[]
  agentsSource: 'bundled' | 'similar' | null
}> {
  try {
    const agentsRes = await fetch("https://agents-store.onrender.com/api/agents", { cache: "no-store" })
    if (!agentsRes.ok) return { nextAgentId: null, prevAgentId: null, nextAgentName: null, prevAgentName: null, relatedAgents: [], agentsSource: null }
    const agentsJson = await agentsRes.json()
    const approvedAgents = (agentsJson?.agents || [])
      .filter((a: any) => a?.admin_approved === "yes")
      .filter((a: any) => a?.agent_id)
    if (approvedAgents.length === 0) return { nextAgentId: null, prevAgentId: null, nextAgentName: null, prevAgentName: null, relatedAgents: [], agentsSource: null }
    const idx = Math.max(0, approvedAgents.findIndex((a: any) => a?.agent_id === id))
    const nextIdx = (idx + 1) % approvedAgents.length
    const prevIdx = (idx - 1 + approvedAgents.length) % approvedAgents.length
    const nextAgent = approvedAgents[nextIdx]
    const prevAgent = approvedAgents[prevIdx]
    let relatedAgents: any[] = []
    let agentsSource: 'bundled' | 'similar' | null = null
    const bundledAgents = await fetchBundledAgents(id)
    if (bundledAgents && bundledAgents.length > 0) {
      relatedAgents = bundledAgents
      agentsSource = 'bundled'
    } else {
      const similarAgents = await fetchSimilarAgents(id)
      if (similarAgents && similarAgents.length > 0) {
        relatedAgents = similarAgents
        agentsSource = 'similar'
      }
    }
    return {
      nextAgentId: nextAgent?.agent_id || null,
      prevAgentId: prevAgent?.agent_id || null,
      nextAgentName: nextAgent?.agent_name || null,
      prevAgentName: prevAgent?.agent_name || null,
      relatedAgents,
      agentsSource,
    }
  } catch {
    return { nextAgentId: null, prevAgentId: null, nextAgentName: null, prevAgentName: null, relatedAgents: [], agentsSource: null }
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
  const nav = await getNextPrevAndRelated(id)

  return (
    <AgentDetailsContent
      id={id}
      title={title}
      description={description}
      data={data}
      agent={agent}
      readmeContent={readmeContent}
      nextAgentId={nav.nextAgentId}
      prevAgentId={nav.prevAgentId}
      nextAgentName={nav.nextAgentName}
      prevAgentName={nav.prevAgentName}
      relatedAgents={nav.relatedAgents}
      agentsSource={nav.agentsSource}
    />
  )
}

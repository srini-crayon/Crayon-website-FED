import { readFileSync } from "fs"
import { join } from "path"

export type AgentDetailApiResponse = {
  agent?: {
    agent_id: string
    agent_name?: string
    description?: string
    by_persona?: string
    by_value?: string
    asset_type?: string
    demo_link?: string
    application_demo_url?: string
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
      by_industry?: string
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
    by_industry?: string
    demo_link?: string
    features?: string
    roi?: string
    tags?: string
    agents_ordering?: string | number
    created_at?: string
  }>
}

export async function fetchAgentDetail(agentId: string): Promise<AgentDetailApiResponse | null> {
  try {
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}`, { cache: "no-store" })
    if (!res.ok) throw new Error(`Failed to fetch agent ${agentId}: ${res.status}`)
    const data: AgentDetailApiResponse = await res.json()
    if (data?.agent) {
      const agentsRes = await fetch("https://agents-store.onrender.com/api/agents", { cache: "no-store" })
      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        const agentInList = agentsData?.agents?.find((a: any) => a.agent_id === agentId)
        if (agentInList?.admin_approved === "yes") return data
      }
    }
    return null
  } catch (err) {
    console.error(err)
    return null
  }
}

async function fetchBundledAgents(agentId: string) {
  try {
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}/bundled`, { cache: "no-store" })
    if (res.ok) {
      const data: BundledAgentsResponse = await res.json()
      if (data?.success && data?.data?.bundled_agents && Array.isArray(data.data.bundled_agents) && data.data.bundled_agents.length > 0) {
        return data.data.bundled_agents.map((agent) => ({
          agent_id: agent.agent_id,
          agent_name: agent.agent_name || "Agent",
          description: agent.description || "Agent description",
          demo_preview: agent.demo_preview || "",
          tags: agent.tags ? String(agent.tags).split(",").map((t: string) => t.trim()).filter(Boolean) : [],
          by_industry: (agent as { by_industry?: string; applicable_industry?: string }).by_industry ?? (agent as { applicable_industry?: string }).applicable_industry ?? undefined,
        }))
      }
    }
  } catch (err) {
    console.error("Bundled agents API error:", err)
  }
  return null
}

async function fetchSimilarAgents(agentId: string) {
  try {
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}/similar?limit=16`, { cache: "no-store" })
    if (res.ok) {
      const data: SimilarAgentsResponse = await res.json()
      if (data?.similar_agents && Array.isArray(data.similar_agents) && data.similar_agents.length > 0) {
        return data.similar_agents.map((agent) => ({
          agent_id: agent.agent_id,
          agent_name: agent.agent_name || "Agent",
          description: agent.description || "Agent description",
          demo_preview: agent.demo_preview || "",
          tags: agent.tags ? String(agent.tags).split(",").map((t: string) => t.trim()).filter(Boolean) : [],
          by_industry: (agent as { by_industry?: string; applicable_industry?: string }).by_industry ?? (agent as { applicable_industry?: string }).applicable_industry ?? undefined,
        }))
      }
    }
  } catch (err) {
    console.error("Similar agents API error:", err)
  }
  return null
}

export function readReadmeFile(): string {
  try {
    return readFileSync(join(process.cwd(), "README.md"), "utf8")
  } catch (err) {
    console.error("Error reading README.md:", err)
    return "# Documentation\n\nDocumentation content is not available at this time."
  }
}

export async function getNextPrevAndRelated(id: string): Promise<{
  nextAgentId: string | null
  prevAgentId: string | null
  nextAgentName: string | null
  prevAgentName: string | null
  relatedAgents: any[]
  agentsSource: "bundled" | "similar" | null
}> {
  try {
    const agentsRes = await fetch("https://agents-store.onrender.com/api/agents", { cache: "no-store" })
    if (!agentsRes.ok) return { nextAgentId: null, prevAgentId: null, nextAgentName: null, prevAgentName: null, relatedAgents: [], agentsSource: null }
    const agentsJson = await agentsRes.json()
    const approvedAgents = (agentsJson?.agents || []).filter((a: any) => a?.admin_approved === "yes" && a?.agent_id)
    if (approvedAgents.length === 0) return { nextAgentId: null, prevAgentId: null, nextAgentName: null, prevAgentName: null, relatedAgents: [], agentsSource: null }
    const idx = Math.max(0, approvedAgents.findIndex((a: any) => a?.agent_id === id))
    const nextIdx = (idx + 1) % approvedAgents.length
    const prevIdx = (idx - 1 + approvedAgents.length) % approvedAgents.length
    const nextAgent = approvedAgents[nextIdx]
    const prevAgent = approvedAgents[prevIdx]
    let relatedAgents: any[] = []
    let agentsSource: "bundled" | "similar" | null = null
    const bundledAgents = await fetchBundledAgents(id)
    if (bundledAgents?.length) {
      relatedAgents = bundledAgents
      agentsSource = "bundled"
    } else {
      const similarAgents = await fetchSimilarAgents(id)
      if (similarAgents?.length) {
        relatedAgents = similarAgents
        agentsSource = "similar"
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

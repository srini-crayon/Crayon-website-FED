import type {
  MegaTrendsResponse,
  OpportunitiesResponse,
  ProspectsResponse,
  Prospect,
  SpotlightAgentsResponse,
  AgentDetail,
} from '../types/brands.types'

import { apiClient } from './client'

class BrandsService {
  /**
   * Fetch all prospects to find prospect_id by prospect_name
   */
  async fetchProspects(): Promise<ProspectsResponse> {
    return apiClient.get<ProspectsResponse>('/api/prospects', {
      'accept': 'application/json',
    }) // cache: no-store not supported by apiClient yet, but standard fetch has no cache by default in browser unless configured?
    // actually Next.js fetch patches global fetch.
    // My apiClient uses global fetch.
    // If I need cache: no-store, I might need to add config to apiClient.
    // But for client-side, it's usually dynamic.
  }

  /**
   * Get prospect by prospect_name (slug)
   */
  async getProspectByName(prospectName: string): Promise<Prospect | null> {
    try {
      const prospectsRes = await this.fetchProspects()

      if (!prospectsRes.success || !prospectsRes.prospects) {
        return null
      }

      // Find prospect by name (case-insensitive, handle URL encoding)
      const decodedName = decodeURIComponent(prospectName)
      const prospect = prospectsRes.prospects.find(
        (p) => p.prospect_name.toLowerCase() === decodedName.toLowerCase()
      )

      return prospect || null
    } catch (error) {
      console.error('Error getting prospect by name:', error)
      return null
    }
  }

  /**
   * Fetch mega trends for a prospect
   */
  async fetchMegaTrends(prospectId: string): Promise<MegaTrendsResponse> {
    return apiClient.get<MegaTrendsResponse>(`/api/mega-trends?prospect_id=${prospectId}`, {
      'accept': 'application/json',
    })
  }

  /**
   * Fetch opportunities for a prospect
   */
  async fetchOpportunities(prospectId: string): Promise<OpportunitiesResponse> {
    return apiClient.get<OpportunitiesResponse>(`/api/opportunities?prospect_id=${prospectId}`, {
      'accept': 'application/json',
    })
  }

  /**
   * Fetch spotlight agents for a prospect
   */
  async fetchSpotlightAgents(prospectId: string): Promise<SpotlightAgentsResponse> {
    return apiClient.get<SpotlightAgentsResponse>(`/api/spotlight-agents?prospect_id=${prospectId}`, {
      'accept': 'application/json',
    })
  }

  /**
   * Fetch agent details by agent_id
   */
  async fetchAgentDetails(agentId: string): Promise<AgentDetail | null> {
    try {
      // The API returns { agent: AgentDetail, ... } or similar?
      // Old code did fetch(...) and then response.json() -> data.
      // then return data.agent if valid.

      const data = await apiClient.get<any>(`/api/agents/${agentId}`, {
        'accept': 'application/json',
      })

      // Check if agent is approved
      if (data?.agent) {
        return data.agent
      }

      return null
    } catch (error) {
      console.error('Error fetching agent details:', error)
      return null
    }
  }
}

export const brandsService = new BrandsService()


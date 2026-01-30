// Mega Trends Types
export interface MegaTrend {
  id: string
  prospect_id: string
  section_category: string
  category_description: string
  mega_trend_id: string
  tag: string
  title: string
  description: string
  created_at: string
  updated_at: string
  last_synced_at: string
}

export interface MegaTrendsResponse {
  success: boolean
  data: MegaTrend[]
  count: number
  prospect_id: string
}

// Opportunities Types
export interface Opportunity {
  id: string
  prospect_id: string
  section_category: string
  category_description: string
  theme: string // "Consumer Experience" | "Enterprise Porductivity" | etc.
  opportunity_id: string
  opportunity_title: string
  description: string // Contains structured text with Opportunity, Solution, Business Impact, Market Validation
  asset: string
  created_at: string
  updated_at: string
  last_synced_at: string
}

export interface OpportunitiesResponse {
  success: boolean
  data: Opportunity[]
  count: number
  prospect_id: string
}

// Parsed Opportunity (after parsing description)
export interface ParsedOpportunity extends Opportunity {
  parsed: {
    opportunity?: string
    solution?: string[]
    impact?: string
    validation?: string
  }
}

// Prospect/Brand Details Types
export interface Prospect {
  prospect_id: string
  prospect_name: string
  prospect_asset: string
  prospect_logo: string
  theme: string
  "theme description": string
  created_at: string
  updated_at: string
  last_synced_at: string
}

export interface ProspectsResponse {
  success: boolean
  prospects: Prospect[]
  total: number
}

// Spotlight Agents Types
export interface SpotlightAgent {
  id: string
  prospect_id: string
  section_category: string
  category_description: string
  agent_id: string
  agent_name: string
  created_at: string
  updated_at: string
  last_synced_at: string
}

export interface SpotlightAgentsResponse {
  success: boolean
  data: SpotlightAgent[]
  count: number
  prospect_id: string
}

// Agent Details (for spotlight agents)
export interface AgentDetail {
  agent_id: string
  agent_name?: string
  description?: string
  demo_preview?: string
  asset_type?: string
  by_value?: string
  tags?: string
  admin_approved?: string
}


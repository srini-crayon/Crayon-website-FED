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
    icon_url?: string
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

export type AgentDetailsContentProps = {
  id: string
  title: string
  description: string
  data: AgentDetailApiResponse
  agent: NonNullable<AgentDetailApiResponse["agent"]>
  readmeContent: string
  nextAgentId: string | null
  prevAgentId: string | null
  nextAgentName: string | null
  prevAgentName: string | null
  relatedAgents: any[]
  agentsSource: "bundled" | "similar" | null
}

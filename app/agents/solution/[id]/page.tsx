import React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { fetchAgentDetail, getNextPrevAndRelated, readReadmeFile } from "../../[id]/agent-detail-server"
import { AgentDetailsContent } from "../../[id]/AgentDetailsContent"

export default async function SolutionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const data = await fetchAgentDetail(id)

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
  const description =
    agent?.description ||
    `Whether you're nurturing inbound leads, answering marketing inquiries, or booking meetings, this tool
                  streamlines engagement and ensures no opportunity slips through the cracks.`
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
      detailType="Solution"
    />
  )
}

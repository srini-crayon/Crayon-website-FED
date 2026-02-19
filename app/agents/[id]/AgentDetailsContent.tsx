"use client"

import { AgentDetailsBody } from "./AgentDetailsBody"
import { SolutionDetailsBody } from "./SolutionDetailsBody"
import { UseCaseDetailsBody } from "./UseCaseDetailsBody"
import type { AgentDetailsContentProps } from "./types"

export function AgentDetailsContent(props: AgentDetailsContentProps) {
  const { detailType } = props
  if (detailType === "Use case") {
    return <UseCaseDetailsBody {...props} />
  }
  if (detailType === "Solution") {
    return <SolutionDetailsBody {...props} />
  }
  return <AgentDetailsBody {...props} />
}

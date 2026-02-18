"use client"

import { useSearchParams } from "next/navigation"
import { AgentDetailsBody } from "./AgentDetailsBody"
import { SolutionDetailsBody } from "./SolutionDetailsBody"
import { UseCaseDetailsBody } from "./UseCaseDetailsBody"
import { getAgentDetailType } from "./types"
import type { AgentDetailsContentProps } from "./types"

export function AgentDetailsContent(props: AgentDetailsContentProps) {
  const searchParams = useSearchParams()
  const forceSolution = searchParams.get("template") === "solution"
  const forceUseCase = searchParams.get("template") === "usecase"
  const detailType = getAgentDetailType(props.agent?.asset_type)
  const useSolution = forceSolution || detailType === "Solution"
  const useUseCase = forceUseCase || detailType === "Use case"
  if (useUseCase) {
    return <UseCaseDetailsBody {...props} />
  }
  if (useSolution) {
    return <SolutionDetailsBody {...props} />
  }
  return <AgentDetailsBody {...props} />
}

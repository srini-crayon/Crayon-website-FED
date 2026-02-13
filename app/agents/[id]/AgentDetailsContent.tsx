"use client"

import { AgentDetailsBody } from "./AgentDetailsBody"
import type { AgentDetailsContentProps } from "./types"

export function AgentDetailsContent(props: AgentDetailsContentProps) {
  return <AgentDetailsBody {...props} />
}

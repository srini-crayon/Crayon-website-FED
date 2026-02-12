"use client"

import { ISVPartnerButton } from "./isv-partner-button"

interface AgentActionButtonsProps {
  agentId?: string
  agentName?: string
  demoLink?: string
}

export function AgentActionButtons({ demoLink }: AgentActionButtonsProps) {
  return (
    <div style={{ marginTop: '42px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', width: '100%' }}>
      <ISVPartnerButton demoLink={demoLink} />
    </div>
  )
}

"use client"

import { CustomOnboardModal } from "./custom-onboard-modal"
import type { AgentAPIResponse } from "../lib/types/admin.types"

interface EditAgentModalProps {
  agent: AgentAPIResponse
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: () => void
}

export function EditAgentModal({ agent, open, onOpenChange, onSave }: EditAgentModalProps) {
  return (
    <CustomOnboardModal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      agent={agent}
      onSave={onSave}
    />
  )
}

'use client'

import { create } from 'zustand'

interface CurrentAgentState {
  agentId: string | null
  agentName: string | null
  setAgent: (agentId: string | null, agentName: string | null) => void
}

export const useCurrentAgentStore = create<CurrentAgentState>((set) => ({
  agentId: null,
  agentName: null,
  setAgent: (agentId, agentName) => set({ agentId, agentName }),
}))

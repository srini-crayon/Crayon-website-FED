'use client'

import { useEffect } from 'react'
import { useCurrentAgentStore } from '../lib/store/current-agent.store'

export function CurrentAgentSetter({ agentId, agentName }: { agentId: string; agentName?: string }) {
  const setAgent = useCurrentAgentStore((s) => s.setAgent)
  useEffect(() => {
    setAgent(agentId, agentName ?? null)
    return () => setAgent(null, null)
  }, [agentId, agentName, setAgent])
  return null
}

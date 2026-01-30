import { createApiUrl, getAuthHeaders } from './config'
import type { AgentOnboardRequest, AgentOnboardResponse, ApiError } from '../types/agent.types'
import { useAuthStore } from '../store/auth.store'

import { apiClient } from './client'

class AgentService {
  async onboardAgent(data: AgentOnboardRequest): Promise<AgentOnboardResponse> {
    const formData = new FormData()

    // Helper function to check if value is a File-like object
    const isFileLike = (value: unknown): value is File => {
      return (
        value !== null &&
        typeof value === 'object' &&
        'name' in value &&
        'size' in value &&
        'type' in value &&
        typeof (value as any).name === 'string' &&
        typeof (value as any).size === 'number'
      )
    }

    // Add all text fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Handle file arrays (demo_files)
        if (key === 'demo_files' && Array.isArray(value) && value.length > 0) {
          value.forEach((file: File) => {
            if (isFileLike(file)) {
              formData.append('demo_files[]', file)
            }
          })
        }
        // Handle single file (readme_file)
        else if (key === 'readme_file' && isFileLike(value)) {
          formData.append('readme_file', value)
        }
        // Handle regular text fields (including empty strings)
        else if (typeof value === 'string') {
          formData.append(key, value)
        }
      }
    })

    return apiClient.post<AgentOnboardResponse>('/api/agent/onboard', formData)
  }

  async updateAgent(agentId: string, formData: FormData): Promise<any> {
    return apiClient.put<any>(`/api/agents/${agentId}`, formData)
  }
}

export const agentService = new AgentService()

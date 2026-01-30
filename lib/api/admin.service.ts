import { createFormData, endpoints } from './config'
import type {
  AgentAPIResponse,
  ISVAPIResponse,
  ResellerAPIResponse,
  UpdateAgentRequest,
  UpdateISVRequest,
  UpdateResellerRequest,
} from '../types/admin.types'
import { apiClient } from './client'

class AdminService {
  // Agent Management
  async fetchAgents(): Promise<AgentAPIResponse[]> {
    const response = await apiClient.get<any>(endpoints.admin.agents)
    // The response might be wrapped in a data property or be an array directly
    return Array.isArray(response) ? response : (response.data || response.agents || [])
  }

  async updateAgent(agentId: string, data: UpdateAgentRequest): Promise<any> {
    return apiClient.put<any>(
      endpoints.admin.updateAgent(agentId),
      createFormData(data)
    )
  }

  // ISV Management
  async fetchISVs(): Promise<ISVAPIResponse[]> {
    const response = await apiClient.get<any>(endpoints.admin.isvs)
    return Array.isArray(response) ? response : (response.data || response.isvs || [])
  }

  async updateISV(isvId: string, data: UpdateISVRequest): Promise<any> {
    return apiClient.put<any>(
      endpoints.admin.updateIsv(isvId),
      createFormData(data)
    )
  }

  // Reseller Management
  async fetchResellers(): Promise<ResellerAPIResponse[]> {
    const response = await apiClient.get<any>(endpoints.admin.resellers)
    return Array.isArray(response) ? response : (response.data || response.resellers || [])
  }

  async updateReseller(resellerId: string, data: UpdateResellerRequest): Promise<any> {
    return apiClient.put<any>(
      endpoints.admin.updateReseller(resellerId),
      createFormData(data)
    )
  }
}

export const adminService = new AdminService()


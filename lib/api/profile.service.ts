import {
  ClientProfile,
  ISVProfile,
  ResellerProfile,
  ClientProfileUpdate,
  ISVProfileUpdate,
  ResellerProfileUpdate,
  ProfileApiResponse
} from '../types/profile.types'
import { getAuthHeaders } from './config'
import { apiClient } from './client'

export class ProfileService {
  // Client Profile Methods
  static async fetchClientProfile(clientId: string): Promise<ClientProfile> {
    const data = await apiClient.get<any>(`/api/client/profile/${clientId}`)

    // The API returns { success: true, client: {...} } structure
    // We need to map the client object to our ClientProfile interface
    if (data.success && data.client) {
      return {
        client_id: data.client.client_id,
        name: data.client.client_name || '',
        email: data.client.client_email_no || '',
        company: data.client.client_company || '',
        contact_number: data.client.client_mob_no ? `+91 ${data.client.client_mob_no}` : '',
        created_at: undefined,
        updated_at: undefined,
      }
    }

    throw new Error('Client data not found in response')
  }

  static async updateClientProfile(clientId: string, updateData: ClientProfileUpdate): Promise<ClientProfile> {
    const data = await apiClient.put<ProfileApiResponse<ClientProfile>>(
      `/api/client/profile/${clientId}`,
      updateData as Record<string, any>
    )
    return data.data
  }

  // ISV Profile Methods
  static async fetchISVProfile(isvId: string): Promise<ISVProfile> {
    const data = await apiClient.get<any>(`/api/isv/profile/${isvId}`)

    // The API returns { isv: {...}, agents: [...] } structure
    // We need to map the isv object to our ISVProfile interface
    if (data.isv) {
      return {
        isv_id: data.isv.isv_id,
        name: data.isv.isv_name || '',
        position: '', // Not provided in API
        registered_name: data.isv.isv_name || '',
        registered_address: data.isv.isv_address || '',
        domain: data.isv.isv_domain || '',
        contact_number: data.isv.isv_mob_no || '',
        mou_file_path: data.isv.mou_file_path === 'na' ? undefined : data.isv.mou_file_path,
        logo_file_path: undefined, // Not provided in API
        created_at: undefined,
        updated_at: undefined,
      }
    }

    throw new Error('ISV data not found in response')
  }

  static async updateISVProfile(isvId: string, updateData: ISVProfileUpdate): Promise<ISVProfile> {
    const data = await apiClient.put<ProfileApiResponse<ISVProfile>>(
      `/api/isv/profile/${isvId}`,
      updateData as Record<string, any>
    )
    return data.data
  }

  // Reseller Profile Methods
  static async fetchResellerProfile(resellerId: string): Promise<ResellerProfile> {
    const data = await apiClient.get<any>(`/api/reseller/profile/${resellerId}`)

    // The API returns { reseller: {...}, statistics: {...} } structure
    // We need to map the reseller object to our ResellerProfile interface
    if (data.reseller) {
      return {
        reseller_id: data.reseller.reseller_id,
        name: data.reseller.reseller_name || '',
        position: '', // Not provided in API
        registered_name: data.reseller.reseller_name || '',
        registered_address: data.reseller.reseller_address || '',
        domain: data.reseller.reseller_domain === 'na' ? '' : data.reseller.reseller_domain,
        contact_number: data.reseller.reseller_mob_no === 'na' ? '' : data.reseller.reseller_mob_no,
        logo_file_path: undefined, // Not provided in API
        created_at: undefined,
        updated_at: undefined,
      }
    }

    throw new Error('Reseller data not found in response')
  }

  static async updateResellerProfile(resellerId: string, updateData: ResellerProfileUpdate): Promise<ResellerProfile> {
    const data = await apiClient.put<ProfileApiResponse<ResellerProfile>>(
      `/api/reseller/profile/${resellerId}`,
      updateData as Record<string, any>
    )
    return data.data
  }

  // File Upload Methods (for ISV and Reseller)
  static async uploadFile(file: File, type: 'mou' | 'logo', userId: string): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    formData.append('user_id', userId)

    const data = await apiClient.post<any>('/api/upload', formData)
    return data.file_path
  }

  // File Download Methods
  static getFileDownloadUrl(filePath: string): string {
    return `/api${filePath}`
  }
}

export type UserRole = 'admin' | 'isv' | 'reseller' | 'client'

export interface User {
  auth_id: string
  user_id: string
  email: string
  role: UserRole
  mfa_enabled?: boolean
}

// API Request Types
export interface LoginRequest {
  email: string
  password: string
  mfa_code?: string
}

export interface SignupRequest {
  email: string
  password: string
  role: 'isv' | 'reseller' | 'client'
  // ISV fields
  isv_name?: string
  isv_registered_name?: string
  isv_address?: string
  isv_domain?: string
  isv_mob_no?: string
  isv_country_code?: string
  isv_mou?: string // base64 or file data
  // Reseller fields
  reseller_name?: string
  reseller_registered_name?: string
  reseller_address?: string
  reseller_domain?: string
  reseller_mob_no?: string
  reseller_country_code?: string
  reseller_whitelisted_domain?: string
  reseller_logo?: string // base64 or file data
  // Client fields
  client_name?: string
  client_company?: string
  client_mob_no?: string
}

// MFA Request Types
export interface MFASetupRequest {
  email: string
  password: string
}

export interface MFAVerifyRequest {
  email: string
  mfa_code: string
}

export interface MFADisableRequest {
  email: string
  password: string
  mfa_code: string
}

// Token Request Types
export interface TokenRefreshRequest {
  refresh_token_str: string
}

// Password Request Types
export interface PasswordChangeRequest {
  email: string
  current_password: string
  new_password: string
}

// API Response Types
export interface LoginResponse {
  success: boolean
  message?: string
  mfa_required?: boolean
  access_token?: string
  refresh_token?: string
  token?: string // Legacy support
  token_type?: string
  expires_in?: number
  user?: User
  redirect?: string
}

export interface SignupResponse {
  success: boolean
  message: string
  user_id: string
  role: string
  redirect: string
}

export interface MFASetupResponse {
  success: boolean
  provisioning_uri: string
  secret: string
  message?: string
}

export interface MFAVerifyResponse {
  success: boolean
  message: string
}

export interface TokenRefreshResponse {
  success: boolean
  access_token: string
  token_type?: string
  expires_in?: number
}

export interface PasswordChangeResponse {
  success: boolean
  message: string
}

export interface ApiError {
  message: string
  status?: number
  code?: string
  detail?: string
  lockout_remaining?: number
}

// Form Data Types for Components
export interface ClientSignupForm {
  email: string
  password: string
  name: string
  company: string
  contactNumber: string
}

export interface ResellerSignupForm {
  email: string
  password: string
  name: string
  registeredName: string
  registeredAddress: string
  domain: string
  contactNumber: string
  whitelistedDomain: string
}

export interface ISVSignupForm {
  email: string
  password: string
  name: string
  registeredName: string
  registeredAddress: string
  domain: string
  contactNumber: string
  whitelistedDomain: string
}

// Auth Store State
export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  token: string | null // Legacy support
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  redirectUrl: string | null
  mfaRequired: boolean
  mfaEmail: string | null
}

export interface AuthActions {
  login: (email: string, password: string, mfaCode?: string) => Promise<{ success: boolean; redirect?: string; mfaRequired?: boolean }>
  signup: (data: SignupRequest) => Promise<{ success: boolean; message?: string; redirect?: string }>
  logout: () => void
  clearError: () => void
  setLoading: (loading: boolean) => void
  refreshAccessToken: () => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message?: string }>
  loginLocal: (email: string, role?: UserRole) => { success: boolean; redirect?: string }
}

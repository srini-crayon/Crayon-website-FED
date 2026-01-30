import { createApiUrl, createFormData } from './config'
import type { LoginRequest, SignupRequest, LoginResponse, SignupResponse, ApiError } from '../types/auth.types'

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    data: Record<string, any>,
    method: 'POST' = 'POST'
  ): Promise<T> {
    try {
      const url = createApiUrl(endpoint)
      const formData = createFormData(data)
      // Add auth header if we have a token (except for login/signup/refresh)
      const isPublicEndpoint = ['/api/auth/login', '/api/auth/signup', '/api/auth/token/refresh'].includes(endpoint);
      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };

      // We'll let the browser handle Content-Type for FormData mostly, 
      // but if we are sending manual FormData we might need to be careful.
      // The original code set 'Content-Type': 'application/x-www-form-urlencoded' 
      // and used URLSearchParams (via createFormData wrapper likely returning that or similar).
      // Let's stick to the original header for compatibility if createFormData returns URLSearchParams.
      headers['Content-Type'] = 'application/x-www-form-urlencoded';

      // Add Authorization header if needed and available (this should be handled by caller or interceptor, 
      // but we can add it here if we have access to the store, or rely on the store to pass it? 
      // Actually `makeRequest` is internal. Let's rely on `getAuthHeaders` helper if imported, 
      // or simply pass token if we want to modify signature.
      // For now, let's keep it simple and assume the backend handles auth via the body/params for these specific ops
      // OR we should be adding the header. 
      // Given the "Frontend Security Integration Guide" suggests "getAuthHeaders" usage:
      // "function getAuthHeaders() { const token = localStorage.getItem('access_token'); ... }"
      // I should integrate that.

      const token = localStorage.getItem('access_token') || localStorage.getItem('auth-token');
      if (token && !isPublicEndpoint) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method,
        headers,
        body: formData,
        credentials: 'include', // Include cookies for session management
        mode: 'cors', // Explicitly set CORS mode
      })

      // Check content-type before parsing JSON
      const contentType = response.headers.get('content-type') || ''
      let result: any
      
      if (contentType.includes('application/json')) {
        try {
          result = await response.json()
        } catch (parseError) {
          // If JSON parsing fails, it might be an HTML error page
          const text = await response.text()
          throw {
            message: `Server error: ${response.status} ${response.statusText}`,
            status: response.status,
            code: 'PARSE_ERROR',
            detail: text.substring(0, 200) // First 200 chars of error
          } as ApiError
        }
      } else {
        // Response is not JSON (likely HTML error page)
        const text = await response.text()
        throw {
          message: `Server error: ${response.status} ${response.statusText}`,
          status: response.status,
          code: 'INVALID_RESPONSE',
          detail: text.substring(0, 200) // First 200 chars of error
        } as ApiError
      }

      // Handle MFA Required response specifically if it's 200 with mfa_required=true
      // or if it comes as a 200 OK
      if (response.ok) {
        // Extract token for login requests (legacy + new)
        if (endpoint === '/api/auth/login') {
          // ... (keep existing token extraction logic if needed for legacy, or cleaner for new)
          // The new guide says response returns access_token / refresh_token directly in JSON.
        }
        return result;
      }

      if (!response.ok) {
        // Try to get more detailed error information
        let errorMessage = result.message || result.detail || `HTTP ${response.status}: ${response.statusText}`
        let lockoutRemaining = undefined;

        // Handle specific error cases
        if (response.status === 500) {
          errorMessage = "Server error. Please try again later."
        } else if (response.status === 422) {
          errorMessage = result.detail || "Invalid data provided."
        } else if (response.status === 409) {
          errorMessage = "Email already exists."
        } else if (response.status === 423) {
          errorMessage = result.detail || "Account temporarily locked due to multiple failed attempts."
          // Parse lockout time if available in detail string or separate field
          // "Account locked. Try again in 30 minutes."
        } else if (response.status === 401) {
          // Handle 401 specifically?
          errorMessage = "Invalid credentials or session expired."
        }

        throw {
          message: errorMessage,
          status: response.status,
          code: result.code,
          detail: result.detail,
          lockout_remaining: lockoutRemaining
        } as ApiError
      }

      return result
    } catch (error) {
      if ((error as ApiError).message) {
        throw error
      }
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 0,
          code: 'NETWORK_ERROR',
        } as ApiError
      }
      throw error
    }
  }

  async login(email: string, password: string, mfaCode?: string): Promise<LoginResponse> {
    const loginData: LoginRequest = { email, password }
    if (mfaCode) {
      loginData.mfa_code = mfaCode
    }
    return this.makeRequest<LoginResponse>('/api/auth/login', loginData)
  }

  async signup(data: SignupRequest): Promise<SignupResponse> {
    return this.makeRequest<SignupResponse>('/api/auth/signup', data)
  }

  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await fetch(createApiUrl('/api/health'))
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`)
      }
      
      // Check content-type before parsing JSON
      const contentType = response.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        try {
          return await response.json()
        } catch (parseError) {
          throw new Error('Backend service returned invalid response')
        }
      } else {
        throw new Error('Backend service returned non-JSON response')
      }
    } catch (error) {
      throw new Error('Backend service is unavailable')
    }
  }

  // New Security Methods

  async setupMFA(data: { email: string, password: string }): Promise<import('../types/auth.types').MFASetupResponse> {
    return this.makeRequest('/api/auth/mfa/setup', data);
  }

  async verifyMFA(data: { email: string, mfa_code: string }): Promise<import('../types/auth.types').MFAVerifyResponse> {
    return this.makeRequest('/api/auth/mfa/verify', data);
  }

  async disableMFA(data: { email: string, password: string, mfa_code: string }): Promise<{ success: boolean, message: string }> {
    return this.makeRequest('/api/auth/mfa/disable', data);
  }

  async refreshAccessToken(refreshToken: string): Promise<import('../types/auth.types').TokenRefreshResponse> {
    return this.makeRequest('/api/auth/token/refresh', { refresh_token_str: refreshToken });
  }

  async changePassword(data: import('../types/auth.types').PasswordChangeRequest): Promise<import('../types/auth.types').PasswordChangeResponse> {
    return this.makeRequest('/api/auth/password/change', data);
  }
}

export const authService = new AuthService()

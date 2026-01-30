import { createApiUrl, createFormData, getAuthHeaders } from './config'
import { useAuthStore } from '../store/auth.store'

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: Record<string, any> | FormData | URLSearchParams
    headers?: Record<string, string>
    requiresAuth?: boolean
}

class ApiClient {
    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        let { method = 'GET', body, headers = {}, requiresAuth = true } = options

        // 1. Prepare URL
        const url = createApiUrl(endpoint)

        // 2. Prepare Headers & Auth
        let token = null
        if (requiresAuth) {
            if (typeof window !== 'undefined') {
                token = useAuthStore.getState().token
            }
        }

        const authHeaders = getAuthHeaders(token, headers)

        // 3. Prepare Body
        let requestBody: BodyInit | undefined | null
        if (body) {
            if (body instanceof FormData) {
                requestBody = body
                // Browser sets Content-Type for FormData
                delete authHeaders['Content-Type']
            } else if (body instanceof URLSearchParams) {
                requestBody = body
                // Browser sets Content-Type for URLSearchParams to application/x-www-form-urlencoded
                delete authHeaders['Content-Type']
            } else {
                // Assume JSON if not FormData/URLSearchParams, unless specified otherwise
                if (!authHeaders['Content-Type']) {
                    // Default to URL encoded if that's what the backend expects, 
                    // BUT most services seem to use createFormData or JSON.
                    // Admin/Auth service used createFormData (x-www-form-urlencoded).
                    // Profile service used JSON.
                    // Let's decide based on body content or explicit header.
                    // For now, if we pass body as object and no Content-Type, let's default to JSON 
                    // BUT AdminService explicitly wanted x-www-form-urlencoded.
                    // We should probably rely on the caller to convert to FormData or JSON string if they have strict needs,
                    // OR standardise.
                    // Let's standardise on: Pass object -> JSON, Pass FormData -> FormData.
                    // If AdminService needs form-urlencoded, it should pass FormData or string.
                    // Actually, let's look at legacy AdminService. It used createFormData.
                    // So for AdminService migration, we will pass FormData.
                    // For ProfileService, it passed JSON string.

                    requestBody = JSON.stringify(body)
                    authHeaders['Content-Type'] = 'application/json'
                } else {
                    requestBody = JSON.stringify(body)
                }
            }
        }

        // 4. Make Request
        try {
            let response = await fetch(url, {
                method,
                headers: authHeaders,
                body: requestBody,
                credentials: 'include',
                mode: 'cors',
            })

            // 5. Handle 401 (Token Expiry)
            if (response.status === 401 && requiresAuth) {
                console.warn('Received 401, attempting token refresh...')
                try {
                    // Attempt refresh via store action
                    const success = await useAuthStore.getState().refreshAccessToken()

                    if (success) {
                        console.log('Token refresh successful, retrying request...')
                        // Get new token
                        const newToken = useAuthStore.getState().token
                        const newAuthHeaders = getAuthHeaders(newToken, headers)
                        if (requestBody instanceof FormData) delete newAuthHeaders['Content-Type']

                        // Retry
                        response = await fetch(url, {
                            method,
                            headers: newAuthHeaders,
                            body: requestBody,
                            credentials: 'include',
                            mode: 'cors',
                        })
                    } else {
                        // Session expired; logout already called by refreshAccessToken
                        console.warn('Token refresh failed, session expired.')
                        const err = new Error('Session expired. Please login again.') as Error & { status?: number }
                        err.status = 401
                        throw err
                    }
                } catch (refreshError: any) {
                    if (refreshError?.status === 401) throw refreshError
                    console.warn('Error during token refresh:', refreshError?.message || refreshError)
                    const err = new Error('Session expired.') as Error & { status?: number }
                    err.status = 401
                    throw err
                }
            }

            // 6. Handle Errors
            if (!response.ok) {
                // Try to parse error - check content-type first
                let errorData: any = {}
                const contentType = response.headers.get('content-type') || ''
                
                if (contentType.includes('application/json')) {
                    try {
                        errorData = await response.json()
                    } catch (e) {
                        // JSON parsing failed, try to get text
                        const text = await response.text()
                        errorData = { 
                            message: response.statusText,
                            detail: text.substring(0, 200) // First 200 chars
                        }
                    }
                } else {
                    // Not JSON, likely HTML error page
                    const text = await response.text()
                    errorData = { 
                        message: response.statusText || 'Server error',
                        detail: text.substring(0, 200) // First 200 chars
                    }
                }

                throw {
                    status: response.status,
                    message: errorData.message || errorData.detail || `HTTP ${response.status}`,
                    code: errorData.code,
                    data: errorData
                }
            }

            // 7. Parse Success Response
            // Check content type
            const contentType = response.headers.get('content-type') || ''
            if (contentType.includes('application/json')) {
                try {
                    return await response.json()
                } catch (parseError) {
                    console.error('Failed to parse JSON response:', parseError)
                    const text = await response.text()
                    throw {
                        status: response.status,
                        message: 'Server returned invalid JSON response',
                        code: 'PARSE_ERROR',
                        data: { detail: text.substring(0, 200) }
                    }
                }
            }
            return await response.text() as unknown as T

        } catch (error: any) {
            // Log error but format it properly
            const errorMessage = error?.message || error?.statusText || 'Unknown error'
            const errorStatus = error?.status || error?.statusCode || 'N/A'
            
            // Only log as error if it's a network/system error, not a handled API error
            if (error?.status === undefined && error?.statusCode === undefined) {
                console.error(`API Request failed: ${method} ${url}`, error)
            } else {
                // This is a handled API error (4xx, 5xx) - log as warning
                console.warn(`API Request failed: ${method} ${url} [${errorStatus}]`, errorMessage)
            }
            
            // Re-throw the error so callers can handle it
            throw error
        }
    }

    // Convenience methods
    get<T>(endpoint: string, options?: { headers?: Record<string, string>; requiresAuth?: boolean }) {
        const headers = options?.headers
        const requiresAuth = options?.requiresAuth !== undefined ? options.requiresAuth : true
        return this.request<T>(endpoint, { method: 'GET', headers, requiresAuth })
    }

    post<T>(endpoint: string, body?: Record<string, any> | FormData | URLSearchParams, headers?: Record<string, string>) {
        return this.request<T>(endpoint, { method: 'POST', body, headers })
    }

    put<T>(endpoint: string, body?: Record<string, any> | FormData | URLSearchParams, headers?: Record<string, string>) {
        return this.request<T>(endpoint, { method: 'PUT', body, headers })
    }

    delete<T>(endpoint: string, headers?: Record<string, string>) {
        return this.request<T>(endpoint, { method: 'DELETE', headers })
    }
}

export const apiClient = new ApiClient()

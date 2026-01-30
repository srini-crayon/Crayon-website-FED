// Token utility functions for managing JWT tokens

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const LEGACY_TOKEN_KEY = 'auth-token'

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY)
  } catch (e) {
    console.error('Error accessing localStorage:', e)
    return null
  }
}

export const setAccessToken = (token: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
    // Also set legacy key for backward compatibility if needed
    localStorage.setItem(LEGACY_TOKEN_KEY, token)
  } catch (e) {
    console.error('Error setting localStorage:', e)
  }
}

export const getRefreshToken = (): string | null => {
  if (typeof window === 'undefined') return null
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch (e) {
    console.error('Error accessing localStorage:', e)
    return null
  }
}

export const setRefreshToken = (token: string): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  } catch (e) {
    console.error('Error setting localStorage:', e)
  }
}

export const clearTokens = (): void => {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(LEGACY_TOKEN_KEY)
  } catch (e) {
    console.error('Error removing from localStorage:', e)
  }
}

// Legacy support functions mapped to new implementation
export const getStoredToken = getAccessToken
export const setStoredToken = setAccessToken
export const removeStoredToken = clearTokens

export const isTokenExpired = (token: string): boolean => {
  if (!token) return true
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    // Check if expired or about to expire (within 10 seconds)
    return payload.exp < (currentTime + 10)
  } catch {
    return true
  }
}

export const shouldRefreshToken = (token: string): boolean => {
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    // Refresh if less than 5 minutes remaining
    return payload.exp - currentTime < 300
  } catch {
    return true
  }
}

export const getTokenPayload = (token: string): any => {
  if (!token) return null
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

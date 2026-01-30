import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { authService } from '../api/auth.service'
import type { AuthState, AuthActions, SignupRequest, User, UserRole } from '../types/auth.types'
import { setAccessToken, setRefreshToken, clearTokens, getAccessToken, getRefreshToken, isTokenExpired, getTokenPayload } from '../utils/token'

// Safari-safe localStorage wrapper
const safeLocalStorage = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.error('Error accessing localStorage:', e)
      return null
    }
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      console.error('Error setting localStorage:', e)
    }
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(key)
    } catch (e) {
      console.error('Error removing from localStorage:', e)
    }
  },
}

interface AuthStore extends AuthState, AuthActions { }

// Imports moved to top

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null, // Legacy
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      redirectUrl: null,
      mfaRequired: false,
      mfaEmail: null,

      // Actions
      login: async (email: string, password: string, mfaCode?: string) => {
        set({ isLoading: true, error: null, redirectUrl: null, mfaRequired: false, mfaEmail: null })

        try {
          const response = await authService.login(email, password, mfaCode)

          // Print the login API response (browser console)
          console.log('Login Response:', JSON.stringify(response, null, 2))

          // Handle MFA requirement
          if (response.mfa_required) {
            set({
              isLoading: false,
              mfaRequired: true,
              mfaEmail: email,
              error: null
            });
            return { success: true, mfaRequired: true };
          }

          // Also log to terminal via server-side endpoint
          // ... (logging logic preserved)

          if (response.success && response.user) {
            // Updated token handling
            const accessToken = response.access_token || response.token || null;
            const refreshToken = response.refresh_token || null;

            if (accessToken) setAccessToken(accessToken);
            if (refreshToken) setRefreshToken(refreshToken);

            // Determine redirect URL based on user role
            let redirectUrl = null
            switch (response.user.role) {
              case 'admin': redirectUrl = '/admin'; break
              case 'isv': redirectUrl = '/agents'; break
              case 'reseller': redirectUrl = '/agents'; break
              case 'client': redirectUrl = '/agents'; break
              default: redirectUrl = '/'
            }

            set({
              user: response.user,
              token: accessToken, // Legacy sync
              accessToken: accessToken,
              refreshToken: refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
              redirectUrl: redirectUrl,
              mfaRequired: false,
              mfaEmail: null
            })

            // Sync favorites from server after login
            try {
              const { useFavoritesStore } = await import('./favorites.store')
              await useFavoritesStore.getState().loadFromServer()
            } catch (e) {
              console.warn('Could not sync favorites:', e)
            }

            return { success: true, redirect: redirectUrl, mfaRequired: false }
          } else {
            set({
              isLoading: false,
              error: response.message || 'Login failed',
            })
            return { success: false }
          }
        } catch (error: any) {
          set({
            isLoading: false,
            error: error.message || 'An unexpected error occurred',
          })
          return { success: false }
        }
      },

      signup: async (data: SignupRequest) => {
        set({ isLoading: true, error: null, redirectUrl: null })
        try {
          const response = await authService.signup(data)
          if (response.success) {
            let redirectUrl = '/'
            switch (data.role) {
              case 'isv': redirectUrl = '/dashboard'; break
              case 'reseller': redirectUrl = '/'; break
              case 'client': redirectUrl = '/'; break
            }
            set({ isLoading: false, error: null, redirectUrl: redirectUrl })
            return { success: true, message: response.message, redirect: redirectUrl }
          } else {
            set({ isLoading: false, error: 'Signup failed' })
            return { success: false }
          }
        } catch (error: any) {
          set({ isLoading: false, error: error.message || 'An unexpected error occurred' })
          return { success: false }
        }
      },

      logout: () => {
        clearTokens();
        set({
          user: null,
          token: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
          redirectUrl: null,
          mfaRequired: false,
          mfaEmail: null
        })
      },

      clearError: () => {
        set({ error: null })
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading })
      },

      refreshAccessToken: async () => {
        const currentRefreshToken = getRefreshToken();
        if (!currentRefreshToken) return false;

        try {
          const response = await authService.refreshAccessToken(currentRefreshToken);
          if (response.success && response.access_token) {
            setAccessToken(response.access_token);
            set(state => ({
              accessToken: response.access_token,
              token: response.access_token
            }));
            return true;
          }
          // If refresh fails, log out
          get().logout();
          return false;
        } catch (error) {
          console.warn("Token refresh failed", error);
          get().logout();
          return false;
        }
      },

      changePassword: async (currentPassword, newPassword) => {
        const user = get().user;
        if (!user) return { success: false, message: 'Not authenticated' };

        try {
          const response = await authService.changePassword({
            email: user.email,
            current_password: currentPassword,
            new_password: newPassword
          });
          return { success: response.success, message: response.message };
        } catch (error: any) {
          return { success: false, message: error.message || 'Failed to change password' };
        }
      },

      // Local authentication bypass (for development/testing)
      loginLocal: (email: string, role: UserRole = 'admin') => {
        const mockUser: User = {
          auth_id: `local-${Date.now()}`,
          user_id: `local-user-${Date.now()}`,
          email: email,
          role: role,
          mfa_enabled: false
        };

        const mockToken = `local-token-${Date.now()}`;
        setAccessToken(mockToken);
        setRefreshToken(`local-refresh-${Date.now()}`);

        // Determine redirect URL based on user role
        let redirectUrl = null
        switch (role) {
          case 'admin': redirectUrl = '/admin'; break
          case 'isv': redirectUrl = '/agents'; break
          case 'reseller': redirectUrl = '/agents'; break
          case 'client': redirectUrl = '/agents'; break
          default: redirectUrl = '/'
        }

        set({
          user: mockUser,
          token: mockToken,
          accessToken: mockToken,
          refreshToken: `local-refresh-${Date.now()}`,
          isAuthenticated: true,
          isLoading: false,
          error: null,
          redirectUrl: redirectUrl,
          mfaRequired: false,
          mfaEmail: null
        });

        console.log('Local authentication bypass activated for:', email, 'as', role);
        return { success: true, redirect: redirectUrl };
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

/**
 * Local Authentication Bypass Utility
 * For development/testing when API is unavailable
 * 
 * Usage in browser console:
 * import('./lib/utils/local-auth').then(m => m.loginAsAdmin())
 * 
 * Or call directly:
 * window.localAuth?.loginAsAdmin()
 */

import { useAuthStore } from '../store/auth.store'

export const loginAsAdmin = (email: string = 'srinivasand@crayondata.ai') => {
  const store = useAuthStore.getState()
  const result = store.loginLocal(email, 'admin')
  console.log('✅ Local admin login successful!', result)
  if (result.redirect) {
    window.location.href = result.redirect
  }
  return result
}

export const loginAsUser = (email: string, role: 'isv' | 'reseller' | 'client' = 'client') => {
  const store = useAuthStore.getState()
  const result = store.loginLocal(email, role)
  console.log(`✅ Local ${role} login successful!`, result)
  if (result.redirect) {
    window.location.href = result.redirect
  }
  return result
}

// Make it available globally for easy access
if (typeof window !== 'undefined') {
  (window as any).localAuth = {
    loginAsAdmin,
    loginAsUser
  }
  console.log('🔧 Local auth utilities available at window.localAuth')
  console.log('   Try: window.localAuth.loginAsAdmin()')
  
  // DISABLED: Auto-login feature - using API-based authentication only
  // Auto-login if URL has ?localAuth=admin or localStorage has localAuth flag
  // const urlParams = new URLSearchParams(window.location.search)
  // const localAuthParam = urlParams.get('localAuth')
  // const localAuthFlag = localStorage.getItem('localAuth')
  // 
  // if (localAuthParam === 'admin' || localAuthFlag === 'admin') {
  //   console.log('🔐 Auto-logging in as admin via local auth...')
  //   loginAsAdmin('srinivasand@crayondata.ai')
  //   // Clean up URL
  //   if (localAuthParam) {
  //     window.history.replaceState({}, '', window.location.pathname)
  //   }
  // } else if (localAuthParam === 'user' || localAuthFlag === 'user') {
  //   console.log('🔐 Auto-logging in as user via local auth...')
  //   loginAsUser('user@example.com', 'client')
  //   if (localAuthParam) {
  //     window.history.replaceState({}, '', window.location.pathname)
  //   }
  // }
}

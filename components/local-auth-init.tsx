"use client"

import { useEffect } from 'react'
import '../lib/utils/local-auth'

/**
 * Client component that initializes local auth utilities
 * Only runs in development/browser environment
 */
export function LocalAuthInit() {
  useEffect(() => {
    // Import local auth utilities to make them available globally
    import('../lib/utils/local-auth').then(() => {
      console.log('🔧 Local auth utilities initialized')
    })
  }, [])

  return null
}

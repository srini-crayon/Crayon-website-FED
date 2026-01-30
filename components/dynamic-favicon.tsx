'use client'

import { useEffect } from 'react'
import { useBrand } from '@/lib/brand'

export function DynamicFavicon() {
    const { config } = useBrand()

    useEffect(() => {
        // Update favicon dynamically based on brand
        const updateFavicon = () => {
            // Update or create link elements for favicon
            const existingIcon = document.querySelector("link[rel='icon']") as HTMLLinkElement
            const existingShortcut = document.querySelector("link[rel='shortcut icon']") as HTMLLinkElement
            const existingApple = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement

            if (existingIcon) {
                existingIcon.href = config.favicon
            } else {
                const link = document.createElement('link')
                link.rel = 'icon'
                link.href = config.favicon
                document.head.appendChild(link)
            }

            if (existingShortcut) {
                existingShortcut.href = config.favicon
            } else {
                const link = document.createElement('link')
                link.rel = 'shortcut icon'
                link.href = config.favicon
                document.head.appendChild(link)
            }

            if (existingApple) {
                existingApple.href = config.favicon
            } else {
                const link = document.createElement('link')
                link.rel = 'apple-touch-icon'
                link.href = config.favicon
                document.head.appendChild(link)
            }

            // Also update the page title with brand name
            document.title = `${config.name} - AI Agent Store`
        }

        updateFavicon()
    }, [config])

    return null // This component doesn't render anything
}

"use client"

import { useState, useEffect, useLayoutEffect } from "react"
import { Info, X } from "lucide-react"

export function NotificationBanner() {
  const [isVisible, setIsVisible] = useState(true)

  // Use useLayoutEffect to set body class synchronously before paint
  useLayoutEffect(() => {
    document.body.classList.add("banner-visible")
    document.body.classList.remove("banner-hidden")
  }, [])

  useEffect(() => {
    // Update body class to indicate banner state
    if (isVisible) {
      document.body.classList.add("banner-visible")
      document.body.classList.remove("banner-hidden")
    } else {
      document.body.classList.remove("banner-visible")
      document.body.classList.add("banner-hidden")
    }
  }, [isVisible])

  const handleClose = () => {
    setIsVisible(false)
  }

  return (
    <div 
      className={`fixed top-0 left-0 right-0 w-full bg-foreground/95 dark:bg-foreground/90 border-b border-border z-50 transition-all duration-150 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center gap-3">
          <Info className="w-4 h-4 text-background shrink-0" />
          <div className="flex-1 min-w-0 overflow-x-auto scrollbar-hide">
            <p className="text-xs sm:text-sm text-background whitespace-nowrap">
              Limited Availability. This application is optimized for viewing on desktop and laptop computers.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-background hover:text-background/80 transition-colors shrink-0 p-1"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

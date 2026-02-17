'use client'

import { useState, Fragment, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { X, ChevronDown, ExternalLink, User, LayoutDashboard, LogOut, Heart, ChevronLeft, Share2 } from "lucide-react"
import { useModal } from "../hooks/use-modal"
import { useAuthStore } from "../lib/store/auth.store"
import { useWishlistsStore } from "../lib/store/wishlists.store"
import { useCurrentAgentStore } from "../lib/store/current-agent.store"
import { WishlistPickerModal } from "./wishlist-picker-modal"
import { Avatar, AvatarFallback } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

type NavKey = 'platform' | 'services' | 'community' | 'about'

/** Section ids and labels for agent detail page sub-nav; must match AgentDetailsBody section ids */
const AGENT_DETAIL_SECTIONS: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'capabilities', label: 'Capabilities' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'value-proposition', label: 'Value Proposition' },
  { id: 'agent-powering', label: 'Agent Powering' },
  { id: 'use-cases', label: 'Use Cases' },
  { id: 'tech-security', label: 'Tech & security' },
]

export function CrayonHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [isWishlistPickerOpen, setIsWishlistPickerOpen] = useState(false)
  const [hoveredNav, setHoveredNav] = useState<NavKey | null>(null)
  const lastScrollY = useRef(0)
  const navHoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { openModal } = useModal()
  const { isAuthenticated, user, logout } = useAuthStore()
  const { isInAnyWishlist, loadAllWishlists } = useWishlistsStore()
  const { agentId: currentAgentId, agentName: currentAgentName } = useCurrentAgentStore()
  const scrollThreshold = 60
  const scrollDeltaMin = 50
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  const isAgentDetailPage = pathname.startsWith('/agents/') && pathname !== '/agents' && pathname !== '/agents-store'
  const agentIdFromPath = isAgentDetailPage ? pathname.replace(/^\/agents\//, '').split('/')[0] || null : null
  const headerAgentId = agentIdFromPath || currentAgentId
  const headerAgentName = currentAgentName ?? undefined
  const isWishlisted = headerAgentId ? isInAnyWishlist(headerAgentId) : false

  useEffect(() => {
    if (isAuthenticated && headerAgentId) loadAllWishlists()
  }, [isAuthenticated, headerAgentId, loadAllWishlists])

  const handleHeaderWishlistClick = () => {
    if (!isAuthenticated) {
      openModal("auth", { mode: "login", role: "client" })
      return
    }
    setIsWishlistPickerOpen(true)
  }

  const handleShareClick = () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({ title: document.title, url }).catch(() => {
        navigator.clipboard?.writeText(url).catch(() => {})
      })
    } else {
      navigator.clipboard?.writeText(url).catch(() => {})
    }
  }

  const getInitials = (email: string) => {
    if (!email) return "U"
    const part = email.split("@")[0]
    if (part.length >= 2) return (part[0] + part[1]).toUpperCase()
    return part[0].toUpperCase()
  }

  type SecondaryItem = { label: string; path: string; external?: boolean; disabled?: boolean }
  
  // Secondary menu items - About Us
  const secondaryMenuItems: SecondaryItem[] = [
    { label: "Vision", path: "/vision" },
    { label: "Our Story", path: "/our-story" },
    { label: "Our Values", path: "/our-values" },
    { label: "Our Team", path: "/our-team" },
    { label: "Careers", path: "/career" },
  ]
  
  // Secondary menu items - Legal
  const legalMenuItems: SecondaryItem[] = [
    { label: "Terms of Use", path: "/terms-of-use" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Cookie Policy", path: "/cookie-policy" },
    { label: "Security Policy", path: "/security-policy" },
    { label: "Trust Center", path: "/trust-center" },
    { label: "Civil Liberties", path: "/privacy-civil-liberties" },
  ]

  // Secondary menu items - Services (Catalyst)
  const servicesMenuItems: SecondaryItem[] = [
    { label: "Catalyst", path: "/catalyst" },
    { label: "Labs", path: "/labs" },
    { label: "Foundry", path: "/foundry" },
    { label: "Factory", path: "/factory" },
  ]

  // Secondary menu items - The Platform (similar to About Us)
  const platformMenuItems: SecondaryItem[] = [
    { label: "Tangram AI", path: "/tangram-ai" },
    // "Agents Store" should land on the agents library page
    { label: "Agents Store", path: "/tangram-ai-agents" },
    { label: "ISV", path: "/tangram-ai-isv" },
    { label: "Reseller", path: "/tangram-ai-reseller" },
  ]

  // Secondary menu items - Community (for Blog/Podcast)
  const communityMenuItems: SecondaryItem[] = [
    { label: "YouTube", path: "https://www.youtube.com", external: true },
    { label: "LinkedIn", path: "/linkedin" },
    { label: "X", path: "/x" },
    { label: "Blogs", path: "/blog" },
    { label: "Podcast", path: "/podcast" },
  ]
  
  // Check if current page is in the secondary menu
  const isAboutUsPage = secondaryMenuItems.some(item => pathname === item.path)
  const isLegalPage = legalMenuItems.some(item => pathname === item.path)
  const isServicesPage = servicesMenuItems.some(item => pathname === item.path)
  // Treat Agents Store routes as part of Platform as well.
  // This enables the secondary header bar on `/agents` and agent detail pages (`/agents/[id]`).
  const isPlatformPage =
    pathname === "/agents-store" ||
    pathname === "/agents" ||
    pathname.startsWith("/agents/") ||
    platformMenuItems.some(item => pathname === item.path)
  const isCommunityPage = pathname === "/blog" || pathname === "/podcast" || pathname === "/x" || pathname === "/linkedin"

  const getSubItemsForNav = (key: NavKey): SecondaryItem[] => {
    switch (key) {
      case 'platform': return platformMenuItems
      case 'services': return servicesMenuItems
      case 'community': return communityMenuItems
      case 'about': return secondaryMenuItems
      default: return []
    }
  }

  const handleNavMouseEnter = (key: NavKey) => {
    if (navHoverTimeoutRef.current) {
      clearTimeout(navHoverTimeoutRef.current)
      navHoverTimeoutRef.current = null
    }
    setHoveredNav(key)
  }

  const handleNavMouseLeave = () => {
    navHoverTimeoutRef.current = setTimeout(() => setHoveredNav(null), 150)
  }
  
  // Only render after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const listener = () => setPrefersReducedMotion(mq.matches)
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [])

  // Sync --header-height so main content padding matches (single sub-header: persistent or hover)
  const showSubBar = mounted && (isAboutUsPage || isLegalPage || isServicesPage || isPlatformPage || isCommunityPage) && !isMenuOpen
  const hoverSubBarVisible = hoveredNav !== null && getSubItemsForNav(hoveredNav).length > 0
  const anySubBarVisible = (showSubBar && !hoveredNav) || hoverSubBarVisible
  useEffect(() => {
    const height = anySubBarVisible ? '101px' : '52px'
    document.documentElement.style.setProperty('--header-height', height)
    return () => {
      document.documentElement.style.setProperty('--header-height', '52px')
    }
  }, [anySubBarVisible])

  // Hide header on scroll down, show on scroll up (web-standard behavior); respect reduced motion
  useEffect(() => {
    let rafId: number
    const handleScroll = () => {
      if (isMenuOpen) return
      if (prefersReducedMotion) {
        setHeaderVisible(true)
        return
      }
      rafId = requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - lastScrollY.current
        if (y <= scrollThreshold) {
          setHeaderVisible(true)
        } else if (delta > scrollDeltaMin) {
          setHeaderVisible(false)
        } else if (delta < -scrollDeltaMin) {
          setHeaderVisible(true)
        }
        lastScrollY.current = y
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [isMenuOpen, prefersReducedMotion])

  useEffect(() => {
    return () => {
      if (navHoverTimeoutRef.current) clearTimeout(navHoverTimeoutRef.current)
    }
  }, [])

  type MenuLink = string | { label: string; href: string; disabled?: boolean }
  const megaMenuSections: { title: string; icon: string; links: MenuLink[] }[] = [
    {
      title: "Platform",
      icon: "/img/menu-platform.png",
      links: [
        { label: "Tangram AI", href: "/tangram-ai" },
        { label: "Agents Store", href: "/tangram-ai-agents" },
        { label: "ISV", href: "/tangram-ai-isv" },
        { label: "Reseller", href: "/tangram-ai-reseller" },
      ],
    },
    {
      title: "Services",
      icon: "/img/menu-service.png",
      links: [
        { label: "Catalyst", href: "/catalyst" },
        { label: "Labs", href: "/labs" },
        { label: "Foundry", href: "/foundry" },
        { label: "Factory", href: "/factory" },
      ],
    },
    {
      title: "Community",
      icon: "/img/menu-community.png",
      links: ["YouTube", "LinkedIn", { label: "X", href: "/x" }, { label: "Blogs", href: "/blog" }, "Podcast"]
    },
    {
      title: "About Us",
      icon: "/img/menu-about.png",
      links: ["Vision", "Our Story", "Our Values", "Our Team", "Career"]
    },
    {
      title: "Other links",
      icon: "/img/menu-other.png",
      links: [
        { label: "Pricing", href: "#", disabled: true },
        { label: "Dev Docs", href: "#", disabled: true },
        { label: "Open Source [FOSS]", href: "#", disabled: true },
        { label: "Brand Kit", href: "#", disabled: true },
        { label: "Use case", href: "#", disabled: true },
        { label: "Case Study", href: "#", disabled: true },
        { label: "Micro Sites", href: "#", disabled: true },
      ]
    }
  ]

  return (
    <Fragment>
      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{
            backgroundColor: 'rgba(29, 29, 29, 0.40)',
          }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sticky header: hides on scroll down, shows on scroll up; respects prefers-reduced-motion */}
      <header 
        className={`crayon-header-transition fixed top-0 left-0 right-0 z-50 bg-white header-with-banner border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out ${
          headerVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: '0 25px',
          overflow: 'hidden',
        }}
      >
        {/* Main Header Row */}
        <div 
          className="flex items-center justify-between w-full"
          style={{
            height: '52px',
            minHeight: '52px',
            maxHeight: '52px',
            padding: '9px 0',
          }}
        >
        {/* Left Section - Logo */}
        <div className="flex items-center shrink-0">
          <Link 
            href="/"
            onClick={() => setIsMenuOpen(false)}
            style={{
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Go to home page"
          >
            <Image
              src="/img/crayon-header-logo.png"
              alt="Crayon Logo"
              width={100}
              height={28}
              className="h-auto"
              priority
            />
          </Link>
        </div>

        {/* Separator "/" between logo and nav - desktop only */}
        <span
          className="hidden lg:inline-flex items-center px-4 text-[15px] font-medium text-[#9CA3AF] select-none"
          aria-hidden
        >
          /
        </span>

        {/* Center - Main navigation (AI Platform, Catalyst, About Us) – Community hidden until content is ready */}
        <nav
          className="hidden lg:flex items-center justify-start gap-6 flex-1 relative"
          aria-label="Main navigation"
        >
          {[
            { key: 'platform' as NavKey, href: '/tangram-ai', label: 'AI Platform' },
            { key: 'services' as NavKey, href: '/catalyst', label: 'Catalyst' },
            { key: 'about' as NavKey, href: '/vision', label: 'About Us' },
          ].map(({ key, href, label }) => (
            <div
              key={key}
              className="relative"
              onMouseEnter={() => handleNavMouseEnter(key)}
              onMouseLeave={handleNavMouseLeave}
            >
              <Link
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-1 hover:text-[#0d2522] transition-colors"
                style={{
                  fontFamily: 'Poppins',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '14px',
                  lineHeight: '24px',
                  letterSpacing: '0px',
                  verticalAlign: 'middle',
                  color: '#091917',
                }}
              >
                {label}
                <ChevronDown className="w-4 h-4 shrink-0" aria-hidden />
              </Link>
            </div>
          ))}
        </nav>

        {/* Right Section - Enquire Now, Get started (profile moved to sub-nav when logged in) */}
        <div className="flex items-center gap-[24px]">
          {/* Enquire Now */}
          <Link
            href="/enquiry"
            onClick={() => setIsMenuOpen(false)}
            className="inline-flex items-center gap-2 text-[#091917] hover:text-[#0d2522] font-medium text-sm py-2 px-4 rounded-md transition-colors"
            style={{
              fontFamily: 'Poppins',
            }}
            aria-label="Go to enquiry page"
          >
            Enquire Now
            <ExternalLink className="w-4 h-4 shrink-0" aria-hidden />
          </Link>

          {/* Get started - only on platform pages when not logged in; opens login/signup */}
          {isPlatformPage && !isAuthenticated && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setIsMenuOpen(false)
                openModal("auth", { mode: "login", role: "client" })
              }}
              className="inline-flex items-center justify-center gap-2.5 rounded hover:opacity-90 transition-opacity"
              style={{
                width: 96,
                height: 32,
                padding: '7px 14px',
                borderRadius: 4,
                backgroundColor: '#181818',
                fontFamily: 'Poppins',
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '100%',
                letterSpacing: '0px',
                verticalAlign: 'middle',
                color: '#FFFFFF',
              }}
              aria-label="Get started - Login or Sign up"
            >
              Get started
            </button>
          )}
        </div>
        </div>

        {/* Hover sub-header dropdown – same alignment as persistent sub-nav (no extra padding; header already has 25px) */}
        {hoveredNav && getSubItemsForNav(hoveredNav).length > 0 && (
          <div
            className="w-full bg-white"
            style={{
              borderTop: '1px solid #E5E7EB',
            }}
            onMouseEnter={() => {
              if (navHoverTimeoutRef.current) {
                clearTimeout(navHoverTimeoutRef.current)
                navHoverTimeoutRef.current = null
              }
            }}
            onMouseLeave={handleNavMouseLeave}
          >
            <div
              className="header-sub-nav flex items-center gap-6 md:gap-8 shrink-0"
              style={{
                minHeight: '48px',
                padding: '12px 0',
                width: '100%',
                minWidth: 'min-content',
              }}
            >
              {getSubItemsForNav(hoveredNav).map((item) => {
                const isActive = pathname === item.path
                const isDisabled = item.disabled
                if (isDisabled) {
                  return (
                    <span
                      key={item.path}
                      aria-disabled="true"
                      title="Coming soon"
                      style={{
                        color: '#9CA3AF',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '14px',
                        lineHeight: '24px',
                        letterSpacing: '0px',
                        verticalAlign: 'middle',
                        whiteSpace: 'nowrap',
                        cursor: 'default',
                        userSelect: 'none',
                      }}
                    >
                      {item.label}
                    </span>
                  )
                }
                if (item.external) {
                  return (
                    <a
                      key={item.path}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: '#374151',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '14px',
                        lineHeight: '24px',
                        letterSpacing: '0px',
                        verticalAlign: 'middle',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#007BFF' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#374151' }}
                    >
                      {item.label}
                    </a>
                  )
                }
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => { setIsMenuOpen(false); setHoveredNav(null) }}
                    style={{
                      color: isActive ? '#004BEC' : '#374151',
                      fontFamily: 'Poppins',
                      fontWeight: 400,
                      fontStyle: 'normal',
                      fontSize: '14px',
                      lineHeight: '24px',
                      letterSpacing: '0px',
                      verticalAlign: 'middle',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#007BFF' }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = '#374151' }}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Secondary Menu Bar - Only show when no hover dropdown is open (single sub-header at a time) */}
        {mounted && !hoveredNav && (isAboutUsPage || isLegalPage || isServicesPage || isPlatformPage || isCommunityPage) && !isMenuOpen && (
          <>
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#E5E7EB',
                marginTop: '0px',
              }}
            />
            <nav
              aria-label="Section navigation"
              className="header-sub-nav scrollbar-hide overflow-x-auto"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                minHeight: '48px',
                width: '100%',
              }}
            >
              <div
                className="flex items-center gap-6 md:gap-8 shrink-0"
                style={{ minWidth: 'min-content' }}
              >
                {isAgentDetailPage ? (
                  <>
                    <Link
                      href="/agents"
                      className="flex items-center gap-1.5"
                      style={{
                        color: '#374151',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '24px',
                        letterSpacing: '0px',
                        verticalAlign: 'middle',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#007BFF' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#374151' }}
                    >
                      <ChevronLeft size={18} strokeWidth={2} aria-hidden />
                      Back to Store
                    </Link>
                    <span
                      aria-hidden
                      style={{
                        width: '1px',
                        height: '16px',
                        backgroundColor: '#E5E7EB',
                        flexShrink: 0,
                      }}
                    />
                    {AGENT_DETAIL_SECTIONS.map(({ id, label }) => (
                      <a
                        key={id}
                        href={`#${id}`}
                        style={{
                          color: '#374151',
                          fontFamily: 'Poppins',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '24px',
                          letterSpacing: '0px',
                          verticalAlign: 'middle',
                          textDecoration: 'none',
                          transition: 'color 0.2s',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#007BFF' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#374151' }}
                      >
                        {label}
                      </a>
                    ))}
                  </>
                ) : (isAboutUsPage
                  ? secondaryMenuItems
                  : isLegalPage
                    ? legalMenuItems
                    : isServicesPage
                      ? servicesMenuItems
                      : isPlatformPage
                        ? platformMenuItems
                        : communityMenuItems
                ).map((item) => {
                  const isActive = pathname === item.path
                  const isDisabledLegal =
                    isLegalPage &&
                    (item.path === "/terms-of-use" || item.path === "/trust-center" || item.path === "/privacy-civil-liberties")
                  const isDisabled = item.disabled || isDisabledLegal

                  if (isDisabled) {
                    return (
                      <span
                        key={item.path}
                        aria-disabled="true"
                        title="Coming soon"
                        style={{
                          color: '#9CA3AF',
                          fontFamily: 'Poppins',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '14px',
                          lineHeight: '24px',
                          letterSpacing: '0px',
                          verticalAlign: 'middle',
                          whiteSpace: 'nowrap',
                          cursor: 'default',
                          userSelect: 'none',
                        }}
                      >
                        {item.label}
                      </span>
                    )
                  }

                  if (item.external) {
                    return (
                      <a
                        key={item.path}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#374151',
                          fontFamily: 'Poppins',
                          fontWeight: 400,
                          fontStyle: 'normal',
                          fontSize: '14px',
                          lineHeight: '24px',
                          letterSpacing: '0px',
                          verticalAlign: 'middle',
                          textDecoration: 'none',
                          transition: 'color 0.2s',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#007BFF' }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = '#374151' }}
                      >
                        {item.label}
                      </a>
                    )
                  }

                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      style={{
                        color: isActive ? '#004BEC' : '#374151',
                        fontFamily: 'Poppins',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        fontSize: '14px',
                        lineHeight: '24px',
                        letterSpacing: '0px',
                        verticalAlign: 'middle',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#007BFF'
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#374151'
                      }}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>
              {/* Right side of sub-nav: Wishlist (agent detail) + Share + Profile (logged in) at extreme right */}
              <div className="flex items-center gap-3 shrink-0 pl-4">
                {isAgentDetailPage && (
                  <>
                    {headerAgentId && (
                      <button
                        type="button"
                        onClick={handleHeaderWishlistClick}
                        className="flex items-center justify-center w-10 h-10 rounded border border-gray-200 bg-gray-100 text-[#111827] hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow"
                        style={{ minWidth: 40, minHeight: 40 }}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          size={18}
                          fill={isWishlisted ? "#EF4444" : "none"}
                          stroke={isWishlisted ? "#EF4444" : "#111827"}
                          strokeWidth={2}
                        />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleShareClick}
                      className="flex items-center justify-center w-10 h-10 rounded border border-gray-200 bg-gray-100 text-[#111827] hover:bg-gray-200 transition-all duration-200 shadow-sm hover:shadow"
                      style={{ minWidth: 40, minHeight: 40 }}
                      aria-label="Share"
                    >
                      <Share2 size={18} strokeWidth={2} />
                    </button>
                  </>
                )}
                {/* User profile dropdown - extreme right of sub-nav when logged in */}
                {isPlatformPage && isAuthenticated && user && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#091917] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
                        style={{ width: 36, height: 36 }}
                        aria-label="User menu"
                      >
                        <Avatar className="h-8 w-8 border border-gray-200">
                          <AvatarFallback
                            className="bg-[#181818] text-white text-xs font-medium"
                            style={{ fontFamily: 'Poppins' }}
                          >
                            {getInitials(user.email)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" sideOffset={8} className="min-w-[180px]">
                      <DropdownMenuItem asChild>
                        <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      {(user.role === 'isv' || user.role === 'reseller') && (
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {user.role === 'admin' && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 cursor-pointer">
                            <LayoutDashboard className="h-4 w-4" />
                            Admin
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        className="cursor-pointer"
                        onClick={() => {
                          logout()
                          setIsMenuOpen(false)
                          router.push('/agents')
                        }}
                      >
                        <LogOut className="h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </nav>
          </>
        )}

        {/* Divider aligned to header bottom */}
        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: '#E0E0E0',
            marginTop: '0px',
            opacity: isMenuOpen ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
          }}
        />

        {/* Mega Menu - Expands from header */}
        <div
          style={{
            maxHeight: isMenuOpen ? '500px' : '0',
            overflow: 'hidden',
            opacity: isMenuOpen ? 1 : 0,
            transition: 'max-height 0.4s ease-out, opacity 0.3s ease-out',
          }}
        >
          {isMenuOpen && (
          <div
            style={{
              padding: '20px 0 40px 0',
            }}
          >
          <div className="grid grid-cols-6 gap-8">
            {/* Menu Columns */}
            {megaMenuSections.map((section, index) => (
              <div key={index} className="flex flex-col relative">
                {/* Divider between columns */}
                {index > 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '-16px',
                      top: 0,
                      bottom: 0,
                      width: '1px',
                      backgroundColor: '#E5E7EB',
                    }}
                  />
                )}
                <div className="flex items-center" style={{ marginBottom: '14px', gap: '18px' }}>
                  <div style={{ width: '20px', height: '20px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                      src={section.icon}
                      alt={section.title}
                      width={20}
                      height={20}
                      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                      unoptimized
                    />
                  </div>
                  <h3
                    style={{
                      color: '#1F2937',
                      fontFamily: 'Poppins',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      lineHeight: '24px',
                    }}
                  >
                    {section.title}
                  </h3>
                </div>
                <ul className="flex flex-col" style={{ gap: '10px', paddingLeft: '38px' }}>
                  {section.links.map((link) => {
                    const label = typeof link === 'string' ? link : link.label
                    const href = typeof link === 'string' ? `/${link.toLowerCase().replace(/\s+/g, '-')}` : link.href
                    const disabled = typeof link === 'object' && link.disabled
                    if (disabled) {
                      return (
                        <li key={label}>
                          <span
                            title="Coming soon"
                            style={{
                              color: '#9CA3AF',
                              fontFamily: 'Poppins',
                              fontSize: '14px',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              lineHeight: '24px',
                              cursor: 'default',
                            }}
                          >
                            {label}
                          </span>
                        </li>
                      )
                    }
                    return (
                      <li key={label}>
                        <Link
                          href={href}
                          onClick={() => setIsMenuOpen(false)}
                          style={{
                            color: '#374151',
                            fontFamily: 'Poppins',
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            lineHeight: '24px',
                            textDecoration: 'none',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#007BFF'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#374151'
                          }}
                        >
                          {label}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}

            {/* AI Assistant Card */}
            <Link href="/upgrade" style={{ textDecoration: 'none' }}>
              <Image
                src="/img/menu-ai-assistant.png"
                alt="AI Assistant"
                width={300}
                height={340}
                className="w-full h-auto"
                style={{ borderRadius: '8px' }}
                unoptimized
              />
            </Link>
          </div>
          </div>
          )}
        </div>
      </header>
      {headerAgentId && (
        <WishlistPickerModal
          isOpen={isWishlistPickerOpen}
          onClose={() => setIsWishlistPickerOpen(false)}
          agentId={headerAgentId}
          agentName={headerAgentName}
        />
      )}
    </Fragment>
  )
}

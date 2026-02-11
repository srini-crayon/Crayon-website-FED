'use client'

import { useState, Fragment, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { X, ChevronDown, ExternalLink, User, LayoutDashboard, LogOut } from "lucide-react"
import { useModal } from "../hooks/use-modal"
import { useAuthStore } from "../lib/store/auth.store"
import { Avatar, AvatarFallback } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function CrayonHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)
  const pathname = usePathname()
  const router = useRouter()
  const { openModal } = useModal()
  const { isAuthenticated, user, logout } = useAuthStore()
  const scrollThreshold = 8

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
    { label: "Our Investors", path: "/our-investors" },
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
    { label: "Labs", path: "/labs", disabled: true },
    { label: "Foundry", path: "/foundry", disabled: true },
    { label: "Factory", path: "/factory", disabled: true },
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
  
  // Only render after mount to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide header on scroll down, show on scroll up so it doesn't cover content
  useEffect(() => {
    const handleScroll = () => {
      if (isMenuOpen) return
      const y = window.scrollY
      if (y <= scrollThreshold) {
        setHeaderVisible(true)
      } else if (y > lastScrollY.current) {
        setHeaderVisible(false)
      } else {
        setHeaderVisible(true)
      }
      lastScrollY.current = y
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMenuOpen])

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
        { label: "Labs", href: "/labs", disabled: true },
        { label: "Foundry", href: "/foundry", disabled: true },
        { label: "Factory", href: "/factory", disabled: true },
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
      links: ["Vision", "Our Story", "Our Values", "Our Team", "Our Investors", "Career"]
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

      {/* Sticky header: hides on scroll down, shows on scroll up so it doesn't cover content */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-white header-with-banner border-b border-gray-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out ${
          headerVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          padding: isMenuOpen ? '0 25px' : '0 25px',
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

        {/* Center - Main navigation (Platform, Services, Community, About Us, Pricing, Resources) - left aligned */}
        <nav
          className="hidden lg:flex items-center justify-start gap-6 flex-1"
          aria-label="Main navigation"
        >
          <Link
            href="/tangram-ai"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-1 text-[15px] font-medium text-[#091917] hover:text-[#0d2522] transition-colors"
          >
            Platform
            <ChevronDown className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
          <Link
            href="/catalyst"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-1 text-[15px] font-medium text-[#091917] hover:text-[#0d2522] transition-colors"
          >
            Services
            <ChevronDown className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-1 text-[15px] font-medium text-[#091917] hover:text-[#0d2522] transition-colors"
          >
            Community
            <ChevronDown className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
          <Link
            href="/vision"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-1 text-[15px] font-medium text-[#091917] hover:text-[#0d2522] transition-colors"
          >
            About Us
            <ChevronDown className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
          <Link
            href="#pricing"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-1 text-[15px] font-medium text-[#091917] hover:text-[#0d2522] transition-colors"
          >
            Pricing
            <ChevronDown className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
          <Link
            href="/blog"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-1 text-[15px] font-medium text-[#091917] hover:text-[#0d2522] transition-colors"
          >
            Resources
            <ChevronDown className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
        </nav>

        {/* Right Section - Enquire Now, User profile (when logged in on platform) or Get started */}
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

          {/* User profile dropdown - on platform/agent store when logged in */}
          {isPlatformPage && isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#091917] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
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

        {/* Secondary Menu Bar - Only show on About Us, Legal, Platform, or Community pages and when mega menu is closed */}
        {mounted && (isAboutUsPage || isLegalPage || isServicesPage || isPlatformPage || isCommunityPage) && !isMenuOpen && (
          <>
            <div
              style={{
                width: '100%',
                height: '1px',
                backgroundColor: '#E5E7EB',
                marginTop: '0px',
              }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0',
                height: '48px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '32px',
                }}
              >
                {(isAboutUsPage
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
                          color: "#9CA3AF",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "24px",
                          whiteSpace: "nowrap",
                          cursor: "default",
                          userSelect: "none",
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
                          color: "var(--Interface-Color-Neutral-700, #374151)",
                          fontFamily: "Poppins",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 400,
                          lineHeight: "24px",
                          textDecoration: "none",
                          transition: "color 0.2s",
                          whiteSpace: "nowrap",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#007BFF"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--Interface-Color-Neutral-700, #374151)"
                        }}
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
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: isActive ? 500 : 400,
                        lineHeight: '24px',
                        letterSpacing: '0px',
                        verticalAlign: 'middle',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.color = '#374151'
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
            </div>
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
    </Fragment>
  )
}

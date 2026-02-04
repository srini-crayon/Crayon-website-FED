'use client'

import { useState, Fragment, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { X } from "lucide-react"
import { useModal } from "../hooks/use-modal"

export function CrayonHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { openModal } = useModal()

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

      {/* Floating Header */}
      <header 
        className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-white"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'calc(100% - 40px)',
          maxWidth: '1472px',
          padding: isMenuOpen ? '0 25px' : '0 25px',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 6px 16px rgba(17, 24, 39, 0.05)',
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
        {/* Left Section - Logo & Tagline/Menu */}
        <div className="flex items-center" style={{ gap: '18px' }}>
          {/* Logo */}
          <div className="flex items-center">
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

          {/* Vertical Separator - Only show when there's a secondary menu */}
          {(isAboutUsPage || isLegalPage || isServicesPage || isPlatformPage || isCommunityPage) && (
            <div
              style={{
                width: '1px',
                height: '20px',
                backgroundColor: '#E5E7EB',
              }}
            />
          )}

          {/* Tagline or Menu text */}
          {isMenuOpen ? (
            <span
              style={{
                color: '#1F2937',
                fontFamily: 'Poppins',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '24px',
              }}
            >
              Menu
            </span>
          ) : (
            <>
              {isAboutUsPage && (
                <span
                  style={{
                    color: '#4A4A4A',
                    fontFamily: 'Poppins',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  About Us
                </span>
              )}
              {isLegalPage && (
                <span
                  style={{
                    color: '#4A4A4A',
                    fontFamily: 'Poppins',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  Legal
                </span>
              )}
              {isPlatformPage && (
                <span
                  style={{
                    color: '#4A4A4A',
                    fontFamily: 'Poppins',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  Platform
                </span>
              )}
              {isServicesPage && (
                <span
                  style={{
                    color: '#4A4A4A',
                    fontFamily: 'Poppins',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  Services
                </span>
              )}
              {isCommunityPage && (
                <span
                  style={{
                    color: '#4A4A4A',
                    fontFamily: 'Poppins',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                  }}
                >
                  Community
                </span>
              )}
            </>
          )}
        </div>

        {/* Right Section - Button & Menu */}
        <div className="flex items-center gap-6">
          {/* Enquiry Now Button */}
          <Link
            href="/enquiry"
            onClick={() => setIsMenuOpen(false)}
            style={{
              backgroundColor: '#1A1A1A',
              color: '#FFFFFF',
              fontFamily: 'Poppins',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 400,
              padding: '8px 16px',
              borderRadius: '6px',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            aria-label="Go to enquiry page"
          >
            Enquire Now
          </Link>

          {/* Hamburger Menu Icon */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={24} color="#4A4A4A" />
            ) : (
              <>
                <div
                  style={{
                    width: '25px',
                    height: '2px',
                    backgroundColor: '#4A4A4A',
                  }}
                />
                <div
                  style={{
                    width: '25px',
                    height: '2px',
                    backgroundColor: '#4A4A4A',
                  }}
                />
              </>
            )}
          </button>
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
                        color: isActive ? '#007BFF' : 'var(--Interface-Color-Neutral-700, #374151)',
                        fontFamily: 'Poppins',
                        fontSize: '14px',
                        fontStyle: 'normal',
                        fontWeight: isActive ? 500 : 400,
                        lineHeight: '24px',
                        textDecoration: 'none',
                        transition: 'color 0.2s',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'var(--Interface-Color-Neutral-700, #374151)'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = 'var(--Interface-Color-Neutral-700, #374151)'
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              {/* Platform-only: Login / Signup on right end */}
              {isPlatformPage && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                  }}
                >
                  <Link
                    href="/auth/login"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsMenuOpen(false)
                      openModal("auth", { mode: "login", role: "client" })
                    }}
                    style={{
                      color: 'var(--Interface-Color-Neutral-700, #374151)',
                      fontFamily: 'Poppins',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '24px',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#007BFF'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--Interface-Color-Neutral-700, #374151)'
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsMenuOpen(false)
                      openModal("auth", { mode: "signup", role: "client" })
                    }}
                    style={{
                      color: 'var(--Interface-Color-Neutral-700, #374151)',
                      fontFamily: 'Poppins',
                      fontSize: '14px',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      lineHeight: '24px',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#007BFF'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--Interface-Color-Neutral-700, #374151)'
                    }}
                  >
                    Signup
                  </Link>
                </div>
              )}
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

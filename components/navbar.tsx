"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { Bell, LayoutDashboard, User, LogOut, ChevronDown, Menu, X, Mail, Building2, Heart, Landmark, Store, Wallet, ShieldCheck } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "./ui/dropdown-menu"
import { BrandLogo } from "./brand-logo"
import { useAuthStore } from "../lib/store/auth.store"
import { useEnquiriesStore } from "../lib/store/enquiries.store"
import { useModal } from "../hooks/use-modal"
import { useState, useRef, useEffect, useMemo } from "react"
import { useToast } from "../hooks/use-toast"
import { Badge } from "./ui/badge"
import { NotificationAlertBar } from "./notification-alert-bar"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout, token } = useAuthStore()
  const { enquiries, isLoading: isLoadingEnquiries, fetchEnquiries } = useEnquiriesStore()
  const { openModal } = useModal()
  const { toast } = useToast()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const alertBarRef = useRef<HTMLDivElement>(null)
  const [alertBarHeight, setAlertBarHeight] = useState(0)

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  // Transform enquiries to notifications (memoized)
  const notifications = useMemo(() => {
    if (user?.role !== 'admin' || !enquiries.length) return []

    return enquiries.map((enquiry: any) => ({
      id: enquiry.enquiry_id || `enquiry_${enquiry.created_at}`,
      title: `New Contact Enquiry from ${enquiry.full_name}`,
      description: enquiry.message || 'No message provided',
      time: formatRelativeTime(enquiry.created_at),
      read: enquiry.status !== 'new',
      type: 'enquiry' as const,
      enquiryData: enquiry,
    }))
  }, [enquiries, user?.role])

  const hasUnread = notifications.some((n) => !n.read)

  const markAllAsRead = () => {
    // This would need a backend call to mark as read
    // For now just a visual update
  }

  // Fetch enquiries when user is admin (using centralized store)
  useEffect(() => {
    if (user?.role === 'admin' && token) {
      fetchEnquiries(token)
      // Refresh enquiries every 30 seconds
      const interval = setInterval(() => fetchEnquiries(token), 30000)
      return () => clearInterval(interval)
    }
  }, [user?.role, token, fetchEnquiries])

  // Handle scroll for sticky navbar
  useEffect(() => {
    // Always show navbar on agents/chat page (constant sticky)
    if (pathname === '/agents/chat') {
      setIsNavbarVisible(true)
      return
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = documentHeight > 0 ? (currentScrollY / documentHeight) * 100 : 0

      // Always show navbar when at top (within 20px)
      if (currentScrollY < 20) {
        setIsNavbarVisible(true)
        setLastScrollY(currentScrollY)
        return
      }

      // Show navbar when scrolling up and past 20% of page
      if (currentScrollY < lastScrollY - 5) {
        // Scrolling up - show navbar if past 20% threshold
        if (scrollPercentage >= 20) {
          setIsNavbarVisible(true)
        }
      } else if (currentScrollY > lastScrollY + 5) {
        // Scrolling down - hide navbar
        setIsNavbarVisible(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, pathname])

  // Measure alert bar height
  useEffect(() => {
    const measureAlertBar = () => {
      if (alertBarRef.current) {
        setAlertBarHeight(alertBarRef.current.offsetHeight)
      } else {
        setAlertBarHeight(0)
      }
    }

    measureAlertBar()
    // Re-measure periodically to handle alert bar dismissal
    const interval = setInterval(measureAlertBar, 100)
    return () => clearInterval(interval)
  }, [pathname])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const mobileMenu = document.getElementById('mobile-menu')
      const mobileMenuButton = document.getElementById('mobile-menu-button')

      if (mobileMenu && mobileMenuButton &&
        !mobileMenu.contains(event.target as Node) &&
        !mobileMenuButton.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }
  }, [isMobileMenuOpen])

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
    router.push("/")
  }

  const handleDashboardClick = () => {
    if (!user) return

    setIsDropdownOpen(false)

    switch (user.role) {
      case 'admin':
        router.push('/admin')
        break
      case 'isv':
        router.push('/dashboard')
        break
      case 'reseller':
        toast({
          description: "Dashboard is not available for resellers.",
          variant: "destructive",
        })
        router.push('/')
        break
      case 'client':
        router.push('/dashboard')
        break
      default:
        router.push('/dashboard')
    }
  }

  const getUserInitials = (email: string) => {
    // Try to get initials from email username part
    const username = email.split('@')[0]
    return username
      .split(/[._-]/)
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getDisplayName = (email: string) => {
    // Extract username from email and capitalize first letter
    const username = email.split('@')[0]
    return username.charAt(0).toUpperCase() + username.slice(1)
  }

  return (
    <>
      {pathname !== '/agents/chat' && (
        <div ref={alertBarRef}>
          <NotificationAlertBar />
        </div>
      )}
      <nav
        className={`bg-white sticky top-0 z-50 transition-transform duration-300 ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
      >
        <div className="w-full px-8 md:px-12 lg:px-16">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-6 flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <BrandLogo width={120} height={32} priority />
              </Link>
              {/* Divider */}
              <div className="hidden md:flex items-center justify-center text-[#E5E7EB] text-lg font-light flex-shrink-0">
                /
              </div>
              {/* Desktop Navigation */}
              <div className="hidden items-center gap-[24px] md:flex whitespace-nowrap flex-shrink-0">
                <Link
                  href="/agents"
                  onClick={(e) => {
                    // Always navigate to /agents without query params to clear chat mode
                    if (pathname === '/agents') {
                      e.preventDefault()
                      router.push('/agents')
                    }
                  }}
                  className={`text-[14px] whitespace-nowrap transition-all px-1 py-2 ${pathname === '/agents'
                    ? 'font-medium text-[#091917]'
                    : 'font-normal text-[#091917] hover:font-medium'
                    }`}
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: '24px'
                  }}
                >
                  Agent Store
                </Link>
                <Link
                  href="/ai-catalyst"
                  className={`text-[14px] whitespace-nowrap transition-all ${pathname === '/isv'
                    ? 'font-medium text-[#091917]'
                    : 'font-normal text-[#091917] hover:font-medium'
                    }`}
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: '24px'
                  }}
                >
                  AI Catalyst
                </Link>
                {/* Industry Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`text-[14px] whitespace-nowrap transition-all px-1 py-2 flex items-center gap-1.5 ${
                        pathname === '/banking' || pathname === '/insurance' || pathname?.startsWith('/banking') || pathname?.startsWith('/insurance')
                          ? 'font-medium text-[#091917]'
                          : 'font-normal text-[#091917] hover:font-medium'
                      } [&[data-state=open]>svg]:rotate-180`}
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                        lineHeight: '24px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Industry
                      <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 ease-in-out" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[480px] bg-white shadow-xl rounded-b-xl p-4 border-0"
                    sideOffset={5}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {/* Banking */}
                      <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                        <Link
                          href="/banking"
                          className={`group flex flex-col items-start gap-2.5 p-3 rounded-lg transition-all duration-200 cursor-pointer border-2 h-full ${
                            pathname === '/banking' || pathname?.startsWith('/banking')
                              ? 'bg-blue-50/50 border-blue-400 shadow-sm'
                              : 'border-transparent hover:bg-gray-50 hover:border-blue-200'
                          }`}
                          onClick={() => router.push('/banking')}
                        >
                          <div className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 ${
                            pathname === '/banking' || pathname?.startsWith('/banking')
                              ? 'bg-blue-100'
                              : 'bg-teal-50 group-hover:bg-blue-50'
                          }`}>
                            <Landmark className={`h-5 w-5 transition-colors ${
                              pathname === '/banking' || pathname?.startsWith('/banking')
                                ? 'text-blue-600'
                                : 'text-teal-500 group-hover:text-blue-500'
                            }`} />
                          </div>
                          <div className="flex-1 w-full min-h-[48px] flex flex-col justify-between">
                            <div>
                              <div className={`text-sm font-bold mb-0.5 transition-colors ${
                                pathname === '/banking' || pathname?.startsWith('/banking')
                                  ? 'text-blue-700'
                                  : 'text-[#091917]'
                              }`}>
                                Banking
                              </div>
                              <div className="text-xs text-gray-500 leading-snug">
                                Financial services & solutions
                              </div>
                            </div>
                            <div className="h-5"></div>
                          </div>
                        </Link>
                      </DropdownMenuItem>

                      {/* Insurance */}
                      <DropdownMenuItem asChild className="p-0 focus:bg-transparent">
                        <Link
                          href="/insurance"
                          className={`group flex flex-col items-start gap-2.5 p-3 rounded-lg transition-all duration-200 cursor-pointer border-2 h-full ${
                            pathname === '/insurance' || pathname?.startsWith('/insurance')
                              ? 'bg-purple-50/50 border-purple-400 shadow-sm'
                              : 'border-transparent hover:bg-gray-50 hover:border-purple-200'
                          }`}
                          onClick={() => router.push('/insurance')}
                        >
                          <div className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 ${
                            pathname === '/insurance' || pathname?.startsWith('/insurance')
                              ? 'bg-purple-100'
                              : 'bg-teal-50 group-hover:bg-purple-50'
                          }`}>
                            <ShieldCheck className={`h-5 w-5 transition-colors ${
                              pathname === '/insurance' || pathname?.startsWith('/insurance')
                                ? 'text-purple-600'
                                : 'text-teal-500 group-hover:text-purple-500'
                            }`} />
                          </div>
                          <div className="flex-1 w-full min-h-[48px] flex flex-col justify-between">
                            <div>
                              <div className={`text-sm font-bold mb-0.5 transition-colors ${
                                pathname === '/insurance' || pathname?.startsWith('/insurance')
                                  ? 'text-purple-700'
                                  : 'text-[#091917]'
                              }`}>
                                Insurance
                              </div>
                              <div className="text-xs text-gray-500 leading-snug">
                                Risk management & claims
                              </div>
                            </div>
                            <div className="h-5"></div>
                          </div>
                        </Link>
                      </DropdownMenuItem>

                      {/* Industry Retail - Coming Soon */}
                      <DropdownMenuItem
                        disabled
                        className="p-0 opacity-50 cursor-not-allowed focus:bg-transparent"
                      >
                        <div className="flex flex-col items-start gap-2.5 p-3 rounded-lg w-full h-full border-2 border-transparent">
                          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-100">
                            <Store className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1 w-full min-h-[48px] flex flex-col justify-between">
                            <div>
                              <div className="text-sm font-bold mb-0.5 text-gray-400">
                                Industry Retail
                              </div>
                              <div className="text-xs text-gray-400 leading-snug">
                                Retail solutions & commerce
                              </div>
                            </div>
                            <div className="h-5 flex items-end">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-200 text-gray-600">
                                Coming Soon
                              </span>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>

                      {/* NBFC - Coming Soon */}
                      <DropdownMenuItem
                        disabled
                        className="p-0 opacity-50 cursor-not-allowed focus:bg-transparent"
                      >
                        <div className="flex flex-col items-start gap-2.5 p-3 rounded-lg w-full h-full border-2 border-transparent">
                          <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-100">
                            <Wallet className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1 w-full min-h-[48px] flex flex-col justify-between">
                            <div>
                              <div className="text-sm font-bold mb-0.5 text-gray-400">
                                NBFC
                              </div>
                              <div className="text-xs text-gray-400 leading-snug">
                                Non-banking finance solutions
                              </div>
                            </div>
                            <div className="h-5 flex items-end">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-200 text-gray-600">
                                Coming Soon
                              </span>
                            </div>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span
                  className="text-[14px] whitespace-nowrap font-normal text-[#091917] cursor-not-allowed"
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: '24px',
                    opacity: 0.5
                  }}
                >
                  Use Cases
                </span>
                <Link
                  href="/isv"
                  className={`text-[14px] whitespace-nowrap transition-all ${pathname === '/reseller'
                    ? 'font-medium text-[#091917]'
                    : 'font-normal text-[#091917] hover:font-medium'
                    }`}
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: '24px'
                  }}
                >
                  ISV
                </Link>
                <Link
                  href="/reseller"
                  className={`text-[14px] whitespace-nowrap transition-all ${pathname === '/ai-catalyst'
                    ? 'font-medium text-[#091917]'
                    : 'font-normal text-[#091917] hover:font-medium'
                    }`}
                  style={{
                    fontFamily: 'Poppins, sans-serif',
                    lineHeight: '24px'
                  }}
                >
                  Reseller
                </Link>

              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated && user && (
                <>
                  {/* Notification Bell Button */}
                  <button
                    aria-label="Notifications"
                    className="relative p-2"
                    style={{ color: "#4B5563" }}
                    onClick={() => setIsNotificationPanelOpen(true)}
                  >
                    <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    {hasUnread && (
                      <span className="absolute -right-0.5 -top-0.5 inline-block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                    )}
                  </button>

                  {/* Notification Side Panel */}
                  {isNotificationPanelOpen && (
                    <>
                      {/* Overlay */}
                      <div
                        className="fixed inset-0 bg-black/30 z-[100]"
                        onClick={() => setIsNotificationPanelOpen(false)}
                      />
                      {/* Side Panel */}
                      <div
                        className="fixed top-0 right-0 h-full bg-white shadow-2xl z-[101] flex flex-col"
                        style={{
                          width: 'min(420px, calc(100vw - 32px))',
                          animation: 'slideInFromRight 0.3s ease-out',
                        }}
                      >
                        {/* Header */}
                        <div className="px-4 pt-4 pb-3 flex items-center justify-between border-b shrink-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold">Notifications</span>
                            {user?.role === 'admin' && enquiries.length > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {enquiries.filter((e: any) => e.status === 'new').length} new
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {notifications.length > 0 && (
                              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                                Mark all as read
                              </Button>
                            )}
                            <button
                              onClick={() => setIsNotificationPanelOpen(false)}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              aria-label="Close notifications"
                            >
                              <X className="h-5 w-5 text-gray-500" />
                            </button>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto py-2">
                          {isLoadingEnquiries && user?.role === 'admin' ? (
                            <div className="px-4 py-8 text-center text-sm text-gray-500">
                              Loading enquiries...
                            </div>
                          ) : notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-gray-500">
                              No notifications
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-100">
                              {notifications.map((n) => (
                                <div key={n.id} className="px-4 py-4 hover:bg-gray-50 transition-colors">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
                                      <Mail className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-start justify-between gap-2 mb-1">
                                        <div className="flex-1">
                                          <p className="text-sm font-semibold text-gray-900">
                                            {n.enquiryData?.full_name || 'Unknown'}
                                          </p>
                                          {n.enquiryData?.company_name && (
                                            <div className="flex items-center gap-1 mt-0.5">
                                              <Building2 className="h-3 w-3 text-gray-400" />
                                              <p className="text-xs text-gray-500 truncate">
                                                {n.enquiryData.company_name}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                          {n.enquiryData?.status === 'new' && (
                                            <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-blue-600">
                                              New
                                            </Badge>
                                          )}
                                          {!n.read && <span className="h-2 w-2 rounded-full bg-blue-500" aria-hidden="true" />}
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-700 line-clamp-2 mb-2">
                                        {n.description}
                                      </p>
                                      <div className="flex items-center justify-between gap-2 mt-2">
                                        <div className="flex items-center gap-3 text-[10px] text-gray-500">
                                          {n.enquiryData?.email && (
                                            <span className="truncate max-w-[120px]">{n.enquiryData.email}</span>
                                          )}
                                          {n.enquiryData?.phone && (
                                            <span>{n.enquiryData.phone}</span>
                                          )}
                                        </div>
                                        <span className="text-[10px] text-gray-400 shrink-0">{n.time}</span>
                                      </div>
                                      {n.enquiryData?.user_type && n.enquiryData.user_type !== 'anonymous' && (
                                        <div className="mt-2">
                                          <Badge variant="outline" className="text-[10px]">
                                            {n.enquiryData.user_type.toUpperCase()}
                                          </Badge>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Footer */}
                        {user?.role === 'admin' && enquiries.length > 0 && (
                          <div className="border-t px-4 py-3 bg-gray-50 shrink-0">
                            <p className="text-xs text-gray-500 text-center">
                              {enquiries.length} total {enquiries.length === 1 ? 'enquiry' : 'enquiries'}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {/* Separator */}
                  <div className="flex items-center justify-center text-[#E5E7EB] text-lg font-light flex-shrink-0">
                    /
                  </div>
                </>
              )}

              {isAuthenticated && user ? (
                // Authenticated state - User avatar with dropdown
                <div className="relative z-[60]" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      backgroundColor: "#181818",
                      border: "0.5px solid #E0E0E0",
                      borderRadius: "50px",
                      padding: "3px 8px 3px 3px",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "14px",
                      color: "#FFFFFF",
                      transition: "all 0.2s",
                      height: "38px",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.9"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1"
                    }}
                  >
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "#FFFFFF",
                        padding: "2px",
                        boxShadow: "0px 1px 4px rgba(12, 12, 13, 0.05)",
                      }}>
                        <div style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          backgroundColor: "#FFC334",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                          fontSize: "14px",
                          color: "#091917",
                        }}>
                          {getUserInitials(user.email)}
                        </div>
                      </div>
                      <span style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 500,
                        fontSize: "14px",
                        lineHeight: "24px",
                        color: "#FFFFFF",
                      }}>
                        {getDisplayName(user.email)}
                      </span>
                    </div>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <ChevronDown className="h-3 w-3" style={{ color: "#FFFFFF" }} />
                    </div>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mb-2 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-xl z-60">
                      {/* Dashboard option - only for ISV and client, not for reseller */}
                      {user.role !== 'reseller' && (
                        <button
                          onClick={handleDashboardClick}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </button>
                      )}
                      {/* Wishlist option - for all authenticated users */}
                      <Link
                        href="/wishlists"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Heart className="h-4 w-4" />
                        Wishlists
                      </Link>
                      {/* Profile option - for ISV and reseller, not for admin */}
                      {(user.role === 'isv' || user.role === 'reseller') && (
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          View Profile
                        </Link>
                      )}
                      {/* Contact us option - visible to all users */}
                      <Link
                        href="/contact"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Mail className="h-4 w-4" />
                        Contact us
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 text-red-600" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Unauthenticated state - Contact and Get Started buttons
                <>
                  <Link
                    href="/contact"
                    className={`text-[14px] whitespace-nowrap transition-all px-1 py-2 ${pathname === '/contact'
                      ? 'font-medium text-[#091917]'
                      : 'font-normal text-[#091917] hover:font-medium'
                      }`}
                    style={{
                      fontFamily: 'Poppins, sans-serif',
                      lineHeight: '24px'
                    }}
                  >
                    Contact
                  </Link>
                  <button
                    type="button"
                    onClick={() => openModal("auth", { mode: "signup", role: "client" })}
                    className="bg-[#181818] text-white text-[14px] font-normal rounded-[4px] px-[17px] py-[7px] hover:opacity-90 transition-opacity h-[38px] flex items-center justify-center whitespace-nowrap"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Get Started
                  </button>
                </>
              )}

              {/* Mobile Menu Button - positioned after profile */}
              <button
                id="mobile-menu-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 transition-colors"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-40"
          >
            <div className="px-6 py-4 space-y-3">
              <Link
                href="/agents"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  // Navigate to agents page, clearing any chat mode
                  if (pathname === '/agents') {
                    router.push('/agents')
                  }
                }}
                className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
              >
                Agent Store
              </Link>
              <Link
                href="/ai-catalyst"
                className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                AI Catalyst
              </Link>
              {/* Industry Section - Mobile */}
              <div className="py-3 border-t border-gray-100 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  {/* Banking */}
                  <Link
                    href="/banking"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex flex-col items-start gap-2.5 p-3 rounded-lg transition-all duration-200 border-2 h-full ${
                      pathname === '/banking' || pathname?.startsWith('/banking')
                        ? 'bg-blue-50/50 border-blue-400 shadow-sm'
                        : 'border-transparent hover:bg-gray-50 hover:border-blue-200'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 ${
                      pathname === '/banking' || pathname?.startsWith('/banking')
                        ? 'bg-blue-100'
                        : 'bg-teal-50 group-hover:bg-blue-50'
                    }`}>
                      <Landmark className={`h-5 w-5 transition-colors ${
                        pathname === '/banking' || pathname?.startsWith('/banking')
                          ? 'text-blue-600'
                          : 'text-teal-500 group-hover:text-blue-500'
                      }`} />
                    </div>
                    <div className="flex-1 w-full min-h-[48px] flex flex-col justify-between">
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${
                          pathname === '/banking' || pathname?.startsWith('/banking')
                            ? 'text-blue-700'
                            : 'text-[#091917]'
                        }`}>
                          Banking
                        </div>
                        <div className="text-xs text-gray-500 leading-snug">
                          Financial services & solutions
                        </div>
                      </div>
                      <div className="h-5"></div>
                    </div>
                  </Link>

                  {/* Insurance */}
                  <Link
                    href="/insurance"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`group flex flex-col items-start gap-2.5 p-3 rounded-lg transition-all duration-200 border-2 h-full ${
                      pathname === '/insurance' || pathname?.startsWith('/insurance')
                        ? 'bg-purple-50/50 border-purple-400 shadow-sm'
                        : 'border-transparent hover:bg-gray-50 hover:border-purple-200'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-200 ${
                      pathname === '/insurance' || pathname?.startsWith('/insurance')
                        ? 'bg-purple-100'
                        : 'bg-teal-50 group-hover:bg-purple-50'
                    }`}>
                      <ShieldCheck className={`h-5 w-5 transition-colors ${
                        pathname === '/insurance' || pathname?.startsWith('/insurance')
                          ? 'text-purple-600'
                          : 'text-teal-500 group-hover:text-purple-500'
                      }`} />
                    </div>
                    <div className="flex-1 w-full min-h-[48px] flex flex-col justify-between">
                      <div>
                        <div className={`text-sm font-bold mb-0.5 transition-colors ${
                          pathname === '/insurance' || pathname?.startsWith('/insurance')
                            ? 'text-purple-700'
                            : 'text-[#091917]'
                        }`}>
                          Insurance
                        </div>
                        <div className="text-xs text-gray-500 leading-snug">
                          Risk management & claims
                        </div>
                      </div>
                      <div className="h-5"></div>
                    </div>
                  </Link>

                  {/* Industry Retail - Coming Soon */}
                  <div className="flex flex-col items-start gap-2.5 p-3 rounded-lg opacity-50 cursor-not-allowed h-full border-2 border-transparent">
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-100">
                      <Store className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 w-full min-h-[48px] flex flex-col justify-between">
                      <div>
                        <div className="text-sm font-bold mb-0.5 text-gray-400">
                          Industry Retail
                        </div>
                        <div className="text-xs text-gray-400 leading-snug">
                          Retail solutions & commerce
                        </div>
                      </div>
                      <div className="h-5 flex items-end">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-200 text-gray-600">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* NBFC - Coming Soon */}
                  <div className="flex flex-col items-start gap-2.5 p-3 rounded-lg opacity-50 cursor-not-allowed h-full border-2 border-transparent">
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-100">
                      <Wallet className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1 w-full min-h-[48px] flex flex-col justify-between">
                      <div>
                        <div className="text-sm font-bold mb-0.5 text-gray-400">
                          NBFC
                        </div>
                        <div className="text-xs text-gray-400 leading-snug">
                          Non-banking finance solutions
                        </div>
                      </div>
                      <div className="h-5 flex items-end">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-200 text-gray-600">
                          Coming Soon
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <span
                className="block text-sm font-medium text-gray-700 py-2 cursor-not-allowed"
                style={{ opacity: 0.5 }}
              >
                Use Cases
              </span>
              <Link
                href="/isv"
                className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ISV
              </Link>
              <Link
                href="/reseller"
                className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Reseller
              </Link>
              <Link
                href="/contact"
                className="block text-sm font-medium text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

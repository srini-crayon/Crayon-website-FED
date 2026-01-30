"use client"

import React, { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "../../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog"
import { Search, SlidersHorizontal, MoreVertical, Eye, Edit, CheckCircle, XCircle, Trash2, ExternalLink, MessageSquare, Users, User, Mail, Building2, Phone, Calendar, UserCircle, ChevronUp, ChevronDown } from "lucide-react"
import { AgentPreviewModal } from "../../components/agent-preview-modal"
import { EditAgentModal } from "../../components/edit-agent-modal"
import { RejectAgentModal } from "../../components/reject-agent-modal"
import { ISVDetailsModal } from "../../components/isv-details-modal"
import { RejectISVModal } from "../../components/reject-isv-modal"
import { ResellerDetailsModal } from "../../components/reseller-details-modal"
import { RejectResellerModal } from "../../components/reject-reseller-modal"
import { EditISVModal } from "../../components/edit-isv-modal"
import { EditResellerModal } from "../../components/edit-reseller-modal"
import { useToast } from "../../hooks/use-toast"
import { Toaster } from "../../components/ui/toaster"
import { adminService } from "../../lib/api/admin.service"
import { useAuthStore } from "../../lib/store/auth.store"
import type { AgentAPIResponse, ISVAPIResponse, ResellerAPIResponse } from "../../lib/types/admin.types"

type TabType = "agents" | "isvs" | "resellers" | "enquiries"

export default function AdminPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>("agents")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // API Data
  const [agents, setAgents] = useState<AgentAPIResponse[]>([])
  const [isvs, setISVs] = useState<ISVAPIResponse[]>([])
  const [resellers, setResellers] = useState<ResellerAPIResponse[]>([])
  const [enquiries, setEnquiries] = useState<any[]>([])

  // Enquiry filter states
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<"all" | "new" | "read">("all")
  const [enquiryUserTypeFilter, setEnquiryUserTypeFilter] = useState<string>("all")

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "approved" | "pending">("all")
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>("all")

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Multi-select States
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set())
  const [selectedISVs, setSelectedISVs] = useState<Set<string>>(new Set())
  const [selectedResellers, setSelectedResellers] = useState<Set<string>>(new Set())
  const [selectedEnquiries, setSelectedEnquiries] = useState<Set<string>>(new Set())

  // Mouse position for dotted pattern effect
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 })
  const [isHoveringHeader, setIsHoveringHeader] = useState(false)

  // Sorting States
  const [agentSortColumn, setAgentSortColumn] = useState<string | null>(null)
  const [agentSortDirection, setAgentSortDirection] = useState<"asc" | "desc">("asc")
  const [isvSortColumn, setISVSortColumn] = useState<string | null>(null)
  const [isvSortDirection, setISVSortDirection] = useState<"asc" | "desc">("asc")
  const [resellerSortColumn, setResellerSortColumn] = useState<string | null>(null)
  const [resellerSortDirection, setResellerSortDirection] = useState<"asc" | "desc">("asc")
  const [enquirySortColumn, setEnquirySortColumn] = useState<string | null>(null)
  const [enquirySortDirection, setEnquirySortDirection] = useState<"asc" | "desc">("asc")

  // Authentication and Role Check
  useEffect(() => {
    const checkAuthAndRole = () => {
      console.log('Auth check - isAuthenticated:', isAuthenticated)
      console.log('Auth check - user:', user)
      console.log('Auth check - user role:', user?.role)

      if (!isAuthenticated || !user) {
        console.log('User not authenticated, redirecting to login')
        // User is not authenticated, redirect to login
        router.push('/auth/login')
        return
      }

      if (user.role !== 'admin') {
        console.log('User is not admin, redirecting to home')
        // User is authenticated but not an admin, redirect to home
        toast({
          description: "Access denied. Admin privileges required.",
          variant: "destructive",
        })
        router.push('/')
        return
      }

      console.log('User is admin, allowing access')
      // User is authenticated and is an admin, allow access
      setIsCheckingAuth(false)
    }

    // Add a small delay to ensure Zustand store is hydrated from localStorage
    const timer = setTimeout(checkAuthAndRole, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router, toast])

  // Modal States
  const [selectedAgent, setSelectedAgent] = useState<AgentAPIResponse | null>(null)
  const [selectedISV, setSelectedISV] = useState<ISVAPIResponse | null>(null)
  const [selectedReseller, setSelectedReseller] = useState<ResellerAPIResponse | null>(null)

  // Drawer States
  const [agentDetailsOpen, setAgentDetailsOpen] = useState(false)
  const [isvModalOpen, setISVModalOpen] = useState(false)
  const [resellerModalOpen, setResellerModalOpen] = useState(false)

  // Modal States
  const [rejectAgentModalOpen, setRejectAgentModalOpen] = useState(false)
  const [rejectISVModalOpen, setRejectISVModalOpen] = useState(false)
  const [rejectResellerModalOpen, setRejectResellerModalOpen] = useState(false)
  const [editISVModalOpen, setEditISVModalOpen] = useState(false)
  const [editResellerModalOpen, setEditResellerModalOpen] = useState(false)
  const [editAgentModalOpen, setEditAgentModalOpen] = useState(false)

  // Message modal state for enquiries
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<{ name: string, message: string, email?: string } | null>(null)

  // Agent not approved modal state
  const [agentNotApprovedModalOpen, setAgentNotApprovedModalOpen] = useState(false)

  const handleShowMessage = (enquiry: any) => {
    setSelectedMessage({
      name: enquiry.full_name || 'Unknown',
      message: enquiry.message || 'No message provided',
      email: enquiry.email
    })
    setMessageModalOpen(true)
  }

  // State for tracking order updates
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null)

  const handleUpdateOrder = async (agentId: string, newOrder: string) => {
    const orderNum = parseInt(newOrder)
    if (isNaN(orderNum)) return

    setUpdatingOrder(agentId)
    try {
      await adminService.updateAgent(agentId, { agents_ordering: orderNum })

      // Optimistic update
      setAgents(prev => prev.map(a =>
        a.agent_id === agentId ? { ...a, agents_ordering: orderNum } : a
      ))

      toast({
        description: "Agent order updated",
        variant: "default",
        duration: 2000,
      })
    } catch (error) {
      console.error("Failed to update order:", error)
      toast({
        description: "Failed to update order",
        variant: "destructive",
      })
    } finally {
      setUpdatingOrder(null)
    }
  }

  // Prevent body scroll when any modal is open
  useEffect(() => {
    const isAnyModalOpen =
      agentDetailsOpen ||
      isvModalOpen ||
      resellerModalOpen ||
      rejectAgentModalOpen ||
      rejectISVModalOpen ||
      rejectResellerModalOpen ||
      editISVModalOpen ||
      editResellerModalOpen ||
      editAgentModalOpen ||
      messageModalOpen

    if (isAnyModalOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      const scrollX = window.scrollX

      // Lock body scroll
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = `-${scrollX}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'

      // Also lock html scroll
      document.documentElement.style.overflow = 'hidden'

      return () => {
        // Restore scroll position
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        window.scrollTo(scrollX, scrollY)
      }
    }
  }, [
    agentDetailsOpen,
    isvModalOpen,
    resellerModalOpen,
    rejectAgentModalOpen,
    rejectISVModalOpen,
    rejectResellerModalOpen,
    editISVModalOpen,
    editResellerModalOpen,
    editAgentModalOpen,
    messageModalOpen
  ])

  // Fetch functions
  const fetchAgents = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const apiAgents = await adminService.fetchAgents()
      setAgents(apiAgents)
    } catch (err: any) {
      console.error('Error fetching agents:', err)
      setError(err.message || 'Failed to fetch agents')
      if (showLoading) {
        toast({
          description: err.message || 'Failed to fetch agents',
          variant: "destructive",
        })
      }
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  const fetchISVs = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const apiISVs = await adminService.fetchISVs()
      setISVs(apiISVs)
    } catch (err: any) {
      console.error('Error fetching ISVs:', err)
      setError(err.message || 'Failed to fetch ISVs')
      if (showLoading) {
        toast({
          description: err.message || 'Failed to fetch ISVs',
          variant: "destructive",
        })
      }
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  const fetchResellers = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const apiResellers = await adminService.fetchResellers()
      setResellers(apiResellers)
    } catch (err: any) {
      console.error('Error fetching resellers:', err)
      setError(err.message || 'Failed to fetch resellers')
      if (showLoading) {
        toast({
          description: err.message || 'Failed to fetch resellers',
          variant: "destructive",
        })
      }
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  const fetchEnquiries = async (showLoading = true) => {
    if (showLoading) setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('https://agents-store.onrender.com/api/enquiries', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.enquiries) {
          setEnquiries(data.enquiries)
        }
      } else {
        throw new Error('Failed to fetch enquiries')
      }
    } catch (err: any) {
      console.error('Error fetching enquiries:', err)
      setError(err.message || 'Failed to fetch enquiries')
      if (showLoading) {
        toast({
          description: err.message || 'Failed to fetch enquiries',
          variant: "destructive",
        })
      }
    } finally {
      if (showLoading) setIsLoading(false)
    }
  }

  // Fetch all data on initial load (after auth check) - without loading state
  useEffect(() => {
    if (!isCheckingAuth) {
      // Fetch all data in parallel to show counts immediately (without showing loading state)
      Promise.all([
        fetchAgents(false),
        fetchISVs(false),
        fetchResellers(false),
        fetchEnquiries(false)
      ]).catch(err => {
        console.error('Error fetching initial data:', err)
      })
    }
  }, [isCheckingAuth])

  // Fetch data when tab changes (for refreshing) - with loading state
  useEffect(() => {
    if (!isCheckingAuth) {
      if (activeTab === "agents") {
        fetchAgents(true)
      } else if (activeTab === "isvs") {
        fetchISVs(true)
      } else if (activeTab === "resellers") {
        fetchResellers(true)
      } else if (activeTab === "enquiries") {
        fetchEnquiries(true)
      }
    }
  }, [activeTab, isCheckingAuth])

  // Mouse tracking for dotted pattern effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const headerElement = document.querySelector('[data-header-section]') as HTMLElement
      if (headerElement) {
        const rect = headerElement.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setMousePosition({ x, y })
      }
    }

    if (isHoveringHeader) {
      window.addEventListener('mousemove', handleMouseMove)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [isHoveringHeader])

  // Sort function helper
  const sortData = <T,>(data: T[], column: string | null, direction: "asc" | "desc", getValue: (item: T) => string | number) => {
    if (!column) return data

    const sorted = [...data].sort((a, b) => {
      const aVal = getValue(a)
      const bVal = getValue(b)

      if (typeof aVal === "string" && typeof bVal === "string") {
        return direction === "asc"
          ? aVal.localeCompare(bVal, undefined, { sensitivity: 'base' })
          : bVal.localeCompare(aVal, undefined, { sensitivity: 'base' })
      }

      return direction === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })

    return sorted
  }

  // Sort handlers
  const handleAgentSort = (column: string) => {
    if (agentSortColumn === column) {
      setAgentSortDirection(agentSortDirection === "asc" ? "desc" : "asc")
    } else {
      setAgentSortColumn(column)
      setAgentSortDirection("asc")
    }
  }

  const handleISVSort = (column: string) => {
    if (isvSortColumn === column) {
      setISVSortDirection(isvSortDirection === "asc" ? "desc" : "asc")
    } else {
      setISVSortColumn(column)
      setISVSortDirection("asc")
    }
  }

  const handleResellerSort = (column: string) => {
    if (resellerSortColumn === column) {
      setResellerSortDirection(resellerSortDirection === "asc" ? "desc" : "asc")
    } else {
      setResellerSortColumn(column)
      setResellerSortDirection("asc")
    }
  }

  const handleEnquirySort = (column: string) => {
    if (enquirySortColumn === column) {
      setEnquirySortDirection(enquirySortDirection === "asc" ? "desc" : "asc")
    } else {
      setEnquirySortColumn(column)
      setEnquirySortDirection("asc")
    }
  }

  // Helper to render sort icon - shows both chevrons, highlights active one
  const renderSortIcon = (currentColumn: string | null, sortColumn: string | null, sortDirection: "asc" | "desc") => {
    const isActive = currentColumn === sortColumn
    return (
      <div className="flex flex-col items-center gap-0" style={{ lineHeight: 1 }}>
        <ChevronUp
          className={`h-3 w-3 transition-all ${isActive && sortDirection === "asc"
            ? "text-gray-900"
            : "text-gray-400"
            }`}
          style={{ marginBottom: '-2px' }}
        />
        <ChevronDown
          className={`h-3 w-3 transition-all ${isActive && sortDirection === "desc"
            ? "text-gray-900"
            : "text-gray-400"
            }`}
          style={{ marginTop: '-2px' }}
        />
      </div>
    )
  }

  // Filter functions with useMemo
  const filteredAgents = useMemo(() => {
    let filtered = agents

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(agent =>
        agent.agent_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.asset_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.isv_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(agent =>
        statusFilter === "approved" ? agent.admin_approved === "yes" : agent.admin_approved === "no"
      )
    }

    // Asset type filter
    if (assetTypeFilter !== "all") {
      filtered = filtered.filter(agent => agent.asset_type === assetTypeFilter)
    }

    // Apply sorting
    if (agentSortColumn) {
      filtered = sortData(filtered, agentSortColumn, agentSortDirection, (agent) => {
        switch (agentSortColumn) {
          case "agent_name": return agent.agent_name || ""
          case "asset_type": return agent.asset_type || ""
          case "isv_id": return agent.isv_id || ""
          case "agents_ordering": return agent.agents_ordering ?? Number.MAX_SAFE_INTEGER
          default: return ""
        }
      })
    }

    return filtered
  }, [agents, searchTerm, statusFilter, assetTypeFilter, agentSortColumn, agentSortDirection])

  const filteredISVs = useMemo(() => {
    let filtered = isvs

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(isv =>
        isv.isv_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        isv.isv_email_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        isv.isv_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(isv =>
        statusFilter === "approved" ? isv.admin_approved === "yes" : isv.admin_approved === "no"
      )
    }

    // Apply sorting
    if (isvSortColumn) {
      filtered = sortData(filtered, isvSortColumn, isvSortDirection, (isv) => {
        switch (isvSortColumn) {
          case "isv_id": return isv.isv_id || ""
          case "isv_name": return isv.isv_name || ""
          case "isv_email_no": return isv.isv_email_no || ""
          case "isv_domain": return isv.isv_domain || ""
          case "agent_count": return isv.agent_count || 0
          default: return ""
        }
      })
    }

    return filtered
  }, [isvs, searchTerm, statusFilter, isvSortColumn, isvSortDirection])

  const filteredResellers = useMemo(() => {
    let filtered = resellers

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(reseller =>
        reseller.reseller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reseller.reseller_email_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reseller.reseller_id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(reseller =>
        statusFilter === "approved" ? reseller.admin_approved === "yes" : reseller.admin_approved === "no"
      )
    }

    // Apply sorting
    if (resellerSortColumn) {
      filtered = sortData(filtered, resellerSortColumn, resellerSortDirection, (reseller) => {
        switch (resellerSortColumn) {
          case "reseller_id": return reseller.reseller_id || ""
          case "reseller_name": return reseller.reseller_name || ""
          case "reseller_email_no": return reseller.reseller_email_no || ""
          case "whitelisted_domain": return reseller.whitelisted_domain || ""
          default: return ""
        }
      })
    }

    return filtered
  }, [resellers, searchTerm, statusFilter, resellerSortColumn, resellerSortDirection])

  const filteredEnquiries = useMemo(() => {
    let filtered = enquiries

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(enquiry =>
        enquiry.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.message?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (enquiryStatusFilter !== "all") {
      filtered = filtered.filter(enquiry =>
        enquiryStatusFilter === "new" ? enquiry.status === "new" : enquiry.status !== "new"
      )
    }

    // User type filter
    if (enquiryUserTypeFilter !== "all") {
      filtered = filtered.filter(enquiry => enquiry.user_type === enquiryUserTypeFilter)
    }

    // Apply sorting (default to created_at descending if no sort column selected)
    if (enquirySortColumn) {
      filtered = sortData(filtered, enquirySortColumn, enquirySortDirection, (enquiry) => {
        switch (enquirySortColumn) {
          case "full_name": return enquiry.full_name || ""
          case "company_name": return enquiry.company_name || ""
          case "email": return enquiry.email || ""
          case "phone": return enquiry.phone || ""
          case "user_type": return enquiry.user_type || ""
          case "created_at": return new Date(enquiry.created_at || 0).getTime()
          default: return ""
        }
      })
    } else {
      // Default sort by created_at descending (latest first)
      filtered = filtered.sort((a, b) => {
        const dateA = new Date(a.created_at || 0).getTime()
        const dateB = new Date(b.created_at || 0).getTime()
        return dateB - dateA // Descending order (newest first)
      })
    }

    return filtered
  }, [enquiries, searchTerm, enquiryStatusFilter, enquiryUserTypeFilter, enquirySortColumn, enquirySortDirection])

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, assetTypeFilter, enquiryStatusFilter, enquiryUserTypeFilter, activeTab])

  // Pagination calculations
  const getPaginatedData = (data: any[]) => {
    const totalPages = Math.ceil(data.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = data.slice(startIndex, endIndex)
    return { paginatedData, totalPages, startIndex, endIndex }
  }

  const agentsPagination = getPaginatedData(filteredAgents)
  const isvsPagination = getPaginatedData(filteredISVs)
  const resellersPagination = getPaginatedData(filteredResellers)
  const enquiriesPagination = getPaginatedData(filteredEnquiries)

  // Multi-select handlers
  const handleSelectAllAgents = (checked: boolean) => {
    if (checked) {
      setSelectedAgents(new Set(agentsPagination.paginatedData.map(a => a.agent_id)))
    } else {
      setSelectedAgents(new Set())
    }
  }

  const handleSelectAgent = (agentId: string, checked: boolean) => {
    const newSelected = new Set(selectedAgents)
    if (checked) {
      newSelected.add(agentId)
    } else {
      newSelected.delete(agentId)
    }
    setSelectedAgents(newSelected)
  }

  const handleSelectAllISVs = (checked: boolean) => {
    if (checked) {
      setSelectedISVs(new Set(isvsPagination.paginatedData.map(i => i.isv_id)))
    } else {
      setSelectedISVs(new Set())
    }
  }

  const handleSelectISV = (isvId: string, checked: boolean) => {
    const newSelected = new Set(selectedISVs)
    if (checked) {
      newSelected.add(isvId)
    } else {
      newSelected.delete(isvId)
    }
    setSelectedISVs(newSelected)
  }

  const handleSelectAllResellers = (checked: boolean) => {
    if (checked) {
      setSelectedResellers(new Set(resellersPagination.paginatedData.map(r => r.reseller_id)))
    } else {
      setSelectedResellers(new Set())
    }
  }

  const handleSelectReseller = (resellerId: string, checked: boolean) => {
    const newSelected = new Set(selectedResellers)
    if (checked) {
      newSelected.add(resellerId)
    } else {
      newSelected.delete(resellerId)
    }
    setSelectedResellers(newSelected)
  }

  const handleSelectAllEnquiries = (checked: boolean) => {
    if (checked) {
      setSelectedEnquiries(new Set(enquiriesPagination.paginatedData.map(e => e.enquiry_id)))
    } else {
      setSelectedEnquiries(new Set())
    }
  }

  const handleSelectEnquiry = (enquiryId: string, checked: boolean) => {
    const newSelected = new Set(selectedEnquiries)
    if (checked) {
      newSelected.add(enquiryId)
    } else {
      newSelected.delete(enquiryId)
    }
    setSelectedEnquiries(newSelected)
  }

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return formatDate(dateString)
  }

  // Action handlers
  const handleApproveAgent = async (agent: AgentAPIResponse) => {
    try {
      await adminService.updateAgent(agent.agent_id, { admin_approved: "yes" })
      setAgentDetailsOpen(false)
      await fetchAgents()
      toast({
        description: `${agent.agent_name} has been approved successfully.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve agent",
        variant: "destructive",
      })
    }
  }

  const handleRejectAgent = async (agent: AgentAPIResponse, reason: string) => {
    try {
      await adminService.updateAgent(agent.agent_id, { admin_approved: "no" })
      setRejectAgentModalOpen(false)
      setAgentDetailsOpen(false)
      await fetchAgents()
      toast({
        description: `${agent.agent_name} has been rejected.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject agent",
        variant: "destructive",
      })
    }
  }

  const handleApproveISV = async (isv: ISVAPIResponse) => {
    try {
      await adminService.updateISV(isv.isv_id, {
        isv_name: isv.isv_name,
        isv_email: isv.isv_email_no,
        admin_approved: "yes"
      })
      setISVModalOpen(false)
      await fetchISVs()
      toast({
        description: `${isv.isv_name} has been approved successfully.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve ISV",
        variant: "destructive",
      })
    }
  }

  const handleRejectISV = async (isv: ISVAPIResponse, reason: string) => {
    try {
      await adminService.updateISV(isv.isv_id, {
        isv_name: isv.isv_name,
        isv_email: isv.isv_email_no,
        admin_approved: "no"
      })
      setRejectISVModalOpen(false)
      setISVModalOpen(false)
      await fetchISVs()
      toast({
        description: `${isv.isv_name} has been rejected.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject ISV",
        variant: "destructive",
      })
    }
  }

  const handleApproveReseller = async (reseller: ResellerAPIResponse) => {
    try {
      await adminService.updateReseller(reseller.reseller_id, {
        reseller_name: reseller.reseller_name,
        reseller_email: reseller.reseller_email_no,
        admin_approved: "yes"
      })
      setResellerModalOpen(false)
      await fetchResellers()
      toast({
        description: `${reseller.reseller_name} has been approved successfully.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to approve reseller",
        variant: "destructive",
      })
    }
  }

  const handleRejectReseller = async (reseller: ResellerAPIResponse, reason: string) => {
    try {
      await adminService.updateReseller(reseller.reseller_id, {
        reseller_name: reseller.reseller_name,
        reseller_email: reseller.reseller_email_no,
        admin_approved: "no"
      })
      setRejectResellerModalOpen(false)
      setResellerModalOpen(false)
      await fetchResellers()
      toast({
        description: `${reseller.reseller_name} has been rejected.`,
      })
    } catch (err: any) {
      toast({
        description: err.message || "Failed to reject reseller",
        variant: "destructive",
      })
    }
  }

  const handleEditISV = () => {
    setISVModalOpen(false)
    setEditISVModalOpen(true)
  }

  const handleEditReseller = () => {
    setResellerModalOpen(false)
    setEditResellerModalOpen(true)
  }

  const handleEditSuccess = () => {
    if (activeTab === "isvs") {
      fetchISVs()
    } else if (activeTab === "resellers") {
      fetchResellers()
    }
  }

  // Get unique asset types for filter
  const getAssetTypes = () => {
    const types = [...new Set(agents.map(agent => agent.asset_type).filter(Boolean))]
    return types
  }

  const getStatusBadge = (approved: "yes" | "no") => {
    if (approved === "yes") {
      return (
        <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800 cursor-default" style={{
          boxShadow: '0 2px 4px rgba(34, 197, 94, 0.2)',
        }}>
          <CheckCircle className="h-3 w-3 mr-1" />
          Approved
        </span>
      )
    }
    return (
      <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 cursor-default badge-pulse" style={{
        boxShadow: '0 2px 4px rgba(234, 179, 8, 0.2)',
      }}>
        <XCircle className="h-3 w-3 mr-1" />
        Pending
      </span>
    )
  }

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'radial-gradient(100% 100% at 50% 0%, #FFFEDA 0%, #FFF 100%)',
          width: '100%'
        }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full min-h-screen bg-white"
      style={{
        animation: 'fadeIn 0.3s ease-in',
      }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .tab-indicator {
          position: absolute;
          bottom: -1px;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, #181818 0%, #000000 100%);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 2px 2px 0 0;
        }
        .table-row-hover {
          /* Removed hover effects for static table */
        }
        .badge-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;  /* Chrome, Safari and Opera */
        }
      `}} />
      {/* Header Section with Gradient */}
      <div
        data-header-section
        className="w-full px-8 md:px-12 lg:px-16 pt-12 md:pt-16 lg:pt-20 pb-0 relative group"
        style={{
          background: 'radial-gradient(100% 100% at 50% 0%, #FFFEDA 0%, #FFF 100%)',
          animation: 'fadeIn 0.4s ease-out',
        }}
        onMouseEnter={() => setIsHoveringHeader(true)}
        onMouseLeave={() => setIsHoveringHeader(false)}
      >
        {/* Dotted Gradient Background Pattern - Visible on Hover near Cursor */}
        <div
          aria-hidden="true"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"
          style={{
            position: 'absolute',
            inset: 0,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle 3px, rgba(180, 83, 9, 0.25) 1.5px, transparent 1.5px)`,
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0',
            backgroundRepeat: 'repeat',
            maskImage: `radial-gradient(circle 200px at ${mousePosition.x}% ${mousePosition.y}%, black 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.4) 40%, transparent 60%)`,
            WebkitMaskImage: `radial-gradient(circle 200px at ${mousePosition.x}% ${mousePosition.y}%, black 0%, rgba(0,0,0,0.8) 25%, rgba(0,0,0,0.4) 40%, transparent 60%)`,
            transition: 'mask-image 0.2s ease-out, -webkit-mask-image 0.2s ease-out, opacity 0.3s ease-in-out',
            willChange: 'mask-image',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Content wrapper with higher z-index */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div style={{ animation: 'slideInLeft 0.5s ease-out' }}>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-base text-gray-600">
                Manage agents, ISVs, and resellers
              </p>
            </div>
            <div style={{ animation: 'slideInRight 0.5s ease-out' }}>
              <Button
                className="bg-black text-white hover:bg-black/90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                onClick={() => {
                  router.push('/onboard')
                }}
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
              >
                ONBOARD AGENT
              </Button>
            </div>
          </div>

          {/* Tabs and Search/Filters Row */}
          <div className="mb-0 pb-0">
            <div className="border-b border-gray-200 relative bg-white" style={{ marginBottom: 0, paddingBottom: 0 }}>
              <div className="flex items-center justify-between gap-4" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                <nav className="-mb-px flex space-x-8 flex-1 relative">
                  {[
                    { id: "agents", label: "Agents", icon: MessageSquare, count: agents.length },
                    { id: "isvs", label: "ISVs", icon: Users, count: isvs.length },
                    { id: "resellers", label: "Resellers", icon: User, count: resellers.length },
                    { id: "enquiries", label: "Enquiries", icon: Mail, count: enquiries.length },
                  ].map((tab, index) => {
                    const Icon = tab.icon
                    const isActive = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`relative flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-all duration-300 mb-0 ${isActive
                          ? "border-gray-900 text-gray-900"
                          : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                          }`}
                        style={{
                          animation: `slideInLeft ${0.3 + index * 0.1}s ease-out`,
                        }}
                      >
                        <Icon className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                        {tab.label}
                        <span className={`text-xs font-normal transition-all duration-200 ${isActive ? 'opacity-100 font-semibold' : 'opacity-70'
                          }`}>
                          ({tab.count})
                        </span>
                        {isActive && (
                          <div
                            className="tab-indicator"
                            style={{
                              width: '100%',
                            }}
                          />
                        )}
                      </button>
                    )
                  })}
                </nav>

                {/* Search and Filters */}
                <div className="flex items-center gap-2 flex-shrink-0" style={{ animation: 'slideInRight 0.5s ease-out' }}>
                  <div className="relative w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 transition-colors duration-200" />
                    <Input
                      placeholder={`Search ${activeTab}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10 transition-all duration-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                      style={{
                        boxShadow: searchTerm ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none',
                      }}
                    />
                  </div>

                  <div className="flex gap-2">
                    {/* Status Filter */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="gap-2 h-9 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm"
                        >
                          <SlidersHorizontal className="h-4 w-4" />
                          Status: {statusFilter === "all" ? "All" : statusFilter === "approved" ? "Approved" : "Pending"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" side="bottom" sideOffset={8}>
                        <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("approved")}>Approved</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Asset Type Filter (only for agents) */}
                    {activeTab === "agents" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="gap-2 h-9">
                            Asset Type: {assetTypeFilter === "all" ? "All" : assetTypeFilter}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="bottom" sideOffset={8}>
                          <DropdownMenuItem onClick={() => setAssetTypeFilter("all")}>All</DropdownMenuItem>
                          {getAssetTypes().map((type) => (
                            <DropdownMenuItem key={type} onClick={() => setAssetTypeFilter(type)}>
                              {type}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {/* Enquiry Status Filter (only for enquiries) */}
                    {activeTab === "enquiries" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="gap-2 h-9">
                            Status: {enquiryStatusFilter === "all" ? "All" : enquiryStatusFilter === "new" ? "New" : "Read"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="bottom" sideOffset={8}>
                          <DropdownMenuItem onClick={() => setEnquiryStatusFilter("all")}>All</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEnquiryStatusFilter("new")}>New</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEnquiryStatusFilter("read")}>Read</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {/* Enquiry User Type Filter (only for enquiries) */}
                    {activeTab === "enquiries" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="gap-2 h-9">
                            User Type: {enquiryUserTypeFilter === "all" ? "All" : enquiryUserTypeFilter}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" side="bottom" sideOffset={8}>
                          <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("all")}>All</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("client")}>Client</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("isv")}>ISV</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("reseller")}>Reseller</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEnquiryUserTypeFilter("anonymous")}>Anonymous</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}

                    {/* Clear Filters - Only visible when filters are applied */}
                    {(searchTerm ||
                      statusFilter !== "all" ||
                      assetTypeFilter !== "all" ||
                      enquiryStatusFilter !== "all" ||
                      enquiryUserTypeFilter !== "all") && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTerm("")
                            setStatusFilter("all")
                            setAssetTypeFilter("all")
                            setEnquiryStatusFilter("all")
                            setEnquiryUserTypeFilter("all")
                          }}
                          className="h-9 transition-all duration-200 hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          style={{
                            animation: 'scaleIn 0.3s ease-out',
                          }}
                        >
                          Clear Filters
                        </Button>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section with White Background - Connected to Header */}
      <div className="w-full px-8 md:px-12 lg:px-16 pt-0 pb-6 bg-white" style={{ marginTop: '-1px' }}>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12" style={{ animation: 'fadeIn 0.3s ease-in' }}>
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-black mx-auto mb-4" style={{
                animation: 'spin 1s linear infinite',
              }}></div>
              <p className="text-gray-600 font-medium">Loading...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12" style={{ animation: 'scaleIn 0.3s ease-out' }}>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-red-600 mb-4 font-medium">{error}</p>
            <Button
              onClick={() => {
                if (activeTab === "agents") fetchAgents()
                else if (activeTab === "isvs") fetchISVs()
                else if (activeTab === "resellers") fetchResellers()
                else if (activeTab === "enquiries") fetchEnquiries()
              }}
              className="transition-all duration-200 hover:scale-105"
            >
              Retry
            </Button>
          </div>
        ) : (
          <React.Fragment>
            {/* Agents Table */}
            {activeTab === "agents" && (
              <div className="mt-0">
                <div className="overflow-x-hidden">
                  <Table className="border-collapse">
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="font-medium w-24 border-r border-gray-200 border-l-0">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedAgents.size === agentsPagination.paginatedData.length && agentsPagination.paginatedData.length > 0 && agentsPagination.paginatedData.every(a => selectedAgents.has(a.agent_id))}
                              onChange={(e) => handleSelectAllAgents(e.target.checked)}
                              className="rounded border-gray-300"
                              style={{
                                accentColor: '#E5E7EB',
                                borderColor: '#E5E7EB',
                                color: '#E5E7EB'
                              }}
                            />
                            <span>S. No</span>
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[250px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleAgentSort("agent_name")}
                        >
                          <div className="flex items-center gap-2">
                            Agent Name
                            {renderSortIcon("agent_name", agentSortColumn, agentSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[150px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleAgentSort("asset_type")}
                        >
                          <div className="flex items-center gap-2">
                            Asset Type
                            {renderSortIcon("asset_type", agentSortColumn, agentSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[150px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleAgentSort("isv_id")}
                        >
                          <div className="flex items-center gap-2">
                            ISV ID
                            {renderSortIcon("isv_id", agentSortColumn, agentSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[100px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleAgentSort("agents_ordering")}
                        >
                          <div className="flex items-center gap-2">
                            Order
                            {renderSortIcon("agents_ordering", agentSortColumn, agentSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead className="font-medium min-w-[140px] border-r-0">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentsPagination.paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500 border-r border-gray-200 border-l-0 border-r-0">
                            No agents found
                          </TableCell>
                        </TableRow>
                      ) : (
                        agentsPagination.paginatedData.map((agent, idx) => (
                          <TableRow
                            key={agent.agent_id}
                            className="border-b border-gray-200"
                          >
                            <TableCell className="w-24 border-r border-gray-200 border-l-0">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={selectedAgents.has(agent.agent_id)}
                                  onChange={(e) => handleSelectAgent(agent.agent_id, e.target.checked)}
                                  className="rounded border-gray-300"
                                  style={{
                                    accentColor: '#E5E7EB',
                                    borderColor: '#E5E7EB',
                                    color: '#E5E7EB'
                                  }}
                                />
                                <span className="text-sm">{agentsPagination.startIndex + idx + 1}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium min-w-[250px] text-sm text-gray-900 border-r border-gray-200">{agent.agent_name}</TableCell>
                            <TableCell className="min-w-[150px] text-sm text-gray-900 border-r border-gray-200">{agent.asset_type || "-"}</TableCell>
                            <TableCell className="min-w-[150px] text-sm text-gray-900 border-r border-gray-200">{agent.isv_id}</TableCell>
                            <TableCell className="min-w-[100px] text-sm text-gray-900 border-r border-gray-200">
                              <div className="flex items-center justify-center">
                                {updatingOrder === agent.agent_id ? (
                                  <div className="h-8 w-16 flex items-center justify-center">
                                    <span className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></span>
                                  </div>
                                ) : (
                                  <Input
                                    type="number"
                                    className="h-8 w-20 text-center px-1"
                                    defaultValue={agent.agents_ordering?.toString() || ""}
                                    onBlur={(e) => {
                                      const val = e.target.value
                                      if (val !== agent.agents_ordering?.toString()) {
                                        handleUpdateOrder(agent.agent_id, val)
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.currentTarget.blur()
                                      }
                                    }}
                                  />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="min-w-[140px] border-r-0">
                              <div className="flex items-center justify-between gap-2 relative">
                                {getStatusBadge(agent.admin_approved)}
                                <div className="relative">
                                  <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                      <button className="text-gray-400">
                                        <MoreVertical className="h-4 w-4" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      side="bottom"
                                      sideOffset={4}
                                      alignOffset={0}
                                      collisionPadding={8}
                                      onOpenAutoFocus={(e: Event) => e.preventDefault()}
                                      onCloseAutoFocus={(e: Event) => e.preventDefault()}
                                      style={{ maxHeight: '200px', position: 'absolute', top: '100%', right: 0, marginTop: '4px' }}
                                    >
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          if (agent.admin_approved === "yes") {
                                            router.push(`/agents/${agent.agent_id}`)
                                          } else {
                                            setSelectedAgent(agent)
                                            setAgentNotApprovedModalOpen(true)
                                          }
                                        }}
                                        className="text-black focus:bg-black focus:text-white"
                                      >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          setSelectedAgent(agent)
                                          setEditAgentModalOpen(true)
                                        }}
                                        className="text-black focus:bg-black focus:text-white"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          handleApproveAgent(agent)
                                        }}
                                        className="text-black focus:bg-black focus:text-white"
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          setSelectedAgent(agent)
                                          setRejectAgentModalOpen(true)
                                        }}
                                        className="text-black focus:bg-black focus:text-white"
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                {agentsPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 px-2">
                    <div className="text-sm text-gray-600">
                      Showing {agentsPagination.startIndex + 1} to {Math.min(agentsPagination.endIndex, filteredAgents.length)} of {filteredAgents.length} results
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="transition-all duration-200 hover:scale-105 disabled:opacity-50"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: agentsPagination.totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === agentsPagination.totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-[40px] transition-all duration-200 hover:scale-110 ${currentPage === page ? 'shadow-md' : ''
                                  }`}
                              >
                                {page}
                              </Button>
                            )
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2 text-gray-400">...</span>
                          }
                          return null
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(agentsPagination.totalPages, prev + 1))}
                        disabled={currentPage === agentsPagination.totalPages}
                        className="transition-all duration-200 hover:scale-105 disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ISVs Table */}
            {activeTab === "isvs" && (
              <div className="mt-0">
                <div className="overflow-x-hidden">
                  <Table className="border-collapse">
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="w-12 border-r border-gray-200 border-l-0">
                          <input
                            type="checkbox"
                            checked={selectedISVs.size === isvsPagination.paginatedData.length && isvsPagination.paginatedData.length > 0 && isvsPagination.paginatedData.every(i => selectedISVs.has(i.isv_id))}
                            onChange={(e) => handleSelectAllISVs(e.target.checked)}
                            className="rounded border-gray-300"
                            style={{
                              accentColor: '#E5E7EB',
                              borderColor: '#E5E7EB',
                              color: '#E5E7EB'
                            }}
                          />
                        </TableHead>
                        <TableHead className="font-medium w-16 border-r border-gray-200">S. No</TableHead>
                        <TableHead
                          className="font-medium min-w-[120px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleISVSort("isv_id")}
                        >
                          <div className="flex items-center gap-2">
                            ISV ID
                            {renderSortIcon("isv_id", isvSortColumn, isvSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[200px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleISVSort("isv_name")}
                        >
                          <div className="flex items-center gap-2">
                            ISV Name
                            {renderSortIcon("isv_name", isvSortColumn, isvSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[180px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleISVSort("isv_email_no")}
                        >
                          <div className="flex items-center gap-2">
                            Email
                            {renderSortIcon("isv_email_no", isvSortColumn, isvSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[100px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleISVSort("agent_count")}
                        >
                          <div className="flex items-center gap-2">
                            Agents
                            {renderSortIcon("agent_count", isvSortColumn, isvSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[150px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleISVSort("isv_domain")}
                        >
                          <div className="flex items-center gap-2">
                            Domain
                            {renderSortIcon("isv_domain", isvSortColumn, isvSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead className="font-medium w-32 border-r-0">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isvsPagination.paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500 border-r border-gray-200 border-l-0 border-r-0">
                            No ISVs found
                          </TableCell>
                        </TableRow>
                      ) : (
                        isvsPagination.paginatedData.map((isv, idx) => (
                          <TableRow
                            key={isv.isv_id}
                            className="border-b border-gray-200"
                          >
                            <TableCell className="border-r border-gray-200 border-l-0">
                              <input
                                type="checkbox"
                                checked={selectedISVs.has(isv.isv_id)}
                                onChange={(e) => handleSelectISV(isv.isv_id, e.target.checked)}
                                className="rounded border-gray-300"
                                style={{
                                  accentColor: '#E5E7EB',
                                  borderColor: '#E5E7EB',
                                  color: '#E5E7EB'
                                }}
                              />
                            </TableCell>
                            <TableCell className="w-16 border-r border-gray-200">{isvsPagination.startIndex + idx + 1}</TableCell>
                            <TableCell className="min-w-[120px] text-sm text-gray-900 border-r border-gray-200">{isv.isv_id}</TableCell>
                            <TableCell className="font-medium min-w-[200px] text-sm text-gray-900 border-r border-gray-200">{isv.isv_name}</TableCell>
                            <TableCell className="min-w-[180px] text-sm text-gray-900 border-r border-gray-200">{isv.isv_email_no}</TableCell>
                            <TableCell className="min-w-[100px] text-sm text-gray-900 border-r border-gray-200">
                              <span className="font-medium">{isv.approved_agent_count}</span>
                              <span className="text-gray-500">/{isv.agent_count}</span>
                            </TableCell>
                            <TableCell className="min-w-[150px] text-sm text-gray-900 border-r border-gray-200">{isv.isv_domain}</TableCell>
                            <TableCell className="w-32 border-r-0">
                              <div className="flex items-center justify-between gap-2 relative">
                                {getStatusBadge(isv.admin_approved)}
                                <div className="relative">
                                  <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                      <button className="text-gray-400">
                                        <MoreVertical className="h-4 w-4" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      side="bottom"
                                      sideOffset={4}
                                      alignOffset={0}
                                      collisionPadding={8}
                                      onOpenAutoFocus={(e: Event) => e.preventDefault()}
                                      onCloseAutoFocus={(e: Event) => e.preventDefault()}
                                      style={{ maxHeight: '200px', position: 'absolute', top: '100%', right: 0, marginTop: '4px' }}
                                    >
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          setSelectedISV(isv)
                                          setISVModalOpen(true)
                                        }}
                                        className="text-black focus:bg-black focus:text-white transition-colors duration-150"
                                      >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          setSelectedISV(isv)
                                          handleEditISV()
                                        }}
                                        className="text-black focus:bg-black focus:text-white"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          handleApproveISV(isv)
                                        }}
                                        className="text-black focus:bg-black focus:text-white"
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          setSelectedISV(isv)
                                          setRejectISVModalOpen(true)
                                        }}
                                        className="text-black focus:bg-black focus:text-white"
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                {isvsPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 px-2">
                    <div className="text-sm text-gray-600">
                      Showing {isvsPagination.startIndex + 1} to {Math.min(isvsPagination.endIndex, filteredISVs.length)} of {filteredISVs.length} results
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="transition-all duration-200 hover:scale-105 disabled:opacity-50"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: isvsPagination.totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === isvsPagination.totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-[40px] transition-all duration-200 hover:scale-110 ${currentPage === page ? 'shadow-md' : ''
                                  }`}
                              >
                                {page}
                              </Button>
                            )
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2 text-gray-400">...</span>
                          }
                          return null
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(isvsPagination.totalPages, prev + 1))}
                        disabled={currentPage === isvsPagination.totalPages}
                        className="transition-all duration-200 hover:scale-105 disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Resellers Table */}
            {activeTab === "resellers" && (
              <div className="mt-0">
                <div className="overflow-x-hidden">
                  <Table className="border-collapse">
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="w-12 border-r border-gray-200 border-l-0">
                          <input
                            type="checkbox"
                            checked={selectedResellers.size === resellersPagination.paginatedData.length && resellersPagination.paginatedData.length > 0 && resellersPagination.paginatedData.every(r => selectedResellers.has(r.reseller_id))}
                            onChange={(e) => handleSelectAllResellers(e.target.checked)}
                            className="rounded border-gray-300"
                            style={{
                              accentColor: '#E5E7EB',
                              borderColor: '#E5E7EB',
                              color: '#E5E7EB'
                            }}
                          />
                        </TableHead>
                        <TableHead className="font-medium w-16 border-r border-gray-200">S. No</TableHead>
                        <TableHead
                          className="font-medium min-w-[120px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleResellerSort("reseller_id")}
                        >
                          <div className="flex items-center gap-2">
                            Reseller ID
                            {renderSortIcon("reseller_id", resellerSortColumn, resellerSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[200px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleResellerSort("reseller_name")}
                        >
                          <div className="flex items-center gap-2">
                            Reseller Name
                            {renderSortIcon("reseller_name", resellerSortColumn, resellerSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[180px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleResellerSort("reseller_email_no")}
                        >
                          <div className="flex items-center gap-2">
                            Email
                            {renderSortIcon("reseller_email_no", resellerSortColumn, resellerSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[180px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleResellerSort("whitelisted_domain")}
                        >
                          <div className="flex items-center gap-2">
                            Whitelisted Domain
                            {renderSortIcon("whitelisted_domain", resellerSortColumn, resellerSortDirection)}
                          </div>
                        </TableHead>
                        <TableHead className="font-medium w-32 border-r border-gray-200">Status</TableHead>
                        <TableHead className="w-12 text-right border-r-0">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resellersPagination.paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500 border-r border-gray-200 border-l-0 border-r-0">
                            No resellers found
                          </TableCell>
                        </TableRow>
                      ) : (
                        resellersPagination.paginatedData.map((reseller, idx) => (
                          <TableRow
                            key={reseller.reseller_id}
                            className="border-b border-gray-200"
                          >
                            <TableCell className="border-r border-gray-200 border-l-0">
                              <input
                                type="checkbox"
                                checked={selectedResellers.has(reseller.reseller_id)}
                                onChange={(e) => handleSelectReseller(reseller.reseller_id, e.target.checked)}
                                className="rounded border-gray-300"
                                style={{
                                  accentColor: '#E5E7EB',
                                  borderColor: '#E5E7EB',
                                  color: '#E5E7EB'
                                }}
                              />
                            </TableCell>
                            <TableCell className="w-16 border-r border-gray-200">{resellersPagination.startIndex + idx + 1}</TableCell>
                            <TableCell className="min-w-[120px] text-sm text-gray-900 border-r border-gray-200">{reseller.reseller_id}</TableCell>
                            <TableCell className="font-medium min-w-[200px] text-sm text-gray-900 border-r border-gray-200">{reseller.reseller_name}</TableCell>
                            <TableCell className="min-w-[180px] text-sm text-gray-900 border-r border-gray-200">{reseller.reseller_email_no}</TableCell>
                            <TableCell className="min-w-[180px] text-sm text-gray-900 border-r border-gray-200">{reseller.whitelisted_domain}</TableCell>
                            <TableCell className="w-32 border-r-0">
                              <div className="flex items-center justify-between gap-2 relative">
                                {getStatusBadge(reseller.admin_approved)}
                                <div className="relative">
                                  <DropdownMenu modal={false}>
                                    <DropdownMenuTrigger asChild>
                                      <button className="text-gray-400">
                                        <MoreVertical className="h-4 w-4" />
                                      </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      side="bottom"
                                      sideOffset={4}
                                      alignOffset={0}
                                      collisionPadding={8}
                                      onOpenAutoFocus={(e: Event) => e.preventDefault()}
                                      onCloseAutoFocus={(e: Event) => e.preventDefault()}
                                      style={{ maxHeight: '200px', position: 'absolute', top: '100%', right: 0, marginTop: '4px' }}
                                    >
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          setSelectedReseller(reseller)
                                          setResellerModalOpen(true)
                                        }}
                                        className="text-black focus:bg-black focus:text-white transition-colors duration-150"
                                      >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          setSelectedReseller(reseller)
                                          handleEditReseller()
                                        }}
                                        className="text-black focus:bg-black focus:text-white"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          handleApproveReseller(reseller)
                                        }}
                                        className="text-black focus:bg-black focus:text-white"
                                      >
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={(e: React.MouseEvent) => {
                                          e.preventDefault()
                                          setSelectedReseller(reseller)
                                          setRejectResellerModalOpen(true)
                                        }}
                                        className="text-black focus:bg-black focus:text-white"
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                {resellersPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 px-2">
                    <div className="text-sm text-gray-600">
                      Showing {resellersPagination.startIndex + 1} to {Math.min(resellersPagination.endIndex, filteredResellers.length)} of {filteredResellers.length} results
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="transition-all duration-200 hover:scale-105 disabled:opacity-50"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: resellersPagination.totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === resellersPagination.totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-[40px] transition-all duration-200 hover:scale-110 ${currentPage === page ? 'shadow-md' : ''
                                  }`}
                              >
                                {page}
                              </Button>
                            )
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2 text-gray-400">...</span>
                          }
                          return null
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(resellersPagination.totalPages, prev + 1))}
                        disabled={currentPage === resellersPagination.totalPages}
                        className="transition-all duration-200 hover:scale-105 disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enquiries Table */}
            {activeTab === "enquiries" && (
              <div className="mt-0">
                <div className="overflow-x-hidden">
                  <Table className="border-collapse">
                    <TableHeader>
                      <TableRow className="border-b border-gray-200">
                        <TableHead className="w-12 border-r border-gray-200 border-l-0">
                          <input
                            type="checkbox"
                            checked={selectedEnquiries.size === enquiriesPagination.paginatedData.length && enquiriesPagination.paginatedData.length > 0 && enquiriesPagination.paginatedData.every(e => selectedEnquiries.has(e.enquiry_id))}
                            onChange={(e) => handleSelectAllEnquiries(e.target.checked)}
                            className="rounded border-gray-300"
                            style={{
                              accentColor: '#E5E7EB',
                              borderColor: '#E5E7EB',
                              color: '#E5E7EB'
                            }}
                          />
                        </TableHead>
                        <TableHead className="font-medium w-16 border-r border-gray-200">S. No</TableHead>
                        <TableHead
                          className="font-medium min-w-[150px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleEnquirySort("full_name")}
                        >
                          <div className="flex items-center gap-2">
                            Name
                            {renderSortIcon("full_name", enquirySortColumn, enquirySortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[150px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleEnquirySort("company_name")}
                        >
                          <div className="flex items-center gap-2">
                            Company
                            {renderSortIcon("company_name", enquirySortColumn, enquirySortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[180px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleEnquirySort("email")}
                        >
                          <div className="flex items-center gap-2">
                            Email
                            {renderSortIcon("email", enquirySortColumn, enquirySortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[120px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleEnquirySort("phone")}
                        >
                          <div className="flex items-center gap-2">
                            Phone
                            {renderSortIcon("phone", enquirySortColumn, enquirySortDirection)}
                          </div>
                        </TableHead>
                        <TableHead
                          className="font-medium min-w-[100px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleEnquirySort("user_type")}
                        >
                          <div className="flex items-center gap-2">
                            User Type
                            {renderSortIcon("user_type", enquirySortColumn, enquirySortDirection)}
                          </div>
                        </TableHead>
                        <TableHead className="font-medium w-32 border-r border-gray-200">Status</TableHead>
                        <TableHead
                          className="font-medium min-w-[120px] border-r border-gray-200 cursor-pointer"
                          onClick={() => handleEnquirySort("created_at")}
                        >
                          <div className="flex items-center gap-2">
                            Date
                            {renderSortIcon("created_at", enquirySortColumn, enquirySortDirection)}
                          </div>
                        </TableHead>
                        <TableHead className="font-medium min-w-[200px] border-r-0">Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enquiriesPagination.paginatedData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={10} className="text-center py-8 text-gray-500 border-r border-gray-200 border-l-0 border-r-0">
                            No enquiries found
                          </TableCell>
                        </TableRow>
                      ) : (
                        enquiriesPagination.paginatedData.map((enquiry, idx) => {
                          return (
                            <TableRow
                              key={enquiry.enquiry_id}
                              className="border-b border-gray-200 cursor-pointer"
                              onClick={() => handleShowMessage(enquiry)}
                            >
                              <TableCell onClick={(e) => e.stopPropagation()} className="border-r border-gray-200 border-l-0">
                                <input
                                  type="checkbox"
                                  checked={selectedEnquiries.has(enquiry.enquiry_id)}
                                  onChange={(e) => handleSelectEnquiry(enquiry.enquiry_id, e.target.checked)}
                                  className="rounded border-gray-300"
                                  style={{
                                    accentColor: '#E5E7EB',
                                    borderColor: '#E5E7EB',
                                    color: '#E5E7EB'
                                  }}
                                />
                              </TableCell>
                              <TableCell className="w-16 border-r border-gray-200">{enquiriesPagination.startIndex + idx + 1}</TableCell>
                              <TableCell className="font-medium min-w-[150px] text-sm text-gray-900 border-r border-gray-200">
                                {enquiry.full_name || 'Unknown'}
                              </TableCell>
                              <TableCell className="min-w-[150px] text-sm text-gray-900 border-r border-gray-200">
                                {enquiry.company_name || '-'}
                              </TableCell>
                              <TableCell className="min-w-[180px] text-sm text-gray-900 border-r border-gray-200">
                                {enquiry.email || '-'}
                              </TableCell>
                              <TableCell className="min-w-[120px] text-sm text-gray-900 border-r border-gray-200">
                                {enquiry.phone || '-'}
                              </TableCell>
                              <TableCell className="min-w-[100px] text-sm text-gray-900 border-r border-gray-200">
                                {enquiry.user_type && enquiry.user_type !== 'anonymous' ? (
                                  enquiry.user_type.toUpperCase()
                                ) : (
                                  'Anonymous'
                                )}
                              </TableCell>
                              <TableCell className="w-32 border-r border-gray-200">
                                {enquiry.status === 'new' ? (
                                  <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 cursor-default badge-pulse" style={{
                                    boxShadow: '0 2px 4px rgba(234, 179, 8, 0.2)',
                                  }}>
                                    New
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium bg-green-100 text-green-800 cursor-default" style={{
                                    boxShadow: '0 2px 4px rgba(34, 197, 94, 0.2)',
                                  }}>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Read
                                  </span>
                                )}
                              </TableCell>
                              <TableCell className="min-w-[120px] text-sm text-gray-900 border-r border-gray-200">
                                {getRelativeTime(enquiry.created_at)}
                              </TableCell>
                              <TableCell className="min-w-[200px] text-sm text-gray-900 border-r-0" onClick={(e) => e.stopPropagation()}>
                                {enquiry.message ? (
                                  enquiry.message.length > 100 ? (
                                    <>
                                      {enquiry.message.substring(0, 100)}...
                                      <button
                                        onClick={() => handleShowMessage(enquiry)}
                                        className="text-blue-600 text-sm ml-1"
                                      >
                                        more
                                      </button>
                                    </>
                                  ) : (
                                    enquiry.message
                                  )
                                ) : (
                                  'No message provided'
                                )}
                              </TableCell>
                            </TableRow>
                          )
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
                {/* Pagination */}
                {enquiriesPagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-8 px-2">
                    <div className="text-sm text-gray-600">
                      Showing {enquiriesPagination.startIndex + 1} to {Math.min(enquiriesPagination.endIndex, filteredEnquiries.length)} of {filteredEnquiries.length} results
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="transition-all duration-200 hover:scale-105 disabled:opacity-50"
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: enquiriesPagination.totalPages }, (_, i) => i + 1).map((page) => {
                          if (
                            page === 1 ||
                            page === enquiriesPagination.totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className={`min-w-[40px] transition-all duration-200 hover:scale-110 ${currentPage === page ? 'shadow-md' : ''
                                  }`}
                              >
                                {page}
                              </Button>
                            )
                          } else if (page === currentPage - 2 || page === currentPage + 2) {
                            return <span key={page} className="px-2 text-gray-400">...</span>
                          }
                          return null
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(enquiriesPagination.totalPages, prev + 1))}
                        disabled={currentPage === enquiriesPagination.totalPages}
                        className="transition-all duration-200 hover:scale-105 disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        )}
      </div>

      {/* Modals and Drawers */}
      {selectedAgent && (
        <>
          <AgentPreviewModal
            agent={selectedAgent}
            open={agentDetailsOpen}
            onOpenChange={setAgentDetailsOpen}
            onApprove={handleApproveAgent}
            onReject={() => setRejectAgentModalOpen(true)}
          />
          <EditAgentModal
            agent={selectedAgent}
            open={editAgentModalOpen}
            onOpenChange={setEditAgentModalOpen}
            onSave={() => {
              // Refresh agent list after successful save
              fetchAgents()
              setEditAgentModalOpen(false)
            }}
          />
          <RejectAgentModal
            agent={selectedAgent}
            open={rejectAgentModalOpen}
            onOpenChange={setRejectAgentModalOpen}
            onReject={handleRejectAgent}
          />
        </>
      )}

      {selectedISV && (
        <>
          <ISVDetailsModal
            isv={selectedISV}
            open={isvModalOpen}
            onOpenChange={setISVModalOpen}
            onApprove={handleApproveISV}
            onReject={() => setRejectISVModalOpen(true)}
            onEdit={handleEditISV}
          />
          <RejectISVModal
            isv={selectedISV}
            open={rejectISVModalOpen}
            onOpenChange={setRejectISVModalOpen}
            onReject={handleRejectISV}
          />
          <EditISVModal
            isv={selectedISV}
            open={editISVModalOpen}
            onOpenChange={setEditISVModalOpen}
            onSuccess={handleEditSuccess}
          />
        </>
      )}

      {selectedReseller && (
        <>
          <ResellerDetailsModal
            reseller={selectedReseller}
            open={resellerModalOpen}
            onOpenChange={setResellerModalOpen}
            onApprove={handleApproveReseller}
            onReject={() => setRejectResellerModalOpen(true)}
            onEdit={handleEditReseller}
          />
          <RejectResellerModal
            reseller={selectedReseller}
            open={rejectResellerModalOpen}
            onOpenChange={setRejectResellerModalOpen}
            onReject={handleRejectReseller}
          />
          <EditResellerModal
            reseller={selectedReseller}
            open={editResellerModalOpen}
            onOpenChange={setEditResellerModalOpen}
            onSuccess={handleEditSuccess}
          />
        </>
      )}

      {/* Agent Not Approved Modal */}
      <Dialog open={agentNotApprovedModalOpen} onOpenChange={setAgentNotApprovedModalOpen}>
        <DialogContent
          disableCentering={true}
          showCloseButton={false}
          style={{
            position: 'fixed',
            top: '30%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            margin: 0,
            width: 'min(90vw, 500px)',
            height: 'auto',
            minHeight: '400px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            zIndex: 10000,
          }}
        >
          <div className="flex flex-col items-center justify-center text-center space-y-6 w-full">
            {/* Logo/Icon */}
            <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
              <XCircle className="h-16 w-16 text-yellow-600" />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Agent Not Approved
              </h2>
              <p className="text-gray-600 text-lg">
                This agent is yet to be approved by admin
              </p>
            </div>

            {/* Agent Name */}
            {selectedAgent && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg w-full">
                <p className="text-sm text-gray-500">Agent Name</p>
                <p className="text-base font-semibold text-gray-900">{selectedAgent.agent_name}</p>
              </div>
            )}

            {/* Close Button */}
            <Button
              onClick={() => setAgentNotApprovedModalOpen(false)}
              className="mt-6 bg-black text-white hover:bg-black/90 w-full sm:w-auto px-8"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Message Modal for Enquiries */}
      <Dialog open={messageModalOpen} onOpenChange={setMessageModalOpen}>
        <DialogContent
          className="max-w-2xl"
          style={{
            position: 'fixed',
            top: '45%',
            left: '65%',
            transform: 'translate(-50%, -50%)',
            margin: 0,
            maxHeight: '90vh',
            overflow: 'auto'
          }}
        >
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
            {selectedMessage?.email && (
              <DialogDescription>
                {selectedMessage.email}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-gray-50 border rounded-lg p-4 md:p-6 max-h-[60vh] overflow-y-auto">
              <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selectedMessage?.message || 'No message provided'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
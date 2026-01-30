"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { useAuthStore } from "../../lib/store/auth.store"
import { useToast } from "../../hooks/use-toast"
import ChatDialog from "../../components/chat-dialog"
import { AgentPreviewModal } from "../../components/agent-preview-modal"
import { EditAgentModal } from "../../components/edit-agent-modal"
import { Search, MoreVertical, Eye, Edit, ChevronUp, ChevronDown } from "lucide-react"
import { getAuthHeaders } from "../../lib/api/config"

type Agent = {
  agent_id: string
  admin_approved: string
  isv_id: string
  asset_type?: string
  by_persona?: string
  by_value?: string
  agent_name: string
  demo_link?: string
  description?: string
  tags?: string
  demo_preview?: string
  updated_at?: string
}

type ApiResponse = {
  isv: {
    isv_id: string
    isv_name: string
    isv_address?: string
    isv_email_no?: string
    admin_approved?: string
  }
  agents: Agent[]
  statistics: {
    total_agents: number
    approved_agents: number
    total_capabilities: number
    isv_approved: boolean
  }
}

const statusStyle: Record<string, string> = {
  Approved: "bg-green-100 text-black",
  Pending: "bg-yellow-100 text-black",
  Rejected: "bg-red-100 text-black",
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ApiResponse | null>(null)
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "rejected">("all")
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Sorting state
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Debug log when chatOpen changes
  useEffect(() => {
    console.log('Dashboard - chatOpen state changed:', chatOpen)
  }, [chatOpen])

  // Authentication and role check
  useEffect(() => {
    const checkAuthAndRole = () => {
      if (!isAuthenticated || !user) {
        router.push('/auth/login')
        return
      }

      if (user.role === 'admin') {
        router.push('/admin')
        return
      }

      // Allow ISV and reseller users to access dashboard
      if (user.role === 'isv' || user.role === 'reseller') {
        setIsCheckingAuth(false)
        return
      }

      // Block other roles (like client)
      toast({
        description: "Dashboard is not available for your account type.",
        variant: "destructive",
      })
      router.push('/')
    }

    // Add a small delay to ensure Zustand store is hydrated from localStorage
    // This prevents redirect to login on page refresh when user is actually authenticated
    const timer = setTimeout(checkAuthAndRole, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user, router, toast])

  // Get ISV ID from user
  const isvId = user?.user_id || null

  useEffect(() => {
    if (isCheckingAuth || !isvId) return

    let abort = false
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Get token from auth store
        const token = useAuthStore.getState().token
        const headers = getAuthHeaders(token, {
          'Content-Type': 'application/json',
        })

        const res = await fetch(`https://agents-store.onrender.com/api/isv/profile/${isvId}`, {
          cache: "no-store",
          headers,
        })
        if (!res.ok) throw new Error(`Failed to load ISV profile: ${res.status}`)
        const json: ApiResponse = await res.json()
        if (!abort) setData(json)
      } catch (e: any) {
        if (!abort) setError(e?.message || "Something went wrong")
      } finally {
        if (!abort) setLoading(false)
      }
    }
    fetchData()
    return () => {
      abort = true
    }
  }, [isCheckingAuth, isvId])

  function toStatus(s: string): "Approved" | "Pending" | "Rejected" {
    const v = (s || "").toLowerCase()
    if (v === "yes" || v === "approved") return "Approved"
    if (v === "pending") return "Pending"
    if (v === "no" || v === "rejected" || v === "reject") return "Rejected"
    return "Rejected"
  }

  const agents = data?.agents || []
  const counts = useMemo(() => {
    const c = { all: agents.length, approved: 0, pending: 0, rejected: 0 }
    for (const a of agents) {
      const s = toStatus(a.admin_approved)
      if (s === "Approved") c.approved++
      else if (s === "Pending") c.pending++
      else c.rejected++
    }
    return c
  }, [agents])

  const filteredAgents = useMemo(() => {
    let filtered = agents

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter((a) => {
        const s = toStatus(a.admin_approved)
        return (
          (filter === "approved" && s === "Approved") ||
          (filter === "pending" && s === "Pending") ||
          (filter === "rejected" && s === "Rejected")
        )
      })
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((a) =>
        a.agent_name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: string = ""
        let bVal: string = ""

        switch (sortColumn) {
          case "agent_name":
            aVal = a.agent_name || ""
            bVal = b.agent_name || ""
            break
          case "asset_type":
            aVal = a.asset_type || ""
            bVal = b.asset_type || ""
            break
          case "isv_id":
            aVal = a.isv_id || ""
            bVal = b.isv_id || ""
            break
          default:
            return 0
        }

        const comparison = aVal.localeCompare(bVal, undefined, { sensitivity: 'base' })
        return sortDirection === "asc" ? comparison : -comparison
      })
    }

    return filtered
  }, [agents, filter, searchQuery, sortColumn, sortDirection])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAgents = filteredAgents.slice(startIndex, endIndex)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(new Set(paginatedAgents.map(a => a.agent_id)))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (agentId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(agentId)
    } else {
      newSelected.delete(agentId)
    }
    setSelectedRows(newSelected)
  }

  // Sorting handler
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Helper to render sort icon - shows both chevrons, highlights active one
  const renderSortIcon = (currentColumn: string) => {
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

  // Role-based color schemes
  const isReseller = user?.role === 'reseller'
  const backgroundGradient = isReseller
    ? 'radial-gradient(100% 100% at 50% 0%, #DDFFED 0%, #FFF 100%)'
    : 'radial-gradient(100% 100% at 50% 0%, #E5E5FF 0%, #FFF 100%)'

  return (
    <div className="w-full min-h-screen">
      {isCheckingAuth ? (
        <div className="flex items-center justify-center py-12" style={{ background: backgroundGradient }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-600">Verifying access...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header Section with Gradient */}
          <div
            className="w-full px-8 md:px-12 lg:px-16 pt-12 md:pt-16 lg:pt-20 pb-0"
            style={{
              background: backgroundGradient,
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Agent Details</h1>
                <p className="text-base text-gray-600">
                  {isReseller
                    ? 'Manage and resell AI agents to your enterprise clients.'
                    : 'ISVs with us to showcase your AI solutions to our enterprise clients.'
                  }
                </p>
              </div>
              {!isReseller && (
                <div>
                  <Button
                    className="bg-black text-white hover:bg-black/90"
                    onClick={() => {
                      router.push('/onboard')
                    }}
                  >
                    ONBOARD AGENT
                  </Button>
                </div>
              )}
            </div>

            {/* Status Filters and Search */}
            <div className="border-b border-gray-200 bg-white" style={{ marginBottom: 0, paddingBottom: 0 }}>
              <div className="flex items-center justify-between gap-4" style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                {/* Status Tabs */}
                <div className="flex items-end gap-6">
                  <button
                    onClick={() => setFilter("all")}
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${filter === "all"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    All ({counts.all})
                  </button>
                  <button
                    onClick={() => setFilter("approved")}
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${filter === "approved"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    Approved({counts.approved})
                  </button>
                  <button
                    onClick={() => setFilter("rejected")}
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${filter === "rejected"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    Rejected({counts.rejected})
                  </button>
                  <button
                    onClick={() => setFilter("pending")}
                    className={`pb-2 px-1 text-sm font-medium transition-colors ${filter === "pending"
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    Pending({counts.pending})
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-md border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table Section with White Background */}
          <div className="w-full px-8 md:px-12 lg:px-16 pt-0 pb-6 bg-white" style={{ marginTop: '-1px' }}>
            <div className="overflow-x-auto">
              {error && (
                <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 m-4">
                  {error}
                </div>
              )}
              {loading && (
                <div className="mb-3 text-sm text-gray-600 p-4">Loading...</div>
              )}
              <Table className="border-collapse">
                <TableHeader>
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="font-medium w-24 border-r border-gray-200 border-l-0">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedRows.size === paginatedAgents.length && paginatedAgents.length > 0 && paginatedAgents.every(a => selectedRows.has(a.agent_id))}
                          onChange={(e) => handleSelectAll(e.target.checked)}
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
                      className="font-medium min-w-[200px] border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("agent_name")}
                    >
                      <div className="flex items-center gap-2">
                        Agent Name
                        {renderSortIcon("agent_name")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-medium min-w-[120px] border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("asset_type")}
                    >
                      <div className="flex items-center gap-2">
                        Asset Type
                        {renderSortIcon("asset_type")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-medium min-w-[100px] border-r border-gray-200 cursor-pointer"
                      onClick={() => handleSort("isv_id")}
                    >
                      <div className="flex items-center gap-2">
                        ISV ID
                        {renderSortIcon("isv_id")}
                      </div>
                    </TableHead>
                    <TableHead className="font-medium min-w-[140px] border-r-0">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAgents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500 border-r border-gray-200 border-l-0 border-r-0">
                        No agents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAgents.map((a, idx) => {
                      const status = toStatus(a.admin_approved)
                      return (
                        <TableRow key={a.agent_id} className="border-b border-gray-200">
                          <TableCell className="w-24 border-r border-gray-200 border-l-0">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedRows.has(a.agent_id)}
                                onChange={(e) => handleSelectRow(a.agent_id, e.target.checked)}
                                className="rounded border-gray-300"
                                style={{
                                  accentColor: '#E5E7EB',
                                  borderColor: '#E5E7EB',
                                  color: '#E5E7EB'
                                }}
                              />
                              <span className="text-sm">{startIndex + idx + 1}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium min-w-[200px] text-sm text-gray-900 border-r border-gray-200">{a.agent_name}</TableCell>
                          <TableCell className="min-w-[120px] text-sm text-gray-900 border-r border-gray-200">{a.asset_type || "-"}</TableCell>
                          <TableCell className="min-w-[100px] text-sm text-gray-900 border-r border-gray-200">{a.isv_id || "-"}</TableCell>
                          <TableCell className="min-w-[140px] border-r-0">
                            <div className="flex items-center justify-between gap-2 relative">
                              <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${statusStyle[status]}`}>
                                {status}
                              </span>
                              <div className="relative">
                                <DropdownMenu modal={false}>
                                  <DropdownMenuTrigger asChild>
                                    <button className="text-gray-400 hover:text-gray-600">
                                      <MoreVertical className="h-4 w-4" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    side="bottom"
                                    sideOffset={4}
                                    alignOffset={0}
                                    collisionPadding={8}
                                    style={{ maxHeight: '200px', position: 'absolute', top: '100%', right: 0, marginTop: '4px' }}
                                  >
                                    <DropdownMenuItem
                                      onClick={() => {
                                        router.push(`/agents/${a.agent_id}`)
                                      }}
                                      className="text-black focus:bg-black focus:text-white"
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View
                                    </DropdownMenuItem>
                                    {!isReseller && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedAgent(a)
                                          setEditModalOpen(true)
                                        }}
                                        className="text-black focus:bg-black focus:text-white"
                                      >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 px-2">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredAgents.length)} of {filteredAgents.length} results
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        )
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2">...</span>
                      }
                      return null
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Chat Dialog */}
      <ChatDialog
        open={chatOpen}
        onOpenChange={setChatOpen}
        initialMode="create"
      />

      {/* Agent View Modal */}
      {selectedAgent && (
        <AgentPreviewModal
          agent={{
            agent_id: selectedAgent.agent_id,
            agent_name: selectedAgent.agent_name,
            asset_type: selectedAgent.asset_type || '',
            isv_id: selectedAgent.isv_id,
            by_persona: selectedAgent.by_persona || '',
            by_value: selectedAgent.by_value || '',
            demo_link: selectedAgent.demo_link || (selectedAgent as any).application_demo_url || '',
            demo_preview: selectedAgent.demo_preview || '',
            description: selectedAgent.description || '',
            features: '',
            tags: selectedAgent.tags || '',
            roi: '',
            admin_approved: (selectedAgent.admin_approved === 'yes' ? 'yes' : 'no') as 'yes' | 'no',
            is_approved: selectedAgent.admin_approved === 'yes',
          }}
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          onApprove={() => { }}
          onReject={() => { }}
        />
      )}

      {/* Agent Edit Modal */}
      {selectedAgent && (
        <EditAgentModal
          agent={{
            agent_id: selectedAgent.agent_id,
            agent_name: selectedAgent.agent_name,
            asset_type: selectedAgent.asset_type || '',
            isv_id: selectedAgent.isv_id,
            by_persona: selectedAgent.by_persona || '',
            by_value: selectedAgent.by_value || '',
            demo_link: selectedAgent.demo_link || (selectedAgent as any).application_demo_url || '',
            demo_preview: selectedAgent.demo_preview || '',
            description: selectedAgent.description || '',
            features: '',
            tags: selectedAgent.tags || '',
            roi: '',
            admin_approved: (selectedAgent.admin_approved === 'yes' ? 'yes' : 'no') as 'yes' | 'no',
            is_approved: selectedAgent.admin_approved === 'yes',
          }}
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          onSave={() => {
            // Refresh agent list after successful save
            if (isvId) {
              const token = useAuthStore.getState().token
              const headers = getAuthHeaders(token, {
                'Content-Type': 'application/json',
              })

              fetch(`https://agents-store.onrender.com/api/isv/profile/${isvId}`, {
                cache: "no-store",
                headers,
              })
                .then(res => res.json())
                .then(json => setData(json))
                .catch(e => setError(e?.message || "Failed to refresh"))
            }
            setEditModalOpen(false)
          }}
        />
      )}
    </div>
  )
}

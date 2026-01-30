"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { MessageSquare, Plus, ChevronLeft, ChevronRight, Clock, Search, GripVertical } from "lucide-react"

interface Thread {
    id: string
    title: string
    preview: string
    timestamp: Date
    messageCount: number
}

interface ThreadSidebarProps {
    isOpen: boolean
    onToggle: () => void
    threads: Thread[]
    activeThreadId?: string
    onThreadSelect: (threadId: string) => void
    onNewThread: () => void
    onWidthChange?: (width: number) => void
}

// Group threads by time
function groupThreadsByTime(threads: Thread[]) {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const groups: { label: string; threads: Thread[] }[] = [
        { label: "Today", threads: [] },
        { label: "Yesterday", threads: [] },
        { label: "This Week", threads: [] },
        { label: "Older", threads: [] },
    ]

    threads.forEach(thread => {
        const threadDate = new Date(thread.timestamp)
        if (threadDate >= today) {
            groups[0].threads.push(thread)
        } else if (threadDate >= yesterday) {
            groups[1].threads.push(thread)
        } else if (threadDate >= lastWeek) {
            groups[2].threads.push(thread)
        } else {
            groups[3].threads.push(thread)
        }
    })

    return groups.filter(g => g.threads.length > 0)
}

const MIN_WIDTH = 200
const DEFAULT_WIDTH = 256

export function ThreadSidebar({
    isOpen,
    onToggle,
    threads,
    activeThreadId,
    onThreadSelect,
    onNewThread,
    onWidthChange,
}: ThreadSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_WIDTH)
    const [isResizing, setIsResizing] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)

    // Handle resize
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isResizing) return

        const maxWidth = window.innerWidth * 0.4 // 40% max
        const newWidth = Math.min(Math.max(e.clientX, MIN_WIDTH), maxWidth)
        setSidebarWidth(newWidth)
        onWidthChange?.(newWidth)
    }, [isResizing, onWidthChange])

    const handleMouseUp = useCallback(() => {
        setIsResizing(false)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
    }, [])

    useEffect(() => {
        if (isResizing) {
            document.body.style.cursor = 'col-resize'
            document.body.style.userSelect = 'none'
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isResizing, handleMouseMove, handleMouseUp])

    const startResizing = useCallback(() => {
        setIsResizing(true)
    }, [])

    const filteredThreads = threads.filter(thread =>
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.preview.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const groupedThreads = groupThreadsByTime(filteredThreads)

    return (
        <>
            {/* Toggle Button (visible when sidebar is closed) */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-6 h-12 bg-gray-100 hover:bg-gray-200 rounded-r-lg border border-l-0 border-gray-200 transition-all duration-200 hover:w-8"
                    title="Open thread history"
                >
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
            )}

            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`absolute left-0 top-0 bottom-0 z-20 bg-gray-50 border-r border-gray-200 transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"
                    } overflow-hidden`}
                style={{ width: isOpen ? sidebarWidth : 0 }}
            >
                <div className="flex flex-col h-full" style={{ width: sidebarWidth }}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-800">Conversations</span>
                        </div>
                        <button
                            onClick={onToggle}
                            className="p-1 rounded hover:bg-gray-100 transition-colors"
                            title="Close sidebar"
                        >
                            <ChevronLeft className="h-4 w-4 text-gray-500" />
                        </button>
                    </div>

                    {/* New Thread Button */}
                    <div className="px-3 py-2">
                        <button
                            onClick={onNewThread}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <Plus className="h-4 w-4" />
                            New Conversation
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-3 pb-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                            />
                        </div>
                    </div>

                    {/* Thread List */}
                    <div className="flex-1 overflow-y-auto px-2 pb-2 scrollbar-hide">
                        {groupedThreads.length > 0 ? (
                            groupedThreads.map((group) => (
                                <div key={group.label} className="mb-3">
                                    <div className="flex items-center gap-1.5 px-2 py-1.5 text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                                        <Clock className="h-3 w-3" />
                                        {group.label}
                                    </div>
                                    <div className="space-y-1">
                                        {group.threads.map((thread) => (
                                            <button
                                                key={thread.id}
                                                onClick={() => onThreadSelect(thread.id)}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${activeThreadId === thread.id
                                                    ? "bg-white shadow-sm border border-gray-200"
                                                    : "hover:bg-white/50"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-800 truncate">
                                                            {thread.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 truncate mt-0.5">
                                                            {thread.preview}
                                                        </p>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                        {thread.messageCount}
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <MessageSquare className="h-8 w-8 text-gray-300 mb-2" />
                                <p className="text-sm text-gray-500">No conversations yet</p>
                                <p className="text-xs text-gray-400 mt-1">Start a new conversation above</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resize Handle */}
                {isOpen && (
                    <div
                        onMouseDown={startResizing}
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-gray-300 active:bg-gray-400 transition-colors group"
                        title="Drag to resize"
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

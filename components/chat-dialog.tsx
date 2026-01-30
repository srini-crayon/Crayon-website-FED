"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog"
import { X, Maximize2, Minimize2, Trash2, MessageSquarePlus, PanelLeftClose, PanelLeft } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group"
import { useChatStore, type ChatMessage } from "../lib/store/chat.store"
import { useAuthStore } from "../lib/store/auth.store"

// Import new modular components
import { ChatInputArea } from "./chat/chat-input-area"
import { ChatTypingIndicator } from "./chat/chat-typing-indicator"
import { ChatMessageBubble } from "./chat/chat-message-bubble"
import { ThreadSidebar } from "./chat/thread-sidebar"

type ChatDialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  initialMode?: "create" | "explore"
  initialMessage?: string
}

// Function to fetch agent details by ID
async function fetchAgentDetails(agentId: string) {
  try {
    const res = await fetch(`https://agents-store.onrender.com/api/agents/${agentId}`, {
      cache: "no-store"
    })
    if (!res.ok) throw new Error(`Failed to fetch agent ${agentId}: ${res.status}`)
    const data = await res.json()

    if (data?.agent) {
      const agentsRes = await fetch("https://agents-store.onrender.com/api/agents", { cache: "no-store" })
      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        const agentInList = agentsData?.agents?.find((a: any) => a.agent_id === agentId)
        if (agentInList?.admin_approved === "yes") {
          return data?.agent || null
        }
      }
    }

    return null
  } catch (err) {
    return null
  }
}

export default function ChatDialog({ open, onOpenChange, initialMode = "explore", initialMessage }: ChatDialogProps) {
  const {
    messages,
    sessionId,
    mode,
    addMessage,
    updateMessage,
    clearChat,
    setMode,
    setSessionId,
    loadChatHistory,
    historyLoaded,
    isLoadingHistory
  } = useChatStore()

  const { user, isAuthenticated } = useAuthStore()

  const [isExpanded, setIsExpanded] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollableContentRef = useRef<HTMLDivElement>(null)

  // Thread data (placeholder for future threading support)
  const [threads, setThreads] = useState<Array<{
    id: string
    title: string
    preview: string
    timestamp: Date
    messageCount: number
  }>>([])
  const [activeThreadId, setActiveThreadId] = useState<string | undefined>()

  // Clean markdown links from input field
  const cleanInputFromMarkdownLinks = useCallback((text: string): string => {
    if (!text) return text
    return text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\(/g, '$1')
  }, [])

  // Load chat history when dialog opens
  useEffect(() => {
    if (open && isAuthenticated && user && !historyLoaded && !isLoadingHistory) {
      const userId = user.user_id
      const userType = user.role || 'anonymous'

      loadChatHistory(userId, userType).then((result) => {
        if (result.success) {
          console.log('Chat history loaded successfully')
        }
      })
    }
  }, [open, isAuthenticated, user, historyLoaded, isLoadingHistory, loadChatHistory])

  // Lock body scroll when dialog is open
  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY
      const scrollX = window.scrollX

      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.left = `-${scrollX}px`
      document.body.style.width = '100%'
      document.body.style.height = '100%'
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.position = 'fixed'
      document.documentElement.style.width = '100%'
      document.documentElement.style.height = '100%'

      return () => {
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.left = ''
        document.body.style.width = ''
        document.body.style.height = ''
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
        document.documentElement.style.position = ''
        document.documentElement.style.width = ''
        document.documentElement.style.height = ''
        window.scrollTo(scrollX, scrollY)
      }
    }
  }, [open])

  // Force positioning with direct DOM manipulation
  useEffect(() => {
    if (open) {
      let isPositioning = false
      let lastUpdateTime = 0
      let updateTimeout: NodeJS.Timeout | null = null
      const DEBOUNCE_MS = 100

      const updatePosition = (element: HTMLElement, force = false) => {
        const now = Date.now()
        if ((isPositioning && !force) || (now - lastUpdateTime < DEBOUNCE_MS && !force)) {
          return
        }

        isPositioning = true
        lastUpdateTime = now

        try {
          let segment1Bottom = 0
          let heroSection: HTMLElement | null = null

          heroSection = document.querySelector('section.fade-in-section') as HTMLElement

          if (!heroSection) {
            try {
              heroSection = document.querySelector('section:has(.fade-in-section)') as HTMLElement
            } catch (e) { }
          }

          if (!heroSection) {
            try {
              heroSection = document.querySelector('section:has(.fade-in-blur)') as HTMLElement
            } catch (e) { }
          }

          if (heroSection) {
            const rect = heroSection.getBoundingClientRect()
            segment1Bottom = rect.bottom
          } else {
            const allSections = Array.from(document.querySelectorAll('section'))
            const filtersSection = allSections.find(section =>
              section.classList.contains('bg-white') ||
              section.querySelector('.bg-white')
            )

            if (filtersSection && allSections.indexOf(filtersSection) > 0) {
              const heroIndex = allSections.indexOf(filtersSection) - 1
              const hero = allSections[heroIndex]
              if (hero) {
                const rect = hero.getBoundingClientRect()
                segment1Bottom = rect.bottom
              }
            } else if (allSections.length > 0) {
              const rect = allSections[0].getBoundingClientRect()
              segment1Bottom = rect.bottom
            } else {
              segment1Bottom = window.innerHeight * 0.6
            }
          }

          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight
          const margin = 24

          if (isExpanded) {
            const dialogWidth = Math.min(960, viewportWidth - (margin * 2))
            const bottomOffset = Math.max(margin, viewportHeight - segment1Bottom)
            const maxDialogHeight = Math.min(640, Math.max(400, segment1Bottom - margin * 2))
            const calculatedLeft = (viewportWidth - dialogWidth) / 2
            const leftPosition = Math.max(margin, calculatedLeft)

            element.style.setProperty('position', 'fixed', 'important')
            element.style.setProperty('bottom', `${bottomOffset}px`, 'important')
            element.style.setProperty('left', `${leftPosition}px`, 'important')
            element.style.setProperty('right', 'auto', 'important')
            element.style.setProperty('top', 'auto', 'important')
            element.style.setProperty('transform', 'none', 'important')
            element.style.setProperty('margin', '0', 'important')
            element.style.setProperty('z-index', '9999', 'important')
            element.style.setProperty('width', `${dialogWidth}px`, 'important')
            element.style.setProperty('max-width', `${dialogWidth}px`, 'important')
            element.style.setProperty('min-width', `${dialogWidth}px`, 'important')
            element.style.setProperty('max-height', `${maxDialogHeight}px`, 'important')
            element.style.setProperty('height', 'auto', 'important')
            element.style.setProperty('overflow', 'hidden', 'important')
            element.style.setProperty('visibility', 'visible', 'important')
            element.style.setProperty('opacity', '1', 'important')
            element.style.setProperty('display', 'grid', 'important')
            element.style.setProperty('pointer-events', 'auto', 'important')
          } else {
            const dialogWidth = Math.min(600, viewportWidth - (margin * 2))
            const bottomOffset = Math.max(margin, viewportHeight - segment1Bottom)
            const maxDialogHeight = Math.min(520, Math.max(400, segment1Bottom - margin * 2))

            element.style.setProperty('position', 'fixed', 'important')
            element.style.setProperty('bottom', `${bottomOffset}px`, 'important')
            element.style.setProperty('right', `${margin}px`, 'important')
            element.style.setProperty('top', 'auto', 'important')
            element.style.setProperty('left', 'auto', 'important')
            element.style.setProperty('transform', 'none', 'important')
            element.style.setProperty('margin', '0', 'important')
            element.style.setProperty('z-index', '9999', 'important')
            element.style.setProperty('width', `${dialogWidth}px`, 'important')
            element.style.setProperty('max-width', `${dialogWidth}px`, 'important')
            element.style.setProperty('max-height', `${maxDialogHeight}px`, 'important')
            element.style.setProperty('height', 'auto', 'important')
            element.style.setProperty('overflow', 'hidden', 'important')
            element.style.setProperty('visibility', 'visible', 'important')
            element.style.setProperty('opacity', '1', 'important')
            element.style.setProperty('display', 'grid', 'important')
            element.style.setProperty('pointer-events', 'auto', 'important')
          }
        } finally {
          setTimeout(() => {
            isPositioning = false
          }, DEBOUNCE_MS)
        }
      }

      const tryUpdate = () => {
        const element = document.querySelector('[data-slot="dialog-content"]') as HTMLElement
        if (element) {
          requestAnimationFrame(() => {
            updatePosition(element, true)
          })
          return true
        }
        return false
      }

      const handleResize = () => {
        const element = document.querySelector('[data-slot="dialog-content"]') as HTMLElement
        if (element) {
          updatePosition(element, true)
        }
      }

      const handleScroll = () => {
        const element = document.querySelector('[data-slot="dialog-content"]') as HTMLElement
        if (element) {
          updatePosition(element, true)
        }
      }

      window.addEventListener('resize', handleResize)
      window.addEventListener('scroll', handleScroll, { passive: true })

      let observer: MutationObserver | null = null

      if (tryUpdate()) {
        // Element found
      } else {
        observer = new MutationObserver(() => {
          const element = document.querySelector('[data-slot="dialog-content"]') as HTMLElement
          if (element) {
            tryUpdate()
            if (observer) {
              observer.disconnect()
              observer = null
            }
          }
        })

        observer.observe(document.body, {
          childList: true,
          subtree: true
        })

        const timers = [
          setTimeout(() => tryUpdate(), 0),
          setTimeout(() => tryUpdate(), 50),
          setTimeout(() => tryUpdate(), 100),
          setTimeout(() => tryUpdate(), 200)
        ]

        return () => {
          if (observer) observer.disconnect()
          if (updateTimeout) clearTimeout(updateTimeout)
          timers.forEach(timer => clearTimeout(timer))
          window.removeEventListener('resize', handleResize)
          window.removeEventListener('scroll', handleScroll)
        }
      }

      return () => {
        if (observer) observer.disconnect()
        if (updateTimeout) clearTimeout(updateTimeout)
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [open, isExpanded])

  useEffect(() => {
    if (!sessionId) {
      const sid = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      setSessionId(sid)
    }
  }, [sessionId, setSessionId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        })
      } else if (scrollableContentRef.current) {
        scrollableContentRef.current.scrollTo({
          top: scrollableContentRef.current.scrollHeight,
          behavior: 'smooth'
        })
      }
    }

    requestAnimationFrame(() => {
      setTimeout(scrollToBottom, 100)
    })
  }, [messages, isThinking, isSending])

  // Handle mode and initial message on open
  useEffect(() => {
    if (open) {
      if (initialMode && initialMode !== mode) {
        setMode(initialMode)
      }
      setIsExpanded(false)
      setIsSidebarOpen(false)

      if (initialMessage && initialMessage.trim()) {
        setInput(initialMessage)
        setTimeout(() => {
          handleSendMessage(initialMessage)
        }, 300)
      }

      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
          })
        } else if (scrollableContentRef.current) {
          scrollableContentRef.current.scrollTop = scrollableContentRef.current.scrollHeight
        }
      }, 100)
    }
  }, [open, initialMode, initialMessage, setMode, mode])

  async function handleSendMessage(messageText: string) {
    if (!messageText.trim()) return
    const now = new Date()
    const timeString = now.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
    const userText = messageText
    addMessage({ id: crypto.randomUUID(), role: "user", text: userText, time: timeString })
    setInput("")
    setIsSending(true)
    setIsThinking(true)

    setFeedback({ type: 'success', message: 'Message sent!' })
    setTimeout(() => setFeedback(null), 2000)

    const thinkingMessageId = crypto.randomUUID()
    addMessage({ id: thinkingMessageId, role: "assistant", text: "AI thinking...", time: timeString })

    try {
      const requestBody: any = {
        mode,
        query: userText,
        session_id: sessionId
      }

      if (isAuthenticated && user) {
        requestBody.user_id = user.user_id
        requestBody.user_type = user.role || 'anonymous'
      } else {
        requestBody.user_id = 'anonymous'
        requestBody.user_type = 'anonymous'
      }

      const res = await fetch("https://agents-store.onrender.com/api/chat", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
      const json = await res.json().catch(() => null)
      const reply = json?.data?.response || "Sorry, something went wrong. Please try again later."

      let filteredAgentIds = null
      if (json?.data?.filtered_agents && Array.isArray(json.data.filtered_agents) && json.data.filtered_agents.length > 0) {
        filteredAgentIds = json.data.filtered_agents
      }

      const letsBuild = json?.data?.lets_build === true
      const gatheredInfo = json?.data?.gathered_info || {}
      const brdDownloadUrl = json?.data?.brd_download_url || null
      const brdStatus = json?.data?.brd_status || null
      const megaTrends = json?.data?.mega_trends || null
      const suggestedAgents = json?.data?.suggested_agents && Array.isArray(json.data.suggested_agents)
        ? json.data.suggested_agents
        : null

      const replyTs = json?.data?.timestamp
        ? new Date(json.data.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        : new Date().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })

      updateMessage(thinkingMessageId, {
        text: reply,
        time: replyTs,
        filteredAgentIds,
        letsBuild,
        letsBuildTimestamp: letsBuild ? Date.now() : undefined,
        gatheredInfo,
        brdDownloadUrl,
        brdStatus,
        mega_trends: megaTrends,
        suggested_agents: suggestedAgents
      })

      if (filteredAgentIds && filteredAgentIds.length > 0) {
        try {
          const agentDetailsPromises = filteredAgentIds.map((id: string) => fetchAgentDetails(id))
          const agentDetails = await Promise.all(agentDetailsPromises)
          const validAgents = agentDetails.filter(agent => agent !== null)

          if (validAgents.length > 0) {
            updateMessage(thinkingMessageId, { filteredAgents: validAgents })
          }
        } catch (err) {
          // Silently handle error
        }
      }
    } catch (e) {
      const errTs = new Date().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
      updateMessage(thinkingMessageId, {
        text: "I'm currently experiencing technical difficulties. Please try again.",
        time: errTs
      })
      setFeedback({ type: 'error', message: 'Failed to send message' })
      setTimeout(() => setFeedback(null), 2000)
    } finally {
      setIsSending(false)
      setIsThinking(false)
    }
  }

  async function handleSend() {
    if (!input.trim()) return
    await handleSendMessage(input)
  }

  async function handleClearChat() {
    if (isClearing) return

    setIsClearing(true)
    setInput("")

    const messagesContainer = scrollableContentRef.current
    if (messagesContainer) {
      messagesContainer.style.transition = 'opacity 0.3s ease-out'
      messagesContainer.style.opacity = '0.3'
    }

    try {
      const result = await clearChat()

      if (result.success) {
        setFeedback({ type: 'success', message: 'Conversation cleared!' })
        setTimeout(() => setFeedback(null), 3000)
      } else {
        setFeedback({ type: 'error', message: result.error || 'Failed to clear' })
        setTimeout(() => setFeedback(null), 3000)
      }
    } catch (error) {
      setFeedback({ type: 'error', message: 'An error occurred' })
      setTimeout(() => setFeedback(null), 3000)
    } finally {
      setIsClearing(false)
      if (messagesContainer) {
        setTimeout(() => {
          if (messagesContainer) {
            messagesContainer.style.opacity = '1'
            messagesContainer.style.transition = ''
          }
        }, 100)
      }
    }
  }

  const handleNewThread = () => {
    handleClearChat()
    setIsSidebarOpen(false)
  }

  const handleThreadSelect = (threadId: string) => {
    setActiveThreadId(threadId)
    setIsSidebarOpen(false)
    // Future: Load thread messages
  }

  const handleInputChange = (value: string) => {
    const cleanedValue = cleanInputFromMarkdownLinks(value)
    setInput(cleanedValue)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
    setTimeout(() => handleSendMessage(suggestion), 100)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={`p-0 rounded-2xl border shadow-2xl transition-all duration-300 ease-out dialog-enhanced-enter ${isExpanded
              ? "sm:max-w-[900px] md:max-w-[960px] animate-in slide-in-from-bottom-4"
              : "sm:max-w-[600px] md:max-w-[600px] animate-in slide-in-from-bottom-4 chat-dialog-bottom-right"
            }`}
          style={!isExpanded ? {
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 48px)',
            height: 'auto',
            zIndex: 9999,
            maxWidth: '600px',
            width: 'calc(100% - 2rem)',
            display: 'flex',
            flexDirection: 'column',
          } as React.CSSProperties : {
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 48px)',
            height: 'auto',
            zIndex: 9999,
            maxWidth: '960px',
            display: 'flex',
            flexDirection: 'column',
          } as React.CSSProperties}
          showCloseButton={false}
          showOverlay={true}
          disableCentering={true}
        >
          <DialogTitle className="sr-only">AI Assistant Chat</DialogTitle>
          <DialogDescription className="sr-only">Chat with AI assistant to explore or create agents</DialogDescription>

          <div className="bg-white relative" style={!isExpanded ? {
            height: '520px',
            minHeight: '520px',
            maxHeight: 'calc(100vh - 48px)',
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            overflow: 'hidden'
          } : {
            height: '640px',
            minHeight: '640px',
            maxHeight: 'calc(100vh - 48px)',
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            overflow: 'hidden'
          }}>

            {/* Thread Sidebar */}
            <ThreadSidebar
              isOpen={isSidebarOpen}
              onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
              threads={threads}
              activeThreadId={activeThreadId}
              onThreadSelect={handleThreadSelect}
              onNewThread={handleNewThread}
            />

            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3 bg-gradient-to-r from-white to-gray-50">
              <div className="flex items-center gap-3">
                {/* Sidebar Toggle */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors hidden sm:flex"
                  title={isSidebarOpen ? "Close history" : "View history"}
                >
                  {isSidebarOpen ? (
                    <PanelLeftClose className="h-4 w-4 text-gray-600" />
                  ) : (
                    <PanelLeft className="h-4 w-4 text-gray-600" />
                  )}
                </button>

                <div className="relative h-6 w-6">
                  <Image src="/chat_icon.png" alt="chat" fill className="object-contain" />
                </div>
                <div className="text-sm font-medium text-gray-800">AI Assistant</div>
              </div>

              {/* Mode Toggle */}
              <div className="absolute left-1/2 transform -translate-x-1/2">
                <ToggleGroup
                  type="single"
                  value={mode}
                  onValueChange={(value) => {
                    if (value) setMode(value as "explore" | "create")
                  }}
                  className="rounded-lg bg-gray-100 p-0.5 hidden sm:flex"
                >
                  <ToggleGroupItem
                    value="explore"
                    aria-label="Explore"
                    className="px-3 py-1 text-xs rounded-md data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900 transition-all"
                  >
                    Explore
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="create"
                    aria-label="Create"
                    className="px-3 py-1 text-xs rounded-md data-[state=on]:bg-white data-[state=on]:text-gray-900 data-[state=on]:shadow-sm data-[state=off]:text-gray-600 data-[state=off]:hover:text-gray-900 transition-all"
                  >
                    Create
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Header Actions */}
              <div className="flex items-center gap-1">
                <button
                  aria-label="Clear Chat"
                  onClick={handleClearChat}
                  disabled={isClearing}
                  className="relative rounded-lg p-1.5 hover:bg-red-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Clear conversation"
                >
                  {isClearing ? (
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-gray-500 group-hover:text-red-600 transition-colors duration-200" />
                  )}
                </button>

                <button
                  aria-label={isExpanded ? "Restore" : "Expand"}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4 text-gray-500" /> : <Maximize2 className="h-4 w-4 text-gray-500" />}
                </button>

                <button
                  aria-label="Close"
                  onClick={() => onOpenChange(false)}
                  className="rounded-lg p-1.5 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollableContentRef}
              className={`space-y-4 overflow-y-auto overflow-x-hidden px-4 py-4 smooth-scroll chat-scrollbar transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'
                }`}
              style={{
                minHeight: 0,
                maxHeight: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
            >
              {isLoadingHistory && (
                <div className="flex items-center justify-center py-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading chat history...</p>
                  </div>
                </div>
              )}

              {!isLoadingHistory && messages.map((m, index) => (
                m.text === "AI thinking..." ? (
                  <ChatTypingIndicator
                    key={m.id}
                    mode={mode}
                    showCancel={false}
                  />
                ) : (
                  <ChatMessageBubble
                    key={m.id}
                    message={m}
                    index={index}
                    mode={mode}
                    sessionId={sessionId}
                  />
                )
              ))}

              <div ref={messagesEndRef} style={{ height: '1px', width: '100%' }} />
            </div>

            {/* Input Area */}
            <div className={`border-t px-3 py-3 bg-white transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'
              }`}>
              <ChatInputArea
                value={input}
                onChange={handleInputChange}
                onSend={handleSend}
                disabled={isSending}
                placeholder={mode === "explore" ? "Ask about AI agents..." : "Describe what you want to build..."}
                showSuggestions={messages.length <= 1}
                suggestions={mode === "explore"
                  ? ["Find customer service agents", "Show data analytics solutions", "Explore document processing"]
                  : ["I need an agent for...", "Build a chatbot that...", "Create automation for..."]
                }
                onSuggestionClick={handleSuggestionClick}
              />
            </div>

            {/* Feedback Toast */}
            {feedback && (
              <div
                className={`fixed bottom-20 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${feedback.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  } toast-enter`}
              >
                {feedback.message}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

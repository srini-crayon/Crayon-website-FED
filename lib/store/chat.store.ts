import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { formatTime } from '../utils'

// Safari-safe localStorage wrapper
const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key)
    } catch (e) {
      return null
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value)
    } catch (e) {
      // Silently handle localStorage errors
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (e) {
      // Silently handle localStorage errors
    }
  },
}

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
  time: string
  letsBuild?: boolean
  letsBuildTimestamp?: number
  gatheredInfo?: Record<string, any>
  brdDownloadUrl?: string
  brdStatus?: string
  filteredAgentIds?: string[]
  filteredAgents?: {
    agent_id: string
    agent_name: string
    description: string
    by_value?: string
    by_capability?: string
    service_provider?: string
    asset_type?: string
    by_persona?: string
  }[]
  mega_trends?: string
  suggested_agents?: {
    solution_name: string
    segment: string
    description: string
    trend_reference: string
  }[]
}

type ChatState = {
  messages: ChatMessage[]
  sessionId: string
  mode: "create" | "explore"
  historyLoaded: boolean
  isLoadingHistory: boolean
  addMessage: (message: ChatMessage) => void
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void
  clearChat: () => Promise<{ success: boolean; error?: string }>
  loadChatHistory: (userId: string, userType: string) => Promise<{ success: boolean; error?: string }>
  setMode: (mode: "create" | "explore") => void
  setSessionId: (sessionId: string) => void
  resetHistoryLoaded: () => void
}

const initialMessage: ChatMessage = {
  id: "m1",
  role: "assistant",
  text: "Hi! Tell me what you want to search.",
  time: formatTime(),
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [initialMessage],
      sessionId: "",
      mode: "explore",
      historyLoaded: false,
      isLoadingHistory: false,
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      
      updateMessage: (id, updates) => set((state) => ({
        messages: state.messages.map(msg => 
          msg.id === id ? { ...msg, ...updates } : msg
        )
      })),
      
      clearChat: async () => {
        const state = get()
        const currentSessionId = state.sessionId || `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
        
        try {
          const res = await fetch("https://agents-store.onrender.com/api/chat/clear", {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              mode: state.mode,
              session_id: currentSessionId
            }),
          })
          
          const json = await res.json().catch(() => null)
          
          if (res.ok && json?.success) {
            // Generate new session ID after successful clear
            const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
            set(() => ({
              messages: [initialMessage],
              sessionId: newSessionId,
              historyLoaded: false
            }))
            return { success: true }
          } else {
            // Even if API fails, clear locally but return error
            const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
            set(() => ({
              messages: [initialMessage],
              sessionId: newSessionId,
              historyLoaded: false
            }))
            return { success: false, error: json?.error || "Failed to clear chat on server" }
          }
        } catch (error) {
          // On network error, still clear locally
          const newSessionId = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
          set(() => ({
            messages: [initialMessage],
            sessionId: newSessionId,
            historyLoaded: false
          }))
          return { success: false, error: error instanceof Error ? error.message : "Network error" }
        }
      },
      
      loadChatHistory: async (userId: string, userType: string) => {
        const state = get()
        
        // Don't reload if already loaded or currently loading
        if (state.historyLoaded || state.isLoadingHistory) {
          return { success: true }
        }
        
        set({ isLoadingHistory: true })
        
        try {
          const res = await fetch(
            `https://agents-store.onrender.com/api/chat/history/${userId}?user_type=${userType}`,
            {
              method: "GET",
              headers: {
                accept: "application/json",
              },
            }
          )
          
          const json = await res.json().catch(() => null)
          
          if (res.ok && json?.success && json?.data) {
            // Map API messages to ChatMessage format
            const apiMessages = json.data.messages || json.data.history || []
            const historyMessages: ChatMessage[] = apiMessages.map((msg: any, index: number) => ({
              id: msg.id || msg.message_id || `hist_${index}_${Date.now()}`,
              role: (msg.role || msg.sender || "assistant") === "user" ? "user" : "assistant",
              text: msg.text || msg.message || msg.content || msg.response || "",
              time: msg.timestamp || msg.created_at || msg.time
                ? new Date(msg.timestamp || msg.created_at || msg.time).toLocaleString([], { 
                    month: "short", 
                    day: "numeric", 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  })
                : formatTime(),
              letsBuild: msg.lets_build || false,
              gatheredInfo: msg.gathered_info || {},
              brdDownloadUrl: msg.brd_download_url || null,
              brdStatus: msg.brd_status || null,
              filteredAgentIds: msg.filtered_agents || null,
              mega_trends: msg.mega_trends || null,
              suggested_agents: msg.suggested_agents || null,
            }))
            
            // Set session ID from API if provided
            const apiSessionId = json.data.session_id || state.sessionId || `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
            
            // If we have history, replace messages, otherwise keep initial message
            if (historyMessages.length > 0) {
              set(() => ({
                messages: historyMessages,
                sessionId: apiSessionId,
                historyLoaded: true,
                isLoadingHistory: false
              }))
            } else {
              // No history, keep initial message but mark as loaded
              set(() => ({
                sessionId: apiSessionId,
                historyLoaded: true,
                isLoadingHistory: false
              }))
            }
            
            return { success: true }
          } else {
            // API call failed, mark as loaded to prevent retries
            set(() => ({ 
              historyLoaded: true,
              isLoadingHistory: false 
            }))
            return { success: false, error: json?.error || json?.message || "Failed to load chat history" }
          }
        } catch (error) {
          // On network error, mark as loaded to prevent retries
          set(() => ({ 
            historyLoaded: true,
            isLoadingHistory: false 
          }))
          return { success: false, error: error instanceof Error ? error.message : "Network error" }
        }
      },
      
      setMode: (mode) => set(() => ({ mode })),
      
      setSessionId: (sessionId) => set(() => ({ sessionId })),
      
      resetHistoryLoaded: () => set(() => ({ historyLoaded: false }))
    }),
    {
      name: 'chat-storage',
      storage: createJSONStorage(() => safeLocalStorage),
      partialize: (state) => ({
        messages: state.messages,
        sessionId: state.sessionId,
        mode: state.mode
        // Don't persist historyLoaded - reload on each session
      })
    }
  )
)

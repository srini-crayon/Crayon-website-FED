"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUp, X, ChevronDown, Plus } from "lucide-react"
import { useChatStore } from "../lib/store/chat.store"
import { cn } from "../lib/utils"
import { VoiceInputControls } from "./voice-input-controls"

interface AgentSearchChatProps {
  externalValue?: string
  onExternalValueChange?: (value: string) => void
  onEnterChat?: (message: string) => void
  variant?: "default" | "hero"
  placeholder?: string
}

const defaultPlaceholder = "Ask, explore, and create AI agents in real time."

export function AgentSearchChat({ externalValue, onExternalValueChange, onEnterChat, variant = "default", placeholder = defaultPlaceholder }: AgentSearchChatProps) {
  const isHero = variant === "hero"
  const { mode, setMode } = useChatStore()
  const [searchInput, setSearchInput] = useState("")
  const [attachedFile, setAttachedFile] = useState<File | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textInputRef = useRef<HTMLTextAreaElement>(null)
  const modeDropdownRef = useRef<HTMLDivElement>(null)

  // Close mode dropdown on outside click
  useEffect(() => {
    if (!modeDropdownOpen) return
    const handleClick = (e: MouseEvent) => {
      if (modeDropdownRef.current && !modeDropdownRef.current.contains(e.target as Node)) {
        setModeDropdownOpen(false)
      }
    }
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [modeDropdownOpen])

  // Sync external value with internal state
  useEffect(() => {
    if (externalValue !== undefined) {
      setSearchInput(externalValue)
    }
  }, [externalValue])

  // Notify parent of changes
  const handleInputChange = (value: string) => {
    setSearchInput(value)
    onExternalValueChange?.(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Support select-all shortcut
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault()
      e.currentTarget.select()
      return
    }

    if (e.key === "Enter" && searchInput.trim()) {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (searchInput.trim()) {
      onEnterChat?.(searchInput.trim())
      setSearchInput("")
      onExternalValueChange?.("")
    }
  }

  const handleAttachmentClick = () => {
    fileInputRef.current?.click()
    // Focus the text input after opening file picker
    setTimeout(() => {
      textInputRef.current?.focus()
    }, 100)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setAttachedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Auto-resize the textarea to fit content (wraps onto new lines and expands container)
  useEffect(() => {
    const el = textInputRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    el.style.maxHeight = '200px'
  }, [searchInput])

  return (
    <div className="w-full">
      {isHero && (
        <style>{`.agent-search-hero-dark::placeholder { color: #C5C1BA; opacity: 1; }`}</style>
      )}
      <div
        className={`mx-auto p-4 transition-all duration-300 ease-out ${isHero ? "" : "mb-8 rounded-2xl max-w-5xl"} ${!isHero && (isFocused ? "scale-[1.01]" : "shadow-lg hover:shadow-xl hover:-translate-y-0.5")}`}
        style={{
          ...(isHero
            ? {
                width: "100%",
                maxWidth: "768px",
                minHeight: "146px",
                borderRadius: "28px",
                opacity: 1,
                border: "1px solid rgba(252, 251, 248, 0.16)",
                background: "#272725",
                boxShadow: "0px 8px 10px -6px rgba(0,0,0,0.1), 0px 20px 25px -5px rgba(0,0,0,0.1), 0px 0px 0px 1px rgba(0,0,0,0.96)",
              }
            : {
                background: "white",
                border: `1px solid ${isFocused ? "#818CF8" : "#E5E7EB"}`,
                boxShadow: isFocused
                  ? "0 20px 30px -10px rgba(99, 102, 241, 0.15), 0 0 0 4px rgba(99, 102, 241, 0.05)"
                  : undefined,
              }),
        }}
        onMouseEnter={(e) => {
          if (!isHero && !isFocused) e.currentTarget.style.borderColor = "#D1D5DB";
        }}
        onMouseLeave={(e) => {
          if (!isHero && !isFocused) e.currentTarget.style.borderColor = "#E5E7EB";
        }}
      >
        {/* Upper section: Input */}
        <div className="flex items-center gap-3 mb-4">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="*/*"
          />
          <div className="flex-1 flex items-start gap-2">
            <div className="relative w-full">
              <textarea
                ref={textInputRef}
                placeholder={placeholder}
                className={`w-full text-lg py-2 flex-1 resize-none border-none focus:outline-none focus:bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent ${isHero ? "agent-search-hero-dark" : ""}`}
                value={searchInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                  border: 'none',
                  borderWidth: '0',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  overflowY: 'auto',
                  minHeight: '40px',
                  maxHeight: '200px',
                  backgroundColor: 'transparent',
                  fontFamily: isHero ? "Inter, sans-serif" : "Poppins, sans-serif",
                  fontWeight: isHero ? 400 : undefined,
                  fontStyle: isHero ? "normal" : undefined,
                  fontSize: isHero ? "14.6px" : undefined,
                  lineHeight: isHero ? "22px" : undefined,
                  letterSpacing: isHero ? "0%" : undefined,
                  verticalAlign: isHero ? "middle" : undefined,
                  paddingLeft: "12px",
                  color: isHero ? "#C5C1BA" : undefined,
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  setIsFocused(true)
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  setIsFocused(false)
                }}
              />
            </div>
            {attachedFile && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-700 truncate max-w-[150px]">
                  {attachedFile.name}
                </span>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="flex-shrink-0 p-0.5 hover:bg-gray-200 rounded transition-colors"
                  aria-label="Remove file"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Lower section: Buttons and controls — Plus (upload) aligned with upper text, then Explore */}
        <div className="flex items-center justify-between gap-4">
          {/* Left side: Attachment (Plus) then Mode dropdown (Explore + caret) */}
          <div className="flex items-center gap-[0px]" ref={modeDropdownRef}>
            {/* Plus: upload doc / attachments — plain icon, no border */}
            <button
              type="button"
              onClick={handleAttachmentClick}
              className="inline-flex items-center justify-center rounded-lg transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C5C1BA]/50"
              style={{
                width: 40,
                height: 40,
                border: "none",
                ...(isHero
                  ? { background: "transparent", color: "#C5C1BA" }
                  : { background: "transparent", color: "#374151" }),
              }}
              aria-label="Upload file or attachment"
            >
              <Plus size={20} strokeWidth={2} />
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setModeDropdownOpen((v) => !v)
                }}
                aria-expanded={modeDropdownOpen}
                aria-haspopup="listbox"
                aria-label="Select mode"
                className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                style={{
                  fontFamily: "Inter, sans-serif",
                  ...(isHero
                    ? { background: "transparent", color: "#C5C1BA" }
                    : { background: "#F3F4F6", color: "#374151" }),
                }}
              >
                <span className="capitalize">{mode}</span>
                <ChevronDown size={16} style={{ opacity: 0.9 }} />
              </button>
              {modeDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden
                    onClick={() => setModeDropdownOpen(false)}
                  />
                  <div
                    role="listbox"
                    className="absolute left-0 top-full z-20 mt-1 min-w-[140px] rounded-lg py-1 shadow-lg"
                    style={{
                      background: isHero ? "#272725" : "#FFFFFF",
                      border: isHero ? "1px solid rgba(252,251,248,0.12)" : "1px solid #E5E7EB",
                    }}
                  >
                    {(["explore", "create"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        role="option"
                        aria-selected={mode === option}
                        onClick={() => {
                          setMode(option)
                          setModeDropdownOpen(false)
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm capitalize transition-colors"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          color: isHero ? "#C5C1BA" : "#374151",
                          backgroundColor: mode === option ? (isHero ? "rgba(255,255,255,0.08)" : "#F9FAFB") : "transparent",
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Language selector */}
            {/* <button
              type="button"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "150%",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#111827",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "6px 8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.7";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <span style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 500,
                fontSize: "14px",
                lineHeight: "150%",
                letterSpacing: "0%",
                textAlign: "center",
                verticalAlign: "middle",
                color: "#111827",
              }}>English</span>
              <ChevronDown className="h-4 w-4" style={{ color: "#111827" }} />
            </button> */}
          </div>

          {/* Right side: Microphone and Submit button */}
          <div className="flex items-center gap-3">
            {/* VoiceInputControls styled to show only mic button; hero uses custom voice icon */}
            <div className={cn(
              "[&>div>button:first-child]:hidden [&>div>button:last-child]:h-10 [&>div>button:last-child]:w-10 [&>div>button:last-child]:rounded-full",
              isHero ? "[&>div>button:last-child]:!bg-transparent [&>div>button:last-child]:!shadow-none [&>div>button:last-child]:text-[#C5C1BA] [&>div>button:last-child]:border-[#C5C1BA]/30 [&>div>button:last-child]:hover:!bg-white/10 [&>div>button:last-child]:hover:border-[#C5C1BA]/50" : "[&>div>button:last-child]:bg-white [&>div>button:last-child]:hover:bg-gray-50"
            )}>
              <VoiceInputControls
                value={searchInput}
                onValueChange={handleInputChange}
                buttonSize="icon"
                buttonVariant="outline"
                ariaLabel="Use voice input for agent search"
                useCustomVoiceIcon={isHero}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!searchInput.trim()}
              className="h-10 w-10 rounded-full bg-gray-800 hover:bg-gray-900 text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Submit search"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



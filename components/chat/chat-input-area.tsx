"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Mic, Sparkles, Command } from "lucide-react"
import { Button } from "../ui/button"

interface ChatInputAreaProps {
    value: string
    onChange: (value: string) => void
    onSend: () => void
    disabled?: boolean
    placeholder?: string
    maxLength?: number
    showSuggestions?: boolean
    suggestions?: string[]
    onSuggestionClick?: (suggestion: string) => void
}

const defaultSuggestions = [
    "Find agents for customer service",
    "Show me data analytics agents",
    "What can you help me with?",
    "Explore document processing",
]

export function ChatInputArea({
    value,
    onChange,
    onSend,
    disabled = false,
    placeholder = "Type your message...",
    maxLength = 2000,
    showSuggestions = true,
    suggestions = defaultSuggestions,
    onSuggestionClick,
}: ChatInputAreaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [isFocused, setIsFocused] = useState(false)
    const [showQuickActions, setShowQuickActions] = useState(false)

    // Auto-resize textarea
    const adjustHeight = useCallback(() => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = "auto"
            const newHeight = Math.min(textarea.scrollHeight, 150) // Max 150px
            textarea.style.height = `${Math.max(44, newHeight)}px`
        }
    }, [])

    useEffect(() => {
        adjustHeight()
    }, [value, adjustHeight])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !disabled) {
            e.preventDefault()
            onSend()
        }
    }

    const handleSuggestionClick = (suggestion: string) => {
        if (onSuggestionClick) {
            onSuggestionClick(suggestion)
        } else {
            onChange(suggestion)
            // Auto-send after a brief delay
            setTimeout(() => onSend(), 100)
        }
    }

    const charCountPercentage = (value.length / maxLength) * 100

    return (
        <div className="chat-input-container">
            {/* Quick Suggestion Chips */}
            {showSuggestions && value.length === 0 && !disabled && (
                <div className="flex flex-wrap gap-2 px-1 pb-3 suggestion-chips-enter">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <Sparkles className="h-3 w-3 text-purple-500" />
                            <span className="truncate max-w-[180px]">{suggestion}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Main Input Area */}
            <div
                className={`relative flex items-end gap-2 p-2 rounded-2xl border transition-all duration-300 ${isFocused
                        ? "border-gray-400 bg-white shadow-sm ring-2 ring-gray-200"
                        : "border-gray-200 bg-gray-50"
                    }`}
            >
                {/* Quick Actions Button */}
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setShowQuickActions(!showQuickActions)}
                        className="flex items-center justify-center w-9 h-9 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
                        title="Quick actions"
                    >
                        <Command className="h-4 w-4" />
                    </button>

                    {/* Quick Actions Dropdown */}
                    {showQuickActions && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 animate-in fade-in-0 zoom-in-95 duration-200">
                            <button
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowQuickActions(false)}
                            >
                                <Mic className="h-4 w-4" />
                                Voice input
                            </button>
                            <button
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={() => setShowQuickActions(false)}
                            >
                                <Sparkles className="h-4 w-4" />
                                AI suggestions
                            </button>
                        </div>
                    )}
                </div>

                {/* Textarea */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => {
                        if (e.target.value.length <= maxLength) {
                            onChange(e.target.value)
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => {
                        setIsFocused(false)
                        setShowQuickActions(false)
                    }}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    className="flex-1 resize-none bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed py-2 px-1 min-h-[44px] max-h-[150px]"
                    style={{
                        fontFamily: "inherit",
                        lineHeight: "1.5",
                    }}
                />

                {/* Send Button */}
                <Button
                    onClick={onSend}
                    disabled={disabled || value.trim().length === 0}
                    className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                    size="icon"
                >
                    {disabled ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </div>

            {/* Character Count & Keyboard Hint */}
            <div className="flex items-center justify-between px-2 pt-2">
                {value.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 counter-enter">
                        <div className="relative w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${charCountPercentage > 90 ? "bg-red-500" : charCountPercentage > 70 ? "bg-yellow-500" : "bg-gray-400"
                                    }`}
                                style={{ width: `${Math.min(charCountPercentage, 100)}%` }}
                            />
                        </div>
                        <span className={charCountPercentage > 90 ? "text-red-500" : ""}>
                            {value.length}/{maxLength}
                        </span>
                    </div>
                )}
                <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                    <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 text-[10px] font-mono">Enter</kbd>
                    <span>to send</span>
                    <span className="mx-1">•</span>
                    <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-500 text-[10px] font-mono">Shift+Enter</kbd>
                    <span>for new line</span>
                </div>
            </div>
        </div>
    )
}

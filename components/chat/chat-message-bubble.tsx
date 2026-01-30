"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import { Copy, Check, ThumbsUp, ThumbsDown, ExternalLink, Sparkles, Zap, Brain } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import type { ChatMessage } from "../../lib/store/chat.store"

type MarkdownComponentProps = {
    children?: React.ReactNode
}

interface ChatMessageBubbleProps {
    message: ChatMessage
    index: number
    mode: "explore" | "create"
    sessionId: string
}

// Function to format chat text for better readability
function formatChatText(text: string | null | undefined): string {
    if (!text || typeof text !== 'string' || text === "AI thinking...") {
        return text || ""
    }

    let formatted = text
        .replace(/\\n\d+/g, '\n')
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '\t')
        .replace(/\\r/g, '\r')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\')

    return formatted
        .replace(/\n\n\n+/g, '\n\n')
        .trim()
}

// Agent Card Component
function AgentCard({ agent, index }: { agent: NonNullable<ChatMessage['filteredAgents']>[0]; index: number }) {
    return (
        <Card
            className="shadow-none border-0 !py-0 !gap-0 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            style={{
                backgroundColor: "#F3F4F6",
                animationDelay: `${index * 80}ms`
            }}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{agent.agent_name}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{agent.description}</p>
                    </div>
                    <Link href={`/agents/${agent.agent_id}`}>
                        <Button size="sm" variant="outline" className="ml-2 flex-shrink-0 shadow-none transition-all duration-200 hover:scale-105 hover:bg-gray-900 hover:text-white">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

// Suggested Agent Card
function SuggestedAgentCard({ agent, index }: { agent: NonNullable<ChatMessage['suggested_agents']>[0]; index: number }) {
    return (
        <Card
            className="shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-200 transition-all duration-300"
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{agent.solution_name}</h4>
                            <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                                {agent.segment}
                            </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{agent.description}</p>
                        {agent.trend_reference && (
                            <p className="text-xs text-gray-500 italic flex items-center gap-1">
                                <Zap className="h-3 w-3 text-purple-500" />
                                Related to: {agent.trend_reference}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Mega Trends Section
function MegaTrendsSection({ megaTrends }: { megaTrends: string }) {
    return (
        <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="mb-3">
                <h3 className="text-base font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    Mega Trends & Opportunities
                </h3>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown
                        components={{
                            h1: ({ children }: MarkdownComponentProps) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                            h2: ({ children }: MarkdownComponentProps) => <h2 className="text-base font-semibold mb-2 mt-3 first:mt-0">{children}</h2>,
                            h3: ({ children }: MarkdownComponentProps) => <h3 className="text-sm font-semibold mb-1 mt-2 first:mt-0">{children}</h3>,
                            p: ({ children }: MarkdownComponentProps) => <p className="mb-2 text-gray-700">{children}</p>,
                            ul: ({ children }: MarkdownComponentProps) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }: MarkdownComponentProps) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }: MarkdownComponentProps) => <li className="text-sm text-gray-700">{children}</li>,
                            strong: ({ children }: MarkdownComponentProps) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            em: ({ children }: MarkdownComponentProps) => <em className="italic">{children}</em>,
                        }}
                    >
                        {formatChatText(megaTrends)}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    )
}

export function ChatMessageBubble({ message, index, mode, sessionId }: ChatMessageBubbleProps) {
    const [copied, setCopied] = useState(false)
    const [reaction, setReaction] = useState<"up" | "down" | null>(null)
    const [showActions, setShowActions] = useState(false)
    const bubbleRef = useRef<HTMLDivElement>(null)

    const isUser = message.role === "user"
    const isThinking = message.text === "AI thinking..."

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(message.text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const handleReaction = (type: "up" | "down") => {
        setReaction(reaction === type ? null : type)
    }

    if (isThinking) {
        return null // Thinking indicator handled separately
    }

    return (
        <div
            className={`flex flex-col ${isUser ? "items-end" : "items-start"} ${isUser ? "user-message-enter" : "message-enter"
                }`}
            style={{ animationDelay: `${index * 40}ms` }}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="flex max-w-[85%] items-end gap-2">
                {/* Assistant Avatar */}
                {!isUser && (
                    <div className="relative mt-1 h-7 w-7 shrink-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center border border-purple-200 overflow-hidden">
                            <Image src="/chat_icon.png" alt="AI" fill className="object-contain p-1" />
                        </div>
                    </div>
                )}

                {/* Message Bubble */}
                <div
                    ref={bubbleRef}
                    className={`relative group ${isUser
                            ? "rounded-2xl rounded-br-md px-4 py-3 text-white shadow-sm"
                            : "rounded-2xl rounded-bl-md bg-white/80 backdrop-blur-sm px-4 py-3 text-gray-900 border border-gray-100 shadow-sm"
                        }`}
                    style={isUser ? {
                        background: "linear-gradient(135deg, #6853D5 0%, #8B5CF6 100%)"
                    } : undefined}
                >
                    {/* Content */}
                    {isUser ? (
                        <span className="text-sm leading-relaxed">{message.text}</span>
                    ) : (
                        <div className="text-sm leading-relaxed prose prose-sm max-w-none">
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }: MarkdownComponentProps) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                    h2: ({ children }: MarkdownComponentProps) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                                    h3: ({ children }: MarkdownComponentProps) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                                    p: ({ children }: MarkdownComponentProps) => <p className="mb-2 last:mb-0">{children}</p>,
                                    ul: ({ children }: MarkdownComponentProps) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                    ol: ({ children }: MarkdownComponentProps) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                    li: ({ children }: MarkdownComponentProps) => <li className="text-sm">{children}</li>,
                                    code: ({ children }: MarkdownComponentProps) => <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-purple-700">{children}</code>,
                                    pre: ({ children }: MarkdownComponentProps) => <pre className="bg-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto mb-2">{children}</pre>,
                                    blockquote: ({ children }: MarkdownComponentProps) => <blockquote className="border-l-4 border-purple-300 pl-3 italic mb-2 text-gray-600">{children}</blockquote>,
                                    strong: ({ children }: MarkdownComponentProps) => <strong className="font-semibold">{children}</strong>,
                                    em: ({ children }: MarkdownComponentProps) => <em className="italic">{children}</em>,
                                }}
                            >
                                {formatChatText(message.text)}
                            </ReactMarkdown>

                            {/* Mega Trends */}
                            {mode === "explore" && message.mega_trends && (
                                <MegaTrendsSection megaTrends={message.mega_trends} />
                            )}

                            {/* Suggested Agents */}
                            {mode === "explore" && message.suggested_agents && message.suggested_agents.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-purple-600" />
                                        Suggested Agents
                                    </h3>
                                    <div className="space-y-2">
                                        {message.suggested_agents.map((agent, i) => (
                                            <SuggestedAgentCard key={i} agent={agent} index={i} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Let's Build Buttons */}
                            {message.letsBuild && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                    <div className="flex flex-wrap gap-2">
                                        <Link href="/contact">
                                            <Button className="bg-gray-900 hover:bg-gray-800 text-white text-xs px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105">
                                                Contact Us
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={async () => {
                                                try {
                                                    const downloadUrl = message.brdDownloadUrl
                                                        ? `https://agents-store.onrender.com${message.brdDownloadUrl}`
                                                        : `https://agents-store.onrender.com/api/chat/download-brd`

                                                    const response = await fetch(downloadUrl, {
                                                        method: message.brdDownloadUrl ? 'GET' : 'POST',
                                                        headers: message.brdDownloadUrl ? {
                                                            'accept': 'application/json'
                                                        } : {
                                                            'Content-Type': 'application/json',
                                                        },
                                                        body: message.brdDownloadUrl ? undefined : JSON.stringify({
                                                            session_id: sessionId,
                                                            gathered_info: message.gatheredInfo || {}
                                                        })
                                                    })

                                                    if (!response.ok) throw new Error('Failed to download BRD')

                                                    const blob = await response.blob()
                                                    const url = window.URL.createObjectURL(blob)
                                                    const a = document.createElement('a')
                                                    a.href = url
                                                    a.download = `BRD_${sessionId}.docx`
                                                    document.body.appendChild(a)
                                                    a.click()
                                                    window.URL.revokeObjectURL(url)
                                                    document.body.removeChild(a)
                                                } catch (error) {
                                                    alert('Failed to download BRD document')
                                                }
                                            }}
                                            className="bg-white hover:bg-gray-50 text-gray-900 text-xs px-4 py-2 rounded-lg border border-gray-200 transition-all duration-200 hover:scale-105"
                                            disabled={!message.letsBuildTimestamp || (Date.now() - message.letsBuildTimestamp) < 10000}
                                        >
                                            Download BRD
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Filtered Agents */}
                            {message.filteredAgents && message.filteredAgents.length > 0 && (
                                <div className="mt-3 space-y-2">
                                    {message.filteredAgents.map((agent, i) => (
                                        <AgentCard key={`${agent.agent_id}-${i}`} agent={agent} index={i} />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Hover Actions */}
                    {!isUser && showActions && (
                        <div
                            className="absolute -bottom-8 left-0 flex items-center gap-1 bg-white rounded-lg shadow-md border border-gray-100 px-1 py-0.5 animate-in fade-in-0 zoom-in-95 duration-200"
                        >
                            <button
                                onClick={handleCopy}
                                className="p-1.5 rounded hover:bg-gray-100 transition-colors"
                                title="Copy message"
                            >
                                {copied ? (
                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                ) : (
                                    <Copy className="h-3.5 w-3.5 text-gray-500" />
                                )}
                            </button>
                            <button
                                onClick={() => handleReaction("up")}
                                className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${reaction === "up" ? "bg-green-50" : ""
                                    }`}
                                title="Helpful"
                            >
                                <ThumbsUp className={`h-3.5 w-3.5 ${reaction === "up" ? "text-green-500 fill-green-500" : "text-gray-500"}`} />
                            </button>
                            <button
                                onClick={() => handleReaction("down")}
                                className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${reaction === "down" ? "bg-red-50" : ""
                                    }`}
                                title="Not helpful"
                            >
                                <ThumbsDown className={`h-3.5 w-3.5 ${reaction === "down" ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Timestamp */}
            <span className={`text-[10px] text-gray-400 mt-1.5 ${isUser ? "mr-2" : "ml-9"}`}>
                {message.time}
            </span>
        </div>
    )
}

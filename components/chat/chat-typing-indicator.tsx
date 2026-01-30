"use client"

import { useState, useEffect } from "react"
import { Brain, Sparkles, Search, Zap, X } from "lucide-react"

interface ChatTypingIndicatorProps {
    mode?: "explore" | "create"
    onCancel?: () => void
    showCancel?: boolean
}

const thinkingStages = {
    explore: [
        { icon: Search, message: "Searching knowledge base...", duration: 1500 },
        { icon: Brain, message: "Analyzing your request...", duration: 1200 },
        { icon: Zap, message: "Processing results...", duration: 1000 },
        { icon: Sparkles, message: "Generating response...", duration: 800 },
    ],
    create: [
        { icon: Brain, message: "Understanding requirements...", duration: 1500 },
        { icon: Zap, message: "Gathering information...", duration: 1200 },
        { icon: Search, message: "Building solution...", duration: 1000 },
        { icon: Sparkles, message: "Preparing response...", duration: 800 },
    ],
}

export function ChatTypingIndicator({
    mode = "explore",
    onCancel,
    showCancel = false
}: ChatTypingIndicatorProps) {
    const [stageIndex, setStageIndex] = useState(0)
    const [progress, setProgress] = useState(0)

    const stages = thinkingStages[mode]
    const currentStage = stages[stageIndex]
    const IconComponent = currentStage.icon

    useEffect(() => {
        // Cycle through stages
        const stageInterval = setInterval(() => {
            setStageIndex((prev) => (prev + 1) % stages.length)
        }, currentStage.duration)

        return () => clearInterval(stageInterval)
    }, [stageIndex, stages.length, currentStage.duration])

    useEffect(() => {
        // Animate progress bar
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 0
                return prev + 2
            })
        }, 50)

        return () => clearInterval(progressInterval)
    }, [])

    return (
        <div className="typing-indicator-container animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
            <div className="relative overflow-hidden rounded-2xl">
                {/* Shimmer background */}
                <div className="absolute inset-0 shimmer-bg opacity-50" />

                {/* Main content */}
                <div className="relative flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl border border-purple-100/50">

                    {/* Animated Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-200/50">
                            <IconComponent className="h-5 w-5 text-white transition-all duration-300" />
                        </div>

                        {/* Pulse rings */}
                        <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-ping opacity-20" />
                        <div className="absolute inset-0 rounded-full border border-purple-300 animate-pulse opacity-40" />

                        {/* Sparkle accent */}
                        <div className="absolute -top-1 -right-1">
                            <Sparkles className="h-4 w-4 text-yellow-500 animate-bounce" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-gray-800">AI Assistant</span>
                            <WaveDots />
                        </div>

                        {/* Stage message */}
                        <p className="text-sm text-gray-600 truncate transition-all duration-300">
                            {currentStage.message}
                        </p>

                        {/* Progress bar */}
                        <div className="mt-2 h-1 w-full bg-gray-200/50 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Cancel button */}
                    {showCancel && onCancel && (
                        <button
                            onClick={onCancel}
                            className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/50 transition-all duration-200"
                            title="Cancel"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// Wave dots animation component
function WaveDots() {
    return (
        <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="w-1.5 h-1.5 bg-purple-400 rounded-full wave-dot"
                    style={{ animationDelay: `${i * 0.15}s` }}
                />
            ))}
        </div>
    )
}

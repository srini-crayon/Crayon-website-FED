"use client"

import { useMemo } from "react"
import { Check, X } from "lucide-react"

interface Requirement {
    id: string
    label: string
    met: boolean
}

interface PasswordStrengthIndicatorProps {
    score: number // 0-4
    requirements: Requirement[]
}

export function PasswordStrengthIndicator({ score, requirements }: PasswordStrengthIndicatorProps) {
    const strengthColor = useMemo(() => {
        if (score <= 1) return "bg-red-500"
        if (score === 2) return "bg-yellow-500"
        if (score === 3) return "bg-blue-500"
        return "bg-green-500"
    }, [score])

    const strengthLabel = useMemo(() => {
        if (score <= 1) return "Weak"
        if (score === 2) return "Fair"
        if (score === 3) return "Good"
        return "Strong"
    }, [score])

    // Calculate percentage for strength bar (25% per step)
    const strengthPercent = Math.max(5, (score / 4) * 100)

    return (
        <div className="space-y-4 mt-3">
            {/* Strength Bar */}
            <div className="space-y-1">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 font-medium">Password strength</span>
                    <span className={`font-semibold ${strengthColor.replace('bg-', 'text-')}`}>
                        {strengthLabel}
                    </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${strengthColor} transition-all duration-300 ease-out`}
                        style={{ width: `${strengthPercent}%` }}
                    />
                </div>
            </div>

            {/* Requirements List */}
            <ul className="space-y-1.5 pt-1">
                {requirements.map((req) => (
                    <li key={req.id} className="flex items-center gap-2 text-xs">
                        <div className={`
              flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0
              ${req.met ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}
            `}>
                            {req.met ? <Check className="w-2.5 h-2.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />}
                        </div>
                        <span className={req.met ? "text-gray-700" : "text-gray-500"}>
                            {req.label}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

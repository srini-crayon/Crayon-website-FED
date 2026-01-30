"use client"

import { useState } from "react"
import { useAuthStore } from "../../lib/store/auth.store"
import { validatePassword, getPasswordStrength, PASSWORD_REQUIREMENTS } from "../../lib/utils/password"
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator"
import { Eye, EyeOff } from "lucide-react"

export function PasswordChange() {
    const { changePassword, isLoading } = useAuthStore()

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)

    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null)

    const passwordValidation = validatePassword(newPassword)
    const passwordStrength = getPasswordStrength(newPassword)

    const requirements = PASSWORD_REQUIREMENTS.map(req => ({
        ...req,
        met: req.test(newPassword)
    }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)

        if (newPassword !== confirmPassword) {
            setMessage({ text: "New passwords do not match", type: 'error' })
            return
        }

        if (!passwordValidation.isValid) {
            setMessage({ text: "Please meet all password requirements", type: 'error' })
            return
        }

        const result = await changePassword(currentPassword, newPassword)

        if (result.success) {
            setMessage({ text: "Password changed successfully", type: 'success' })
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } else {
            setMessage({ text: result.message || "Failed to change password", type: 'error' })
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Change Password</h3>

            {message && (
                <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                        <input
                            type={showCurrent ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    {newPassword && (
                        <PasswordStrengthIndicator
                            score={passwordStrength}
                            requirements={requirements}
                        />
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500"
                        required
                    />
                </div>
            </div>

            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading || !currentPassword || !newPassword || !passwordValidation.isValid}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                    {isLoading ? "Updating..." : "Update Password"}
                </button>
            </div>
        </form>
    )
}

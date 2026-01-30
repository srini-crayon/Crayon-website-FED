"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Check, Eye, EyeOff } from "lucide-react"

interface MFASetupProps {
    provisioningUri: string
    secret: string
    onVerify: (code: string) => Promise<boolean>
    onCancel: () => void
}

export function MFASetup({ provisioningUri, secret, onVerify, onCancel }: MFASetupProps) {
    const [code, setCode] = useState("")
    const [isVerifying, setIsVerifying] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [showSecret, setShowSecret] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(secret)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (code.length !== 6) return

        setIsVerifying(true)
        setError(null)

        try {
            const success = await onVerify(code)
            if (!success) {
                setError("Invalid code. Please try again.")
            }
        } catch (err) {
            setError("Verification failed. Please try again.")
        } finally {
            setIsVerifying(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h3 className="font-bold text-lg text-gray-900">Set up Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">
                    Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
                </p>
            </div>

            <div className="flex justify-center p-4 bg-white rounded-lg border border-gray-200">
                <QRCodeSVG value={provisioningUri} size={180} />
            </div>

            <div className="space-y-4">
                <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600 font-medium">Or enter code manually</p>
                    <div className="flex items-center justify-center gap-2 p-2 bg-gray-50 rounded border border-gray-200 font-mono text-sm max-w-xs mx-auto">
                        <span>{showSecret ? secret : "••••••••••••••••"}</span>
                        <button
                            type="button"
                            onClick={() => setShowSecret(!showSecret)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="text-gray-400 hover:text-gray-600 ml-1"
                        >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-2 relative">
                        <label htmlFor="mfa-code" className="block text-sm font-medium text-gray-700">
                            Enter 6-digit verification code
                        </label>
                        <input
                            id="mfa-code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="000 000"
                            className="w-full px-4 py-2 text-center text-xl tracking-widest border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={code.length !== 6 || isVerifying}
                            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isVerifying ? "Verifying..." : "Verify & Enable"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

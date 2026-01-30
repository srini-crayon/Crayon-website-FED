export const PASSWORD_REQUIREMENTS = [
    { id: 'length', label: 'Minimum 12 characters', test: (p: string) => p.length >= 12 },
    { id: 'uppercase', label: 'At least 1 uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { id: 'lowercase', label: 'At least 1 lowercase letter', test: (p: string) => /[a-z]/.test(p) },
    { id: 'digit', label: 'At least 1 digit', test: (p: string) => /\d/.test(p) },
    { id: 'special', label: 'At least 1 special character', test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
]

export const validatePassword = (password: string): { isValid: boolean, errors: string[] } => {
    const errors: string[] = []

    PASSWORD_REQUIREMENTS.forEach(req => {
        if (!req.test(password)) {
            errors.push(req.label)
        }
    })

    return {
        isValid: errors.length === 0,
        errors
    }
}

export const getPasswordStrength = (password: string): number => {
    if (!password) return 0
    let score = 0

    // Length contribution (up to 2 points)
    if (password.length >= 8) score += 0.5
    if (password.length >= 12) score += 1.5

    // Complexity contribution (up to 2 points)
    if (/[A-Z]/.test(password)) score += 0.5
    if (/[a-z]/.test(password)) score += 0.5
    if (/\d/.test(password)) score += 0.5
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 0.5

    // Cap at 4
    return Math.min(4, score)
}

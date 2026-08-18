export type StrengthLevel = 'empty' | 'weak' | 'medium' | 'strong' | 'best'

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4
  level: StrengthLevel
  label: string
  canSubmit: boolean
}

export function scorePassword(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, level: 'empty', label: '', canSubmit: false }
  }

  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  const safeScore = score as 0 | 1 | 2 | 3 | 4

  if (safeScore <= 1) {
    return {
      score: safeScore,
      level: 'weak',
      label: password.length < 8
        ? 'Fraca — use 8+ caracteres'
        : 'Fraca — misture letras e números',
      canSubmit: false,
    }
  }

  if (safeScore === 2) {
    return {
      score: 2,
      level: 'medium',
      label: 'Média — misture letras e números',
      canSubmit: true,
    }
  }

  if (safeScore === 3) {
    return { score: 3, level: 'strong', label: 'Forte', canSubmit: true }
  }

  return { score: 4, level: 'best', label: 'Muito forte', canSubmit: true }
}

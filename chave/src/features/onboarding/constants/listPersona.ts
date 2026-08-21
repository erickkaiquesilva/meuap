import type { UserRole } from '@/features/auth/types/auth'
import { digitsOnly, isValidCnpj, isValidCpf, isValidPhone } from '@/shared/utils/brDocuments'

export const LIST_PERSONAS: {
  value: UserRole
  label: string
  hint: string
}[] = [
  {
    value: 'proprietario',
    label: 'Sou o dono do imóvel',
    hint: 'Proprietário pessoa física',
  },
  {
    value: 'corretor',
    label: 'Sou corretor',
    hint: 'Represento imóveis com CRECI PF',
  },
  {
    value: 'corretora',
    label: 'Sou uma corretora',
    hint: 'Imobiliária / CNPJ — mais dados',
  },
]

export const LIST_CITIES = ['Maringá', 'Sarandi'] as const

export { digitsOnly, isValidCnpj, isValidCpf, isValidPhone }

export function isValidOptionalUrl(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed) return true
  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

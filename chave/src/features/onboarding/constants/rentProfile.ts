import type { RentPurpose } from '@/features/auth/types/auth'

export const RENT_PURPOSES: { value: RentPurpose; label: string }[] = [
  { value: 'morar', label: 'Morar' },
  { value: 'trabalho', label: 'Trabalho / home office' },
  { value: 'estudos', label: 'Estudos' },
  { value: 'temporada', label: 'Temporada / curto prazo' },
  { value: 'outro', label: 'Outro' },
]

export const RENT_CITIES = ['Maringá', 'Sarandi'] as const

export const RENT_BUDGETS: { value: number | null; label: string }[] = [
  { value: 1500, label: 'R$ 1.500' },
  { value: 2500, label: 'R$ 2.500' },
  { value: 4000, label: 'R$ 4.000' },
  { value: null, label: 'Sem limite' },
]

export const RENT_BEDROOMS: { value: number; label: string }[] = [
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
]

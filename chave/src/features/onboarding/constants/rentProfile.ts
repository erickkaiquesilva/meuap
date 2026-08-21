import type { RentNearby, RentPurpose } from '@/features/auth/types/auth'

export const RENT_PURPOSES: { value: RentPurpose; label: string }[] = [
  { value: 'morar', label: 'Morar' },
  { value: 'trabalho', label: 'Trabalho / home office' },
  { value: 'estudos', label: 'Estudos' },
  { value: 'temporada', label: 'Temporada / curto prazo' },
  { value: 'outro', label: 'Outro' },
]

export const RENT_NEARBY: { value: RentNearby; label: string }[] = [
  { value: 'mercado', label: 'Mercado / supermercado' },
  { value: 'transporte', label: 'Transporte público' },
  { value: 'escola', label: 'Escola / universidade' },
  { value: 'parque', label: 'Parque / área verde' },
  { value: 'hospital', label: 'Hospital / clínica' },
  { value: 'farmacia', label: 'Farmácia' },
  { value: 'shopping', label: 'Shopping / comércio' },
]

export const RENT_CITIES = ['Maringá', 'Sarandi'] as const

export const RENT_BEDROOMS: { value: number; label: string }[] = [
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
]

export const RENT_SLIDER_MIN = 500
export const RENT_SLIDER_MAX = 10000
export const RENT_SLIDER_STEP = 100

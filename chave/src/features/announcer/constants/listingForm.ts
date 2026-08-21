import type { Property } from '@/shared/types/property'

export const LISTING_CITIES = ['Maringá', 'Sarandi'] as const

export const LISTING_NEIGHBORHOODS: Record<string, string[]> = {
  Maringá: [
    'Zona 7',
    'Centro',
    'Jardim Alvorada',
    'Jardim Universo',
    'Vila Operária',
    'Zona 01',
    'Zona 05',
  ],
  Sarandi: ['Centro', 'Jardim Morumbi', 'Parque das Nações', 'Vila Nova'],
}

export const LISTING_TYPES: { value: Property['type']; label: string }[] = [
  { value: 'apartment', label: 'Apartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'commercial', label: 'Comercial' },
]

export const LISTING_OPERATIONS: { value: Property['operation']; label: string }[] = [
  { value: 'rent', label: 'Alugar' },
  { value: 'sale', label: 'Vender' },
]

export const LISTING_AMENITIES = [
  'Mobiliado',
  'Aceita pet',
  'Varanda',
  'Piscina',
  'Academia',
  'Portaria 24h',
  'Elevador',
  'Churrasqueira',
] as const

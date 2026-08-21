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

/** Price slider ranges — ceiling high enough for any realistic listing */
export const LISTING_PRICE_MAX = 1_000_000_000

export const RENT_PRICE_MIN = 500
export const RENT_PRICE_MAX = LISTING_PRICE_MAX
export const RENT_PRICE_STEP = 100
export const RENT_PRICE_DEFAULT = 2_500

export const SALE_PRICE_MIN = 50_000
export const SALE_PRICE_MAX = LISTING_PRICE_MAX
export const SALE_PRICE_STEP = 1_000
export const SALE_PRICE_DEFAULT = 350_000

export const MAX_LISTING_PHOTOS = 6
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024

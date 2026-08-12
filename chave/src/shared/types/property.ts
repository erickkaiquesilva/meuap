export interface Property {
  id: string
  title: string
  type: 'apartment' | 'house' | 'commercial'
  operation: 'rent' | 'sale'
  price: number
  city: string
  neighborhood: string
  address: string
  bedrooms: number
  bathrooms: number
  parkingSpots: number
  area: number
  photos: string[]
  description: string
  featured: boolean
  badge?: 'Novo' | 'Exclusivo' | 'Abaixo do mercado'
  createdAt: string
  amenities: string[]
}

export interface PaginatedProperties {
  data: Property[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface SearchFilters {
  op?: 'rent' | 'sale'
  city?: string
  neighborhood?: string
  maxPrice?: string
  bedrooms?: string
  type?: string
  sort?: string
  page?: string
}

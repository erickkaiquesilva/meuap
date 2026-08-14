export interface Property {
  id: string
  title: string
  type: 'apartment' | 'house' | 'commercial'
  operation: 'rent' | 'sale'
  price: number
  /** Monthly costs breakdown — primarily for rental listings */
  iptu?: number
  fireInsurance?: number
  serviceFee?: number
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
  /** Optional coordinates from backend; mock scatters around city when absent */
  lat?: number
  lng?: number
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
  minPrice?: string
  bedrooms?: string
  bathrooms?: string
  parkingSpots?: string
  minArea?: string
  maxArea?: string
  /** Comma-separated amenity labels that must all be present */
  amenities?: string
  /**
   * Property type filter.
   * Special value `studio` = apartment with area ≤ 40 m² (kitnet/studio).
   */
  type?: string
  sort?: string
  page?: string
}

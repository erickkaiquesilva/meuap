import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient } from '@/core/api/client'
import {
  createMyListing,
  fetchMyListings,
  seedMyListings,
} from './announcerApi'
import type { CreateListingInput } from '../types/listings'

vi.mock('@/core/api/client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('@/core/api/config', () => ({
  isMock: true,
}))

const get = vi.mocked(apiClient.get)
const post = vi.mocked(apiClient.post)

const sampleListing = {
  id: 'listing-1',
  ownerId: 'user-1',
  status: 'pending' as const,
  title: 'Apartamento 2 Quartos — Zona 7',
  type: 'apartment' as const,
  operation: 'rent' as const,
  price: 1500,
  city: 'Maringá',
  neighborhood: 'Zona 7',
  address: 'Rua das Flores, 123',
  bedrooms: 2,
  bathrooms: 1,
  parkingSpots: 1,
  area: 62,
  description: 'Descrição com mais de vinte caracteres.',
  amenities: ['Varanda'],
  photos: [] as string[],
  featured: false,
  createdAt: '2026-01-01T00:00:00.000Z',
}

describe('announcerApi', () => {
  beforeEach(() => {
    get.mockReset()
    post.mockReset()
  })

  it('lista anúncios do anunciante em /api/me/listings', async () => {
    get.mockResolvedValue({ data: { data: [sampleListing] } })

    const result = await fetchMyListings()

    expect(get).toHaveBeenCalledWith('/api/me/listings')
    expect(result).toEqual([sampleListing])
  })

  it('cria anúncio via POST /api/me/listings e devolve o item', async () => {
    post.mockResolvedValue({ data: { data: sampleListing } })

    const payload: CreateListingInput = {
      title: sampleListing.title,
      type: sampleListing.type,
      operation: sampleListing.operation,
      price: sampleListing.price,
      city: sampleListing.city,
      neighborhood: sampleListing.neighborhood,
      address: sampleListing.address,
      bedrooms: sampleListing.bedrooms,
      bathrooms: sampleListing.bathrooms,
      parkingSpots: sampleListing.parkingSpots,
      area: sampleListing.area,
      description: sampleListing.description,
      amenities: sampleListing.amenities,
    }

    const result = await createMyListing(payload)

    expect(post).toHaveBeenCalledWith('/api/me/listings', payload)
    expect(result.id).toBe('listing-1')
    expect(result.status).toBe('pending')
  })

  it('seedMyListings só chama a API em modo mock', async () => {
    post.mockResolvedValue({ data: { data: [sampleListing] } })

    await seedMyListings('user-1', 3)

    expect(post).toHaveBeenCalledWith('/api/me/listings/seed', {
      ownerId: 'user-1',
      count: 3,
    })
  })
})

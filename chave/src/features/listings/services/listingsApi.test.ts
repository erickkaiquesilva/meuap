import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient } from '@/core/api/client'
import { fetchListings } from './listingsApi'

vi.mock('@/core/api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}))

const get = vi.mocked(apiClient.get)

describe('listingsApi', () => {
  beforeEach(() => {
    get.mockReset()
  })

  it('envia filtros de busca e limit no query string para /api/properties', async () => {
    get.mockResolvedValue({
      data: { data: [], total: 0, page: 1, limit: 12, totalPages: 0 },
    })

    await fetchListings(
      {
        op: 'rent',
        city: 'Maringá',
        neighborhood: 'Zona 7',
        type: 'apartment',
        maxPrice: '2000',
        bedrooms: '2',
        sort: 'price_asc',
        page: '1',
      },
      { limit: 12 },
    )

    expect(get).toHaveBeenCalledTimes(1)
    const url = String(get.mock.calls[0]?.[0])
    expect(url.startsWith('/api/properties?')).toBe(true)
    expect(url).toContain('op=rent')
    expect(url).toContain('city=Maring')
    expect(url).toContain('neighborhood=Zona')
    expect(url).toContain('type=apartment')
    expect(url).toContain('maxPrice=2000')
    expect(url).toContain('bedrooms=2')
    expect(url).toContain('sort=price_asc')
    expect(url).toContain('page=1')
    expect(url).toContain('limit=12')
  })

  it('retorna página vazia quando a resposta não traz data array', async () => {
    get.mockResolvedValue({ data: { message: 'html fallback' } })

    const result = await fetchListings({ city: 'Sarandi' })

    expect(result).toEqual({
      data: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
    })
  })
})

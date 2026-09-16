import { http, HttpResponse } from 'msw'
import type { MyListing } from '@/features/announcer/types/listings'

let queue: MyListing[] = []

export function resetAdminQueue(seed: MyListing[] = []) {
  queue = seed.map((item) => ({ ...item, status: 'pending' }))
}

export const adminHandlers = [
  http.get('/api/admin/listings', () => {
    return HttpResponse.json({
      data: queue.filter((item) => item.status === 'pending'),
    })
  }),

  http.post('/api/admin/listings/:id/approve', ({ params }) => {
    const id = String(params.id)
    const listing = queue.find((item) => item.id === id && item.status === 'pending')
    if (!listing) {
      return HttpResponse.json(
        { error: { code: 'Not Found', message: 'Anúncio não encontrado na fila de moderação' } },
        { status: 404 },
      )
    }
    listing.status = 'active'
    return HttpResponse.json({ data: listing }, { status: 201 })
  }),

  http.post('/api/admin/listings/:id/reject', async ({ params, request }) => {
    const id = String(params.id)
    const body = (await request.json()) as { reason?: string }
    const reason = body.reason?.trim() ?? ''
    if (reason.length < 3) {
      return HttpResponse.json(
        { error: { code: 'Bad Request', message: 'Informe o motivo da rejeição' } },
        { status: 400 },
      )
    }
    const listing = queue.find((item) => item.id === id && item.status === 'pending')
    if (!listing) {
      return HttpResponse.json(
        { error: { code: 'Not Found', message: 'Anúncio não encontrado na fila de moderação' } },
        { status: 404 },
      )
    }
    listing.status = 'rejected'
    return HttpResponse.json({ data: listing }, { status: 201 })
  }),
]

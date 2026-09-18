import { http, HttpResponse } from 'msw'

type VisitRow = {
  id: string
  listingId: string
  renterId: string
  slotStart: string
  slotEnd: string
  status: string
  createdAt: string
}

const booked = new Map<string, VisitRow>()

export function resetVisits() {
  booked.clear()
}

function slotKey(listingId: string, slotStart: string) {
  return `${listingId}::${slotStart}`
}

export const visitsHandlers = [
  http.post('/api/visits', async ({ request }) => {
    if (!request.headers.get('Authorization')) {
      return HttpResponse.json(
        { error: { code: 'Unauthorized', message: 'Não autenticado' } },
        { status: 401 },
      )
    }

    const body = (await request.json()) as {
      listingId?: string
      slotStart?: string
      slotEnd?: string
    }
    const listingId = body.listingId?.trim() ?? ''
    const slotStart = body.slotStart?.trim() ?? ''
    const slotEnd =
      body.slotEnd?.trim() ||
      new Date(new Date(slotStart).getTime() + 60 * 60 * 1000).toISOString()

    if (!listingId || !slotStart) {
      return HttpResponse.json(
        { error: { code: 'Bad Request', message: 'Dados inválidos' } },
        { status: 400 },
      )
    }

    const key = slotKey(listingId, slotStart)
    if (booked.has(key)) {
      return HttpResponse.json(
        {
          error: {
            code: 'SLOT_UNAVAILABLE',
            message: 'Horário indisponível — escolha outro',
          },
        },
        { status: 409 },
      )
    }

    const visit: VisitRow = {
      id: `visit-${booked.size + 1}`,
      listingId,
      renterId: 'user-001',
      slotStart,
      slotEnd,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    booked.set(key, visit)
    return HttpResponse.json({ data: visit }, { status: 201 })
  }),
]

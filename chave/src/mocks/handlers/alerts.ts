import { http, HttpResponse } from 'msw'
import type { AlertChannel, SearchAlert } from '@/features/listings/api/alertsTypes'

let alerts: SearchAlert[] = []
let seq = 1

export function resetAlerts(seed: SearchAlert[] = []) {
  alerts = seed.map((a) => ({ ...a, channels: [...a.channels] }))
  seq = seed.length + 1
}

function requireAuth(request: Request) {
  return Boolean(request.headers.get('Authorization'))
}

export const alertsHandlers = [
  http.get('/api/me/alerts', ({ request }) => {
    if (!requireAuth(request)) {
      return HttpResponse.json(
        { error: { code: 'Unauthorized', message: 'Não autenticado' } },
        { status: 401 },
      )
    }
    return HttpResponse.json({ data: alerts })
  }),

  http.post('/api/me/alerts', async ({ request }) => {
    if (!requireAuth(request)) {
      return HttpResponse.json(
        { error: { code: 'Unauthorized', message: 'Não autenticado' } },
        { status: 401 },
      )
    }
    const body = (await request.json()) as {
      filters?: Record<string, unknown>
      channels?: AlertChannel[]
    }
    const channels = body.channels ?? []
    if (channels.length === 0) {
      return HttpResponse.json(
        { error: { code: 'Bad Request', message: 'Informe ao menos um canal' } },
        { status: 400 },
      )
    }
    const created: SearchAlert = {
      id: `alert-${seq++}`,
      filters: body.filters ?? {},
      channels,
      active: true,
      createdAt: new Date().toISOString(),
    }
    alerts = [created, ...alerts]
    return HttpResponse.json({ data: created }, { status: 201 })
  }),

  http.patch('/api/me/alerts/:id/disable', ({ request, params }) => {
    if (!requireAuth(request)) {
      return HttpResponse.json(
        { error: { code: 'Unauthorized', message: 'Não autenticado' } },
        { status: 401 },
      )
    }
    const id = String(params.id)
    const idx = alerts.findIndex((a) => a.id === id)
    if (idx < 0) {
      return HttpResponse.json(
        { error: { code: 'Not Found', message: 'Alerta não encontrado' } },
        { status: 404 },
      )
    }
    const updated = { ...alerts[idx], active: false }
    alerts = [...alerts.slice(0, idx), updated, ...alerts.slice(idx + 1)]
    return HttpResponse.json({ data: updated })
  }),
]

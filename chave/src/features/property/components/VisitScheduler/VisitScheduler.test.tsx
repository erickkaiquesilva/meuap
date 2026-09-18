import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/features/auth/context/AuthContext'
import { clearAuthToken, setAuthToken } from '@/core/api/tokenStorage'
import { resetAuthSession } from '@/mocks/handlers/auth'
import { resetVisits } from '@/mocks/handlers/visits'
import type { Property } from '@/shared/types/property'
import { createVisit } from '../../api/visitsApi'
import { buildAvailableSlots } from '../../utils/visitSlots'
import { VisitScheduler } from './VisitScheduler'

const property: Property = {
  id: '1',
  title: 'Apartamento 2 Quartos com Varanda — Zona 7',
  type: 'apartment',
  operation: 'rent',
  price: 1200,
  city: 'Maringá',
  neighborhood: 'Zona 7',
  address: 'Rua das Flores, 123',
  bedrooms: 2,
  bathrooms: 1,
  parkingSpots: 1,
  area: 62,
  photos: [],
  description: 'Descrição',
  featured: true,
  createdAt: '2025-07-01',
  amenities: [],
  visitMode: 'weekdays',
  visitSchedule: { weekdays: true, startHour: 9, endHour: 18 },
}

function renderScheduler(open = true) {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const onClose = vi.fn()
  const router = createMemoryRouter(
    [
      { path: 'entrar', element: <div>Login page</div> },
      {
        path: 'imoveis/:id',
        element: (
          <VisitScheduler property={property} open={open} onClose={onClose} />
        ),
      },
    ],
    { initialEntries: ['/imoveis/1'] },
  )

  return {
    onClose,
    router,
    ...render(
      <QueryClientProvider client={qc}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>,
    ),
  }
}

describe('buildAvailableSlots', () => {
  it('builds weekday hour slots and skips weekends', () => {
    const slots = buildAvailableSlots({
      visitMode: 'weekdays',
      visitSchedule: { weekdays: true, startHour: 14, endHour: 16 },
      from: new Date('2026-09-16T10:00:00.000Z'),
      days: 4,
      limit: 20,
    })
    expect(slots.length).toBeGreaterThan(0)
    expect(slots.some((s) => s.slotStart.startsWith('2026-09-17T14'))).toBe(true)
    expect(slots.some((s) => s.slotStart.startsWith('2026-09-19'))).toBe(false)
  })
})

describe('VisitScheduler', () => {
  beforeEach(() => {
    clearAuthToken()
    resetAuthSession()
    resetVisits()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.setSystemTime(new Date('2026-09-16T10:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('redirects unauthenticated users to login when confirming', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const { router } = renderScheduler(true)

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Agendar visita' })).toBeInTheDocument()
    })

    const radios = screen.getAllByRole('radio')
    await user.click(radios[0]!)
    await user.click(screen.getByRole('button', { name: 'Confirmar visita' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/entrar')
      expect(router.state.location.search).toContain('redirect=')
    })
  })

  it('books an available slot for an authenticated renter', async () => {
    setAuthToken('mock-jwt-token-dev-only')
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderScheduler(true)

    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: 'Agendar visita' })).toBeInTheDocument()
    })

    const radios = await screen.findAllByRole('radio')
    await user.click(radios[0]!)
    await user.click(screen.getByRole('button', { name: 'Confirmar visita' }))

    expect(
      await screen.findByRole('status'),
    ).toHaveTextContent(/Visita solicitada/i)
  })

  it('shows horário indisponível when the API returns 409', async () => {
    setAuthToken('mock-jwt-token-dev-only')
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    const slots = buildAvailableSlots({
      visitMode: 'weekdays',
      visitSchedule: { weekdays: true, startHour: 9, endHour: 18 },
      from: new Date('2026-09-16T10:00:00.000Z'),
    })
    const first = slots[0]!
    await createVisit({
      listingId: property.id,
      slotStart: first.slotStart,
      slotEnd: first.slotEnd,
    })

    renderScheduler(true)
    const radios = await screen.findAllByRole('radio')
    const match = radios.find(
      (radio) => (radio as HTMLInputElement).value === first.id,
    )
    expect(match).toBeTruthy()
    await user.click(match!)
    await user.click(screen.getByRole('button', { name: 'Confirmar visita' }))

    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(/Horário indisponível/i)
  })
})

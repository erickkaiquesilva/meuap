import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { AdminQueuePage } from './AdminQueuePage'
import { resetAdminQueue } from '@/mocks/handlers/admin'
import type { MyListing } from '@/features/announcer/types/listings'

function pending(id: string, title: string): MyListing {
  return {
    id,
    ownerId: 'owner-1',
    status: 'pending',
    title,
    type: 'apartment',
    operation: 'rent',
    price: 1500,
    city: 'Maringá',
    neighborhood: 'Zona 7',
    address: 'Rua A, 1',
    bedrooms: 2,
    bathrooms: 1,
    parkingSpots: 1,
    area: 60,
    photos: [],
    description: 'Descrição com mais de vinte caracteres.',
    featured: false,
    createdAt: '2026-09-01',
    amenities: ['Varanda'],
  }
}

function renderPage() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <AdminQueuePage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('AdminQueuePage', () => {
  beforeEach(() => {
    resetAdminQueue([])
  })

  it('renders pending listings with approve and reject actions', async () => {
    resetAdminQueue([pending('l1', 'Apartamento Zona 7')])
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Apartamento Zona 7' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Aprovar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Rejeitar' })).toBeInTheDocument()
  })

  it('removes a listing from the queue after approve', async () => {
    resetAdminQueue([pending('l1', 'Apartamento Zona 7')])
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Aprovar' }))

    await waitFor(() => {
      expect(screen.getByText('Nenhum anúncio na fila.')).toBeInTheDocument()
    })
    expect(screen.queryByRole('heading', { name: 'Apartamento Zona 7' })).not.toBeInTheDocument()
  })

  it('asks for a reject reason and keeps the listing when the reason is too short', async () => {
    resetAdminQueue([pending('l1', 'Apartamento Zona 7')])
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Rejeitar' }))
    expect(screen.getByRole('dialog', { name: 'Motivo da rejeição' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Confirmar rejeição' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Descreva o motivo')
    expect(screen.getByRole('heading', { name: 'Apartamento Zona 7' })).toBeInTheDocument()
  })

  it('removes a listing after the reject modal captures a reason', async () => {
    resetAdminQueue([pending('l1', 'Apartamento Zona 7')])
    const user = userEvent.setup()
    renderPage()

    await user.click(await screen.findByRole('button', { name: 'Rejeitar' }))
    const reason = screen.getByPlaceholderText('Ex.: fotos insuficientes')
    await user.click(reason)
    await user.type(reason, 'Fotos insuficientes')
    await user.click(screen.getByRole('button', { name: 'Confirmar rejeição' }))

    await waitFor(() => {
      expect(screen.getByText('Nenhum anúncio na fila.')).toBeInTheDocument()
    })
  })
})

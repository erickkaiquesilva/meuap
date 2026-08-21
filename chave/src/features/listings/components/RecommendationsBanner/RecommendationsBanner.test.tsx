import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecommendationsBanner } from './RecommendationsBanner'
import type { RentProfile } from '@/features/auth/types/auth'
import { clearRecommendationsCtaDismiss, isRecommendationsCtaDismissed } from '../../utils/recommendations'

const profile: RentProfile = {
  purpose: 'morar',
  city: 'Maringá',
  maxRent: 4000,
  minBedrooms: 3,
  nearby: ['parque'],
  condoIncluded: false,
  wantsParking: true,
  wantRecommendations: false,
}

describe('RecommendationsBanner', () => {
  beforeEach(() => {
    clearRecommendationsCtaDismiss()
  })

  it('applies filters and accepts on Sim', async () => {
    const user = userEvent.setup()
    const onApplyFilters = vi.fn()
    const onAccept = vi.fn().mockResolvedValue(undefined)
    const onDecline = vi.fn().mockResolvedValue(undefined)

    render(
      <RecommendationsBanner
        profile={profile}
        onApplyFilters={onApplyFilters}
        onAccept={onAccept}
        onDecline={onDecline}
      />,
    )

    expect(screen.getByText(/Quer que recomende a você imóveis/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Sim, recomendar' }))

    await waitFor(() => {
      expect(onAccept).toHaveBeenCalled()
      expect(onApplyFilters).toHaveBeenCalledWith({
        op: 'rent',
        city: 'Maringá',
        maxPrice: '4000',
        bedrooms: '3',
        parkingSpots: '1',
      })
    })
    expect(screen.queryByText(/Quer que recomende a você imóveis/i)).not.toBeInTheDocument()
  })

  it('dismisses for the session on Agora não', async () => {
    const user = userEvent.setup()
    const onApplyFilters = vi.fn()
    const onAccept = vi.fn().mockResolvedValue(undefined)
    const onDecline = vi.fn().mockResolvedValue(undefined)

    render(
      <RecommendationsBanner
        profile={profile}
        onApplyFilters={onApplyFilters}
        onAccept={onAccept}
        onDecline={onDecline}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Agora não' }))

    await waitFor(() => {
      expect(onDecline).toHaveBeenCalled()
    })
    expect(onApplyFilters).not.toHaveBeenCalled()
    expect(isRecommendationsCtaDismissed()).toBe(true)
    expect(screen.queryByText(/Quer que recomende a você imóveis/i)).not.toBeInTheDocument()
  })
})

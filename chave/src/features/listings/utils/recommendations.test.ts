import { describe, it, expect, beforeEach } from 'vitest'
import {
  clearRecommendationsCtaDismiss,
  dismissRecommendationsCta,
  filtersFromRentProfile,
  isRecommendationsCtaDismissed,
  shouldShowRecommendationsCta,
} from './recommendations'
import type { User } from '@/features/auth/types/auth'

function rentUser(partial: Partial<User> = {}): User {
  return {
    id: 'u1',
    name: 'Ana',
    email: 'ana@chave.com.br',
    goal: 'rent',
    role: null,
    onboardingComplete: true,
    rentProfile: {
      purpose: 'morar',
      city: 'Sarandi',
      maxRent: 2500,
      minBedrooms: 2,
      wantRecommendations: false,
    },
    listProfile: null,
    ...partial,
  }
}

describe('recommendations helpers', () => {
  beforeEach(() => {
    clearRecommendationsCtaDismiss()
  })

  it('shows CTA only for complete rent profiles that have not accepted', () => {
    expect(shouldShowRecommendationsCta(null)).toBe(false)
    expect(shouldShowRecommendationsCta(rentUser({ goal: 'list', rentProfile: null }))).toBe(false)
    expect(shouldShowRecommendationsCta(rentUser({ rentProfile: null }))).toBe(false)
    expect(shouldShowRecommendationsCta(rentUser())).toBe(true)
    expect(
      shouldShowRecommendationsCta(
        rentUser({
          rentProfile: {
            purpose: 'morar',
            city: 'Maringá',
            maxRent: null,
            minBedrooms: 1,
            wantRecommendations: true,
          },
        }),
      ),
    ).toBe(false)
  })

  it('maps rent profile to listing filters', () => {
    expect(filtersFromRentProfile(rentUser().rentProfile!)).toEqual({
      op: 'rent',
      city: 'Sarandi',
      maxPrice: '2500',
      bedrooms: '2',
    })
    expect(
      filtersFromRentProfile({
        purpose: 'estudos',
        city: 'Maringá',
        maxRent: null,
        minBedrooms: null,
        wantRecommendations: false,
      }),
    ).toEqual({
      op: 'rent',
      city: 'Maringá',
      maxPrice: undefined,
      bedrooms: undefined,
    })
  })

  it('tracks session dismiss', () => {
    expect(isRecommendationsCtaDismissed()).toBe(false)
    dismissRecommendationsCta()
    expect(isRecommendationsCtaDismissed()).toBe(true)
  })
})

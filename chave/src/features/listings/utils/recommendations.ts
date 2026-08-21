import type { RentProfile, User } from '@/features/auth/types/auth'
import type { SearchFilters } from '@/shared/types/property'

const DISMISS_KEY = 'chave:rec-cta-dismissed'

export function shouldShowRecommendationsCta(user: User | null): boolean {
  return (
    !!user
    && user.goal === 'rent'
    && user.onboardingComplete
    && !!user.rentProfile
    && !user.rentProfile.wantRecommendations
  )
}

export function filtersFromRentProfile(profile: RentProfile): Partial<SearchFilters> {
  return {
    op: 'rent',
    city: profile.city,
    maxPrice: profile.maxRent != null ? String(profile.maxRent) : undefined,
    bedrooms: profile.minBedrooms != null ? String(profile.minBedrooms) : undefined,
  }
}

export function isRecommendationsCtaDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1'
  } catch {
    return false
  }
}

export function dismissRecommendationsCta(): void {
  try {
    sessionStorage.setItem(DISMISS_KEY, '1')
  } catch {
    // ignore quota / private mode
  }
}

export function clearRecommendationsCtaDismiss(): void {
  try {
    sessionStorage.removeItem(DISMISS_KEY)
  } catch {
    // ignore
  }
}

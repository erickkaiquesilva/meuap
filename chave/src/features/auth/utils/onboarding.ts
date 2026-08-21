import type { UserGoal } from '../types/auth'

export function onboardingPathForGoal(goal: UserGoal): string {
  return goal === 'list' ? '/onboarding/anunciar' : '/onboarding/alugar'
}

export function needsOnboarding(user: {
  onboardingComplete: boolean
  goal: UserGoal | null
} | null): boolean {
  return !!user && !user.onboardingComplete && !!user.goal
}

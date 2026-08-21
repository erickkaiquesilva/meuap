import { describe, it, expect } from 'vitest'
import { needsOnboarding, onboardingPathForGoal } from './onboarding'

describe('onboarding helpers', () => {
  it('maps goals to routes', () => {
    expect(onboardingPathForGoal('rent')).toBe('/onboarding/alugar')
    expect(onboardingPathForGoal('list')).toBe('/onboarding/anunciar')
  })

  it('requires onboarding only when incomplete with a goal', () => {
    expect(needsOnboarding(null)).toBe(false)
    expect(needsOnboarding({ onboardingComplete: true, goal: 'rent' })).toBe(false)
    expect(needsOnboarding({ onboardingComplete: false, goal: null })).toBe(false)
    expect(needsOnboarding({ onboardingComplete: false, goal: 'list' })).toBe(true)
  })
})

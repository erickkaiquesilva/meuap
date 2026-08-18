import { describe, it, expect } from 'vitest'
import { scorePassword } from './passwordStrength'

describe('scorePassword', () => {
  it('rejects empty and short passwords', () => {
    expect(scorePassword('').canSubmit).toBe(false)
    expect(scorePassword('').level).toBe('empty')
    expect(scorePassword('abc').level).toBe('weak')
    expect(scorePassword('abcdefgh').canSubmit).toBe(false)
  })

  it('accepts medium strength (8+ and mixed case or a number)', () => {
    expect(scorePassword('Abcdefgh').canSubmit).toBe(true)
    expect(scorePassword('Abcdefgh').level).toBe('medium')
    expect(scorePassword('abcdefgh1').canSubmit).toBe(true)
    expect(scorePassword('abcdefgh1').level).toBe('medium')
  })

  it('scores strong and very strong', () => {
    expect(scorePassword('Abcdefg1').level).toBe('strong')
    expect(scorePassword('Abcdefg1!').level).toBe('best')
    expect(scorePassword('Abcdefg1!').canSubmit).toBe(true)
  })
})

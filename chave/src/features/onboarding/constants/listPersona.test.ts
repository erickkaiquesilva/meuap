import { describe, it, expect } from 'vitest'
import {
  digitsOnly,
  isValidCnpjFormat,
  isValidOptionalUrl,
  isValidPhone,
} from './listPersona'

describe('listPersona validators', () => {
  it('validates phone digits', () => {
    expect(isValidPhone('(44) 99999-9999')).toBe(true)
    expect(isValidPhone('4499999999')).toBe(true)
    expect(isValidPhone('123')).toBe(false)
  })

  it('validates CNPJ length', () => {
    expect(isValidCnpjFormat('12.345.678/0001-90')).toBe(true)
    expect(digitsOnly('12.345.678/0001-90')).toHaveLength(14)
    expect(isValidCnpjFormat('123')).toBe(false)
  })

  it('allows empty or http(s) URLs', () => {
    expect(isValidOptionalUrl('')).toBe(true)
    expect(isValidOptionalUrl('https://chave.com.br')).toBe(true)
    expect(isValidOptionalUrl('chave.com.br')).toBe(true)
    expect(isValidOptionalUrl('not a url')).toBe(false)
  })
})

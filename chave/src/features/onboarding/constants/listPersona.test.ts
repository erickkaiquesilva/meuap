import { describe, it, expect } from 'vitest'
import {
  digitsOnly,
  isValidCnpj,
  isValidOptionalUrl,
  isValidPhone,
} from './listPersona'

describe('listPersona validators', () => {
  it('validates phone digits', () => {
    expect(isValidPhone('(44) 99999-9999')).toBe(true)
    expect(isValidPhone('4499999999')).toBe(true)
    expect(isValidPhone('123')).toBe(false)
  })

  it('validates CNPJ check digits', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true)
    expect(digitsOnly('11.222.333/0001-81')).toHaveLength(14)
    expect(isValidCnpj('12.345.678/0001-90')).toBe(false)
  })

  it('allows empty or http(s) URLs', () => {
    expect(isValidOptionalUrl('')).toBe(true)
    expect(isValidOptionalUrl('https://chave.com.br')).toBe(true)
    expect(isValidOptionalUrl('chave.com.br')).toBe(true)
    expect(isValidOptionalUrl('not a url')).toBe(false)
  })
})

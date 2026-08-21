import { describe, it, expect } from 'vitest'
import { isValidCnpj, isValidCpf, isValidPhone } from './brDocuments'
import { maskCnpj, maskCpf, maskPhone } from './brMasks'

describe('brDocuments', () => {
  it('validates phones with DDD', () => {
    expect(isValidPhone('(44) 99999-9999')).toBe(true)
    expect(isValidPhone('(44) 3222-3344')).toBe(true)
    expect(isValidPhone('123')).toBe(false)
    expect(isValidPhone('(44) 89999-9999')).toBe(false)
  })

  it('validates CPF check digits', () => {
    expect(isValidCpf('390.533.447-05')).toBe(true)
    expect(isValidCpf('111.111.111-11')).toBe(false)
    expect(isValidCpf('390.533.447-00')).toBe(false)
  })

  it('validates CNPJ check digits', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true)
    expect(isValidCnpj('11.111.111/1111-11')).toBe(false)
    expect(isValidCnpj('11.222.333/0001-00')).toBe(false)
  })
})

describe('brMasks', () => {
  it('masks phone, CPF and CNPJ', () => {
    expect(maskPhone('44999999999')).toBe('(44) 99999-9999')
    expect(maskCpf('39053344705')).toBe('390.533.447-05')
    expect(maskCnpj('11222333000181')).toBe('11.222.333/0001-81')
  })
})

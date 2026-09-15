import { describe, it, expect } from 'vitest'
import axios from 'axios'
import { getApiErrorCode, getApiErrorMessage } from './errors'

describe('getApiErrorMessage', () => {
  it('lê envelope Nest { error: { message } }', () => {
    const err = new axios.AxiosError('Request failed')
    err.response = {
      data: { error: { code: 'LISTING_LIMIT_REACHED', message: 'Limite de 3 anúncios' } },
      status: 403,
      statusText: 'Forbidden',
      headers: {},
      config: { headers: new axios.AxiosHeaders() },
    }

    expect(getApiErrorMessage(err, 'fallback')).toBe('Limite de 3 anúncios')
    expect(getApiErrorCode(err)).toBe('LISTING_LIMIT_REACHED')
  })

  it('usa fallback quando não há envelope', () => {
    expect(getApiErrorMessage(new Error('x'), 'Não foi possível publicar')).toBe(
      'Não foi possível publicar',
    )
  })
})

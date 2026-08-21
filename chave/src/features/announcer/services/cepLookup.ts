import { digitsOnly } from '@/shared/utils/brDocuments'

export interface CepAddress {
  street: string
  neighborhood: string
  city: string
  state: string
}

interface ViaCepResponse {
  erro?: boolean | string
  logradouro?: string
  bairro?: string
  localidade?: string
  uf?: string
}

/** Lookup Brazilian address by CEP via ViaCEP. Returns null when invalid/not found. */
export async function lookupCep(cep: string): Promise<CepAddress | null> {
  const digits = digitsOnly(cep)
  if (digits.length !== 8) return null

  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
  if (!res.ok) return null

  const data = (await res.json()) as ViaCepResponse
  if (data.erro) return null

  return {
    street: (data.logradouro ?? '').trim(),
    neighborhood: (data.bairro ?? '').trim(),
    city: (data.localidade ?? '').trim(),
    state: (data.uf ?? '').trim().toUpperCase(),
  }
}

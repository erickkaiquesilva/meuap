import { waNumber } from '@/core/api/config'

export function buildWhatsAppUrl(message: string): string {
  const number = waNumber.replace(/\D/g, '')
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

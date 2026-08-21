import type { Property } from '@/shared/types/property'

export type DeleteListingReason =
  | 'other_channel'
  | 'gave_up'
  | 'duplicate_error'
  | 'outdated'
  | 'other'

export const DELETE_LISTING_REASONS: { value: DeleteListingReason; label: string }[] = [
  { value: 'other_channel', label: 'Aluguei / vendi por outro canal' },
  { value: 'gave_up', label: 'Desisti de anunciar' },
  { value: 'duplicate_error', label: 'Anúncio duplicado ou com erro' },
  { value: 'outdated', label: 'Dados ou preço desatualizados' },
  { value: 'other', label: 'Outro' },
]

export interface MyListing extends Property {
  ownerId: string
  status: 'active' | 'paused'
}

export interface DeleteListingPayload {
  reason: DeleteListingReason
}

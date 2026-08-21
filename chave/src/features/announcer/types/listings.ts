import type { Property } from '@/shared/types/property'

export type DeleteListingReason =
  | 'other_channel'
  | 'gave_up'
  | 'duplicate_error'
  | 'outdated'
  | 'other'

/** Channels commonly used in Paraná (avoid naming direct marketplace competitors). */
export type OtherListingChannel =
  | 'olx'
  | 'facebook_instagram'
  | 'whatsapp'
  | 'external_broker'
  | 'street_sign'
  | 'other'

export const DELETE_LISTING_REASONS: { value: DeleteListingReason; label: string }[] = [
  { value: 'other_channel', label: 'Aluguei / vendi por outro canal' },
  { value: 'gave_up', label: 'Desisti de anunciar' },
  { value: 'duplicate_error', label: 'Anúncio duplicado ou com erro' },
  { value: 'outdated', label: 'Dados ou preço desatualizados' },
  { value: 'other', label: 'Outro' },
]

export const OTHER_LISTING_CHANNELS: { value: OtherListingChannel; label: string }[] = [
  { value: 'olx', label: 'OLX' },
  { value: 'facebook_instagram', label: 'Facebook / Instagram' },
  { value: 'whatsapp', label: 'WhatsApp / grupos locais' },
  { value: 'external_broker', label: 'Corretor ou imobiliária externa' },
  { value: 'street_sign', label: 'Placa na rua / indicação' },
  { value: 'other', label: 'Outro canal' },
]

export interface MyListing extends Property {
  ownerId: string
  status: 'active' | 'paused'
}

export interface CreateListingInput {
  title: string
  type: Property['type']
  operation: Property['operation']
  price: number
  city: string
  neighborhood: string
  address: string
  bedrooms: number
  bathrooms: number
  parkingSpots: number
  area: number
  description: string
  amenities: string[]
  /**
   * Photo data URLs or remote URLs.
   * Mock generates a placeholder when empty.
   */
  photos?: string[]
}

export type UpdateListingInput = CreateListingInput

export interface DeleteListingPayload {
  reason: DeleteListingReason
  /** Required when reason is `other` */
  otherDetail?: string
  /** Required when reason is `other_channel` */
  otherChannel?: OtherListingChannel
  /** Required when otherChannel is `other` */
  otherChannelDetail?: string
}

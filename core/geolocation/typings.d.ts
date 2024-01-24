import type { GeolocationGeoJSON } from '@holi/core/types'

export interface Place {
  id: string
  name: string
  city?: string
  state?: string
  country: string
  coordinates?: GeolocationPoint
}

export interface PlaceDetails {
  id: string
  name: string
  geolocation: GeolocationGeoJSON
}

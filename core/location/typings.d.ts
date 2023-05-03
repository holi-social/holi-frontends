import type { GeolocationGeometry } from '@holi/core/types'

export interface Place {
  id: string
  name: string
  city?: string
  coordinates?: GeolocationPoint
}

export interface PlaceDetails {
  id: string
  name: string
  geometry: GeolocationGeometry
}

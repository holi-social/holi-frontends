import { GeolocationMultiPolygon } from '@holi/core/types'

export interface Place {
  id: string
  name: string
  city?: string
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface PlaceDetails {
  id: string
  boundaries?: {
    coordinates: GeolocationMultiPolygon
  }
}

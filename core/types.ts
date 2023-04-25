import { Space } from '@holi/core/screens/spaces/types'

export interface Paged<T> {
  totalResults: number
  data: T[]
}

export type MemberSpaces = Paged<Pick<Space, 'id' | 'name' | 'title' | 'cover' | 'members'>>

export interface GeolocationPoint {
  latitude: number
  longitude: number
}

type PolygonPoint = number[] // Latitude and longitude
type LinearRing = PolygonPoint[]
type Polygon = LinearRing[] // External and internal coordinates
export type GeolocationMultiPolygon = Polygon[]

export interface GeolocationBoundaries {
  boundaries: GeolocationMultiPolygon
}

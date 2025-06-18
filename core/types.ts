import type { Space } from '@holi/api/graphql/graphql-codegen'

export interface Paged<T> {
  totalResults: number
  data: readonly T[]
}

export type SpaceForMember = Pick<
  Space,
  'id' | 'name' | 'title' | 'avatar' | 'avatarBlurhash' | 'cover' | 'coverBlurhash' | 'members' | 'avatarDefaultColor'
>

export type MemberSpaces = Paged<SpaceForMember>

export interface GeolocationPoint {
  latitude: number
  longitude: number
}

export interface GeolocationGeometry {
  type: string
  coordinates: number[] | number[][] | number[][][] | number[][][][]
}

export interface GeolocationGeoJSON {
  place_id: string
  properties: {
    formatted: string
    lat: number
    lon: number
  }
  geometry: GeolocationGeometry
}

export interface LocationDetails {
  completeAddress: string
  city?: string
  state?: string | null
  country?: string
  geolocation: GeolocationPoint
}

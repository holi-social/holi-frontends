import { Space } from '@holi/core/screens/spaces/types'

export interface Paged<T> {
  totalResults: number
  data: T[]
}

export type MemberSpaces = Paged<
  Pick<Space, 'id' | 'name' | 'title' | 'avatar' | 'avatarBlurhash' | 'cover' | 'coverBlurhash' | 'members'>
>

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
  }
  geometry: GeolocationGeometry
}

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

export type GeolocationGeometry = object // TODO(SF) rename to feature?

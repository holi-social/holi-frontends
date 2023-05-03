import { Space } from '@holi/core/screens/spaces/types'

export interface Paged<T> {
  totalResults: number
  data: T[]
}

export type MemberSpaces = Paged<Pick<Space, 'id' | 'name' | 'title' | 'cover' | 'members'>>

export interface Geolocation {
  latitude: number
  longitude: number
}

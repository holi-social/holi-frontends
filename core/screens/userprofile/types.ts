import { GeolocationBoundaries } from '@holi/core/types'

export interface Term {
  id: string
  title: string
  slug: string
}

export type SortedTerm = Term & { number?: number }

export type Topic = Term & {
  isDiscoverSpacesDefault: boolean
}
export type SDG = Term & {
  number: number
}
export type Skill = Term

export const termsByTitleComparator = (a: Term, b: Term) => a.title.localeCompare(b.title)
export const termsBySortNumberComparator = (a: SortedTerm, b: SortedTerm) => (a.number || 0) - (b.number || 0)

export interface User {
  id: string
  avatarLabel: string
  avatarDefaultColor: string
  avatar?: string
  firstName?: string
  lastName?: string
  fullName: string
  aboutMe?: string
  pronouns?: string
  location?: string
  geolocation?: GeolocationBoundaries
  engagementLevel?: string
  interests?: Topic[]
  sdgs?: SDG[]
  skills?: Skill[]
  connectionStatusToMyself?: UserConnectionStatus
}

export enum UserConnectionStatus {
  NOT_CONNECTED = 'NOT_CONNECTED',
  CONNECTED = 'CONNECTED',
  REQUESTED = 'REQUESTED', // requested by currently authenticated user
  PENDING_CONFIRMATION = 'PENDING_CONFIRMATION', // pending confirmation by currently authenticated user
}

export enum UpdateConnectionWithUserActions {
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
}

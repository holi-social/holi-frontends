import { SpaceConnectionType } from '@holi/core/screens/spaces/types'

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
  /**
   * Guaranteed to be unique (by Ory, replicated into Okuna). Identical to the "local part"
   * (aka user name without server part) in Matrix (e.g. `otto` for Matrix user ID `@otto:holi.social`).
   */
  identity: string
  avatar?: string
  avatarBlurhash?: string
  avatarDefaultColor: string
  avatarLabel: string
  firstName?: string
  lastName?: string
  fullName: string
  role: string
  aboutMe?: string
  pronouns?: string
  location?: string
  geolocationId?: string
  engagementLevel?: string
  interests?: Topic[]
  sdgs?: SDG[]
  skills?: Skill[]
  connectionStatusToMyself?: UserConnectionStatus
  connectionStatusToSpace?: SpaceConnectionType[]
}

export interface AuthenticatedUser extends User {
  trackingConsentAnalytics?: boolean | null
  trackingConsentPersonalization?: boolean | null
  isEmployee: boolean
}

export const isHoliUser = (value: User | unknown): value is User =>
  ['id', 'identity'].every((key) => value && typeof value === 'object' && key in value)

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

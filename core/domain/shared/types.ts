import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import type { Paged } from '@holi/core/types'

export interface Term {
  id: string
  title: string
  slug: string
}

export type SortedTerm = Term & { number?: number }

export type SDG = Term & {
  number: number
}

export type Skill = Term

export type Topic = Term & {
  isDiscoverSpacesDefault: boolean
}

export const termsByTitleComparator = (a: Term, b: Term) => a.title.localeCompare(b.title)

export const termsBySortNumberComparator = (a: SortedTerm, b: SortedTerm) => (a.number || 0) - (b.number || 0)

export interface TopicsQueryResult {
  topics: Paged<Topic>
}

export interface SkillsQueryResult {
  skills: Paged<Skill>
}

export interface SdgsQueryResult {
  sdgs: Paged<SDG>
}

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
  role?: string
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

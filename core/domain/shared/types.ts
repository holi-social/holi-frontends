import type { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import type { Paged } from '@holi/core/types'

// new
export const topicV2Slugs = {
  'animal-welfare': ['animal-welfare', 'biodiversity-animal-welfare'],
  'arts-culture': ['arts-culture', 'culture-social-change'],
  'climate-environment': [
    'climate-environment',
    'climate-protection',
    'water-ocean',
    'energy-transition',
    'natural-resources',
  ],
  'democracy-politics': ['democracy-politics', 'governance', 'politics-society'],
  'disability-inclusion': ['disability-inclusion', 'disabilities-inclusion'],
  'disaster-relief': ['disaster-relief', 'natural-disaster-response'],
  'elderly-care': ['elderly-care', 'elderly-people'],
  'family-kids': ['family-kids'],
  'food-hunger-relief': ['food-hunger-relief', 'agriculture-food'],
  'gender-equality': ['gender-equality', 'diversity-genderequality'],
  housing: ['housing', 'building-housing'],
  'human-rights': ['human-rights', 'democracy-human-rights'],
  'lgbtqia-plus': ['lgbtqia-plus'],
  'lifestyle-consumption': ['lifestyle-consumption', 'consumption-lifestyle', 'eco-tourism'],
  'literacy-education': ['literacy-education', 'education-science'],
  'mental-physical-health': ['mental-physical-health', 'physical-mental-health'],
  'migration-refugees': ['migration-refugees', 'migration-integration'],
  'mobility-transport': ['mobility-transport', 'mobility-infrastructure'],
  other: ['other', 'alternative-economy', 'urban-rural-development'],
  'peace-security': ['peace-security'],
  'poverty-homelessness': ['poverty-homelessness', 'poverty-homelesness'],
  'sports-recreation': ['sports-recreation'],
  'technology-innovation': ['technology-innovation', 'technological-innovation'],
  'youth-development': ['youth-development', 'children-youth'],
}
export type TopicV2 = keyof typeof topicV2Slugs

export const slugToTopicV2 = (slug: string): TopicV2 | undefined => {
  if (slug in topicV2Slugs) {
    return slug as TopicV2
  }
  return Object.entries(topicV2Slugs).find(([, slugs]) => slugs.includes(slug))?.[0] as TopicV2
}

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

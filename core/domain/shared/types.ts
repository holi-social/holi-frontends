import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import type { Paged } from '@holi/core/types'

// new
export const TopicV2m = {
  ANIMAL_WELFARE : ['animal-welfare', 'biodiversity-animal-welfare'],
  ARTS_CULTURE : ['arts-culture', 'culture-social-change'],
  CLIMATE_ENVIRONMENT : ['climate-environment', 'climate-protection', 'water-ocean', 'energy-transition', 'natural-resources'],
  DEMOCRACY_POLITICS : ['democracy-politics', 'governance', 'politics-society'],
  DISABILITY_INCLUSION : ['disability-inclusion', 'disabilities-inclusion'],
  DISASTER_RELIEF : ['disaster-relief', 'natural-disaster-response'],
  ELDERLY_CARE : ['elderly-care', 'elderly-people'],
  FAMILY_KIDS : ['family-kids'],
  FOOD_HUNGER_RELIEF : ['food-hunger-relief', 'agriculture-food'],
  GENDER_EQUALITY : ['gender-equality', 'diversity-genderequality'],
  HOUSING : ['housing', 'building-housing'],
  HUMAN_RIGHTS : ['human-rights', 'democracy-human-rights'],
  LGBTQIA_PLUS : ['lgbtqia-plus'],
  LIFESTYLE_CONSUMPTION : ['lifestyle-consumption', 'consumption-lifestyle', 'eco-tourism'],
  LITERACY_EDUCATION : ['literacy-education', 'education-science'],
  MENTAL_PHYSICAL_HEALTH : ['mental-physical-health', 'physical-mental-health'],
  MIGRATION_REFUGEES : ['migration-refugees', 'migration-integration'],
  MOBILITY_TRANSPORT : ['mobility-transport', 'mobility-infrastructure'],
  OTHER : ['other', 'alternative-economy', 'urban-rural-development'],
  PEACE_SECURITY : ['peace-security'],
  POVERTY_HOMELESSNESS : ['poverty-homelessness', 'poverty-homelesness'],
  SPORTS_RECREATION : ['sports-recreation'],
  TECHNOLOGY_INNOVATION : ['technology-innovation', 'technological-innovation'],
  YOUTH_DEVELOPMENT : ['youth-development', 'children-youth'],
}
export type TopicV2 = keyof typeof TopicV2m

export const slugToTopicV2 = (slug: string): TopicV2 =>
  TopicV2.SPORTS_RECREATION

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

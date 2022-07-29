export interface User {
  id: string
  avatar?: string
  firstName?: string
  lastName?: string
  aboutMe?: string
  pronouns?: string
  location?: string
  avatarDefaultColor: string
  avatarLabel: string
  engagementLevel?: string
  interests?: UserInterest[]
  sdgs?: string[]
  skills?: string[]
}

// keep the UserInterest type and the set UserInterests in sync
export type UserInterest =
  | 'ANIMAL_WELFARE'
  | 'CHILDREN_YOUTH'
  | 'CLIMATE_PROTECTION'
  | 'CORONA'
  | 'CULTURE_HISTORY'
  | 'DEVELOPMENT_COOPERATION'
  | 'DIGITALIZATION'
  | 'DISASTER_PROTECTION'
  | 'EDUCATION_KNOWLEDGE'
  | 'ELDERLY_PEOPLE'
  | 'ENVIRONMENTAL_PROTECTION'
  | 'EUROPE'
  | 'HEALTH'
  | 'HOLI_COMMUNITY'
  | 'HUMAN_RIGHTS'
  | 'LANGUAGE_LITERATURE'
  | 'MIGRATION_INTEGRATION'
  | 'MOBILITY_INFRASTRUCTURE'
  | 'NUTRITION'
  | 'PSYCHOLOGY'
  | 'RELIGION'
  | 'RESEARCH_SCIENCE'
  | 'SOCIETY_POLITICS'
  | 'SUSTAINABILITY'
  | 'TRAVEL'
  | 'WATER_OCEAN'

export const UserInterests: UserInterest[] = [
  'ANIMAL_WELFARE',
  'CHILDREN_YOUTH',
  'CLIMATE_PROTECTION',
  'CORONA',
  'CULTURE_HISTORY',
  'DEVELOPMENT_COOPERATION',
  'DIGITALIZATION',
  'DISASTER_PROTECTION',
  'EDUCATION_KNOWLEDGE',
  'ELDERLY_PEOPLE',
  'ENVIRONMENTAL_PROTECTION',
  'EUROPE',
  'HEALTH',
  'HOLI_COMMUNITY',
  'HUMAN_RIGHTS',
  'LANGUAGE_LITERATURE',
  'MIGRATION_INTEGRATION',
  'MOBILITY_INFRASTRUCTURE',
  'NUTRITION',
  'PSYCHOLOGY',
  'RELIGION',
  'RESEARCH_SCIENCE',
  'SOCIETY_POLITICS',
  'SUSTAINABILITY',
  'TRAVEL',
  'WATER_OCEAN',
]

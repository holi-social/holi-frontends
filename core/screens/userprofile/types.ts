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

type Guard<T> = (x: any) => x is T // eslint-disable-line @typescript-eslint/no-explicit-any

export type UserChipGeneric<T> = {
  isOfType: Guard<T>
  allValues: T[]
  keyInUserObject: string
}

export const UserChipInterest: UserChipGeneric<UserInterest> = {
  allValues: UserInterests,
  keyInUserObject: 'interests',
  isOfType: (x: any): x is UserInterest => UserChipInterest.allValues.includes(x), // eslint-disable-line @typescript-eslint/no-explicit-any
}

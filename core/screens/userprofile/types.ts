export interface User {
  id: string
  avatarLabel: string
  avatarDefaultColor: string
  avatar?: string
  firstName?: string
  lastName?: string
  aboutMe?: string
  pronouns?: string
  location?: string
  engagementLevel?: string
  interests?: UserInterest[]
  sdgs?: string[]
  skills?: string[]
}

// This definition of UserInterests and the type UserInterest does not allow for code autocompletion, so only use this pattern
// where you don't need autocompletion. If you need autocompletion (e.g. for component prop values), then you need to use the
// pattern as used for HoliButtonType and HoliButtonVariant in the HoliButton component.
export const UserInterests = [
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
export type UserInterest = typeof UserInterests[number]

export const UserSkills = [
  'ABILITY_TO_SELF_REFLECT',
  'ADAPTABILITY',
  'ANALYSIS_ABILITY',
  'ASSERTIVENESS',
  'COMMUNICATION_SKILLS',
  'CONCEPT_DEVELOPMENT',
  'CONFLICT_RESOLUTION',
  'COPING_WITH_STRESS',
  'CREATIVITY',
  'DISCIPLINE',
  'EMPATHY',
  'ENGAGEMENT_AND_COMMITMENT',
  'ENVIRONMENTAL_AWARENESS',
  'FUTABILITY_AND_FORESIGHT_THINKING',
  'GENDER_COMPETENCE_AND_DIVERSITY',
  'GIVE_FEEDBACK',
  'HOLISTIC_THINKING',
  'HUMOR',
  'INDEPENDENCE',
  'INITIATIVE_AND_ENERGY',
  'KNOWLEDGE_MANAGEMENT',
  'LEADERSHIP',
  'LOGICAL_THINKING',
  'LOYALTY',
  'MINDFULNESS',
  'MOTIVATION',
  'NEGOTIATION_SKILLS',
  'OPENNESS',
  'ORAL_AND_WRITTEN_EXPRESSIVENESS',
  'ORGANIZATIONAL_SKILLS',
  'PERSONAL_RESPONSIBILITY',
  'RELATIONSHIP_COMPETENCE',
  'RELIABILITY',
  'RESILIENCE',
  'SELF_CONFIDENT_APPEARANCE',
  'SENSE_OF_RESPONSIBILITY',
  'SOLUTION_ORIENTED',
  'TEAMWORK',
  'TIME_MANAGEMENT',
  'TRANSFERABILITY',
  'WILLINGNESS_TO_LEARN',
]
export type UserSkill = typeof UserSkills[number]

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

export const UserChipSkill: UserChipGeneric<UserSkill> = {
  allValues: UserSkills,
  keyInUserObject: 'skills',
  isOfType: (x: any): x is UserSkill => UserChipSkill.allValues.includes(x), // eslint-disable-line @typescript-eslint/no-explicit-any
}

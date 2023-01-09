import { Skill, User } from '@holi/core/screens/userprofile/types'

export interface SpaceMember {
  id: string
  user: User
  isAdministrator?: boolean
  isModerator?: boolean
  created: string
}

export enum SpaceLinkType {
  DISCORD = 'DISCORD',
  FACEBOOK = 'FACEBOOK',
  INSTAGRAM = 'INSTAGRAM',
  LINKEDIN = 'LINKEDIN',
  OTHER = 'OTHER',
  TWITTER = 'TWITTER',
  WHATSAPP = 'WHATSAPP',
}
export interface SpaceLink {
  url: string
  type: SpaceLinkType
}

export interface Space {
  id: string
  title: string
  description: string
  created: string
  creator: User
  mainImage: string
  location: string
  memberships: SpaceMember[]
  links?: SpaceLink[]
  avatar?: string
  tasks?: Task[]
}

export enum SpaceSectionType {
  FOLLOWER = 'FOLLOWER',
  MEMBERSHIP_REQUESTOR = 'MEMBERSHIP_REQUESTOR',
  MEMBER = 'MEMBER',
  CREATOR = 'CREATOR',
}
export type SpaceSection = {
  section: string
  type: SpaceSectionType
  spaces: { data: Space[] }
}

export interface Task {
  id: string
  name: string
  description: string
  creator: Partial<User>
  slotsAvailable: number
  slotsTaken: number
  location: string
  regularity: 'REGULARLY' | 'PROJECT_BASED' | 'ONE_TIME'
  skills: Skill[]
}

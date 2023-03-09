import { SDG, Skill, Topic, User } from '@holi/core/screens/userprofile/types'
import { Paged } from '@holi/core/types'

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
  cover: string
  location: string
  connectionStatusToMyself: SpaceConnectionType[]
  members: Paged<SpaceMember>
  avatarDefaultColor: string
  name: string
  links?: SpaceLink[]
  avatar?: string
  tasks?: Task[]
  topics?: Topic[]
  sdgs?: SDG[]
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
  spaces: Paged<Space>
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

export enum SpaceConnectionType {
  FOLLOWER = 'FOLLOWER',
  MEMBERSHIP_REQUESTOR = 'MEMBERSHIP_REQUESTOR',
  MEMBER = 'MEMBER',
  CREATOR = 'CREATOR',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

export enum SpaceConnectionAction {
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
}

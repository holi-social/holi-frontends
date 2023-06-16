import { Post } from '@holi/core/screens/posts/types'
import { SDG, Skill, Topic, User } from '@holi/core/screens/userprofile/types'
import { GeolocationPoint, Paged } from '@holi/core/types'

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

export enum CollaborationType {
  COLLABORATION = 'COLLABORATION',
  COMMUNICATION = 'COMMUNICATION',
  CALENDARS = 'CALENDARS',
  SURVEYS = 'SURVEYS',
  GOOD_TO_KNOW = 'GOOD_TO_KNOW',
  INFO_MATERIAL = 'INFO_MATERIAL',
  USED_SERVICES = 'USED_SERVICES',
  OTHERS = 'OTHERS',
}

export interface SpaceLink {
  id: string
  type: SpaceLinkType
  url: string
  name: string
}

export interface SpaceCollaborationTool {
  id: string
  url: string
  domain: string
  title: string
  collectionType: CollaborationType
  description?: string
  thumbnail?: string
}

export interface Space {
  id: string
  title: string
  description: string
  created: string
  creator: User
  contactDescription?: string
  contactEmail?: string
  contactPhone?: string
  cover: string
  location: string
  geolocation?: GeolocationPoint
  connectionStatusToMyself: SpaceConnectionType[]
  members: Paged<SpaceMember>
  avatarDefaultColor: string
  name: string
  links?: SpaceLink[]
  avatar?: string
  tasks?: Task[]
  topics?: Topic[]
  sdgs?: SDG[]
  collaborationTools?: SpaceCollaborationTool[]
  posts?: Paged<Post>
  hasPublicPosts?: boolean
  hasPrivatePosts?: boolean
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
  locationType: LocationType
  regularity: Regularity
  skills: Skill[]
  visibility: VisibilityType
  contactEmail: string
  contactPhone?: string
  geolocation?: GeolocationPoint
  thumbnail?: string
}

export enum VisibilityType {
  MEMBERS = 'MEMBERS',
  PUBLIC = 'PUBLIC',
}

export enum Regularity {
  REGULARLY = 'REGULARLY',
  PROJECT_BASED = 'PROJECT_BASED',
  ONE_TIME = 'ONE_TIME',
}

export enum LocationType {
  HYBRID = 'HYBRID',
  REMOTE = 'REMOTE',
  ONSITE = 'ONSITE',
}

export enum SpaceConnectionType {
  FOLLOWER = 'FOLLOWER',
  MEMBERSHIP_REQUESTOR = 'MEMBERSHIP_REQUESTOR',
  MEMBER = 'MEMBER',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

export enum SpaceConnectionAction {
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
  GRANT_ADMIN_ACCESS = 'GRANT_ADMIN_ACCESS',
  LEAVE_SPACE = 'LEAVE_SPACE',
  REMOVE_MEMBER = 'REMOVE_MEMBER',
  REVOKE_ADMIN_ACCESS = 'REVOKE_ADMIN_ACCESS',
}
export enum VisibilityFilter {
  MEMBERS = 'MEMBERS',
  PUBLIC = 'PUBLIC',
  ALL = 'ALL',
}

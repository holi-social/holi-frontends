import type { User } from '@holi/core/domain/shared/types'
import type { AppointmentInput } from '@holi/core/screens/appointments/types'
import type { Post } from '@holi/core/screens/posts/types'
import type { GeolocationPoint, Paged } from '@holi/core/types'

export interface SpaceMember {
  data: unknown
  id: string
  user: User
  isAdministrator?: boolean
  isModerator?: boolean
  created: string
}

export interface SpaceMembershipRequest {
  id: string
  user: User
  message?: string
}

export interface SpaceInvite {
  id: string
  invitedUser: User
  message?: string
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
  thumbnailBlurhash?: string
}

export interface VideoCallLink {
  id: string
  url: string
  roomName: string
  created: string
}

export interface OnboardingStep {
  text: string
}

export interface Onboarding {
  steps: OnboardingStep[]
}

export type RelatedSpace = Pick<
  Space,
  | 'id'
  | 'avatar'
  | 'avatarBlurhash'
  | 'avatarDefaultColor'
  | 'title'
  | 'members'
  | 'location'
  | 'description'
  | 'cover'
  | 'coverBlurhash'
  | 'name'
>

export type Representative = {
  user: User
}

export interface Space {
  id: string
  title: string
  description: string
  created: string
  creator?: User
  contactDescription?: string
  contactEmail?: string
  contactPhone?: string
  cover?: string
  coverBlurhash?: string
  location?: string
  geolocation?: GeolocationPoint | null
  connectionStatusToMyself: SpaceConnectionType[]
  members: Paged<SpaceMember>
  membershipRequests: Paged<SpaceMembershipRequest>
  appointments: Paged<AppointmentInput>
  avatarDefaultColor: string
  name: string
  links?: SpaceLink[]
  avatar?: string
  avatarBlurhash?: string
  tasks?: Task[]
  topicsV2?: string[]
  collaborationTools?: SpaceCollaborationTool[]
  posts?: Paged<Post>
  hasPublicPosts?: boolean
  hasPrivatePosts?: boolean
  onboarding?: Onboarding
  parentSpace?: RelatedSpace
  childSpaces?: Paged<RelatedSpace>
}

export enum SpaceSectionType {
  FOLLOWER = 'FOLLOWER',
  MEMBERSHIP_INVITEE = 'MEMBERSHIP_INVITEE',
  MEMBERSHIP_REQUESTOR = 'MEMBERSHIP_REQUESTOR',
  MEMBER = 'MEMBER',
  CREATOR = 'CREATOR', // deprecated, please use space.creator instead
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
  skillsV2: string[]
  visibility: VisibilityType
  contactEmail: string
  contactPhone?: string
  geolocation?: GeolocationPoint
  thumbnail?: string
  thumbnailBlurhash?: string
  space: Space
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
  MEMBERSHIP_INVITEE = 'MEMBERSHIP_INVITEE',
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

import { User } from '@holi/core/screens/userprofile/types'
import { LocationDetails } from '@holi/core/types'

export enum PermissionsType {
  PARTICIPANTS = 'PARTICIPANTS',
  ADMINS = 'ADMINS',
}

export interface AppointmentVideoCallLink {
  id: string
  url: string
  additionalInfo?: string
}

export interface AppointmentInput {
  id: string
  spaceId: string
  title: string
  inviteOnly: boolean
  startDateTime: string
  endDateTime: string
  permission: PermissionsType
  creator: User
  participantIds?: string[]
  locationDetails?: LocationDetails
  description: string
  videoCallLink?: string
  videoCallInfo?: string
  thumbnail?: string
  thumbnailBlurhash?: string
}

export interface Appointment {
  id: string
  spaceId: string
  title: string
  inviteOnly: boolean
  startDateTime: string
  endDateTime: string
  permission: PermissionsType
  creator: User
  participantIds?: string[]
  locationDetails?: LocationDetails
  description: string
  videoCallLink?: AppointmentVideoCallLink
  videoCallInfo?: string
  thumbnail?: string
  thumbnailBlurhash?: string
  isHybrid: boolean
}

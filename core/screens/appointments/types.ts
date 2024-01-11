import { User } from '@holi/core/screens/userprofile/types'
import { GeolocationPoint } from '@holi/core/types'

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
  location?: string
  description: string
  videoCallLink?: string
  videoCallInfo?: string
  thumbnail?: string
  geolocation?: string
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
  location?: string
  description: string
  videoCallLink?: AppointmentVideoCallLink
  videoCallInfo?: string
  thumbnail?: string
  geolocation?: GeolocationPoint
  thumbnailBlurhash?: string
}

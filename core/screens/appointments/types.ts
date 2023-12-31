export enum PermissionsType {
  PARTICIPANTS = 'PARTICIPANTS',
  ADMINS = 'ADMINS',
}

export interface Appointment {
  id: string
  spaceId: string
  title: string
  inviteOnly: boolean
  startDateTime: string
  endDateTime: string
  permission: PermissionsType
  participantIds?: string[]
  location?: string
  description?: string
  videoCallLink?: string
  videoCallInfo?: string
  thumbnail?: string
  geolocation?: string
}

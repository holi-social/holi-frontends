import { gql } from '@apollo/client'

import { UserAvatarFragment } from '@holi/core/domain/shared/queries'
import { Appointment } from '@holi/core/screens/appointments/types'
import { Paged } from '@holi/core/types'

export enum APPOINTMENT_STATUS_TYPE {
  PAST = 'PAST',
  UPCOMING = 'UPCOMING',
}

export const FullAppointmentFragment = gql`
  ${UserAvatarFragment}
  fragment FullAppointment on Appointment {
    id
    slug
    title
    slug
    inviteOnly
    participants {
      id
    }
    startDateTime
    endDateTime
    videoCallLink {
      id
      url
      additionalInfo
    }
    description
    thumbnail
    thumbnailBlurhash
    permission
    creator {
      ...UserAvatar
    }
    participants {
      ...UserAvatar
    }
    locationDetails {
      completeAddress
      city
      state
      country
      geolocation {
        longitude
        latitude
      }
    }
    isHybrid
    hasVideoCallLink
  }
`

export const PartialAppointmentFragment = gql`
  fragment PartialAppointment on Appointment {
    id
    slug
    title
    slug
    inviteOnly
    participants {
      id
    }
    startDateTime
    endDateTime
    videoCallLink {
      id
      url
      additionalInfo
    }
    description
    thumbnail
    thumbnailBlurhash
    permission
    creator {
      id
    }
    locationDetails {
      completeAddress
      city
      state
      country
      geolocation {
        longitude
        latitude
      }
    }
    isHybrid
    hasVideoCallLink
  }
`

export const appointmentsBySpaceIdQuery = gql`
  ${PartialAppointmentFragment}

  query Appointments($spaceId: UUID!, $statusType: StatusType!, $offset: Int! = 0, $limit: Int! = 10) {
    appointments(spaceId: $spaceId, statusType: $statusType, offset: $offset, limit: $limit) {
      totalResults
      data {
        ...PartialAppointment
      }
    }
  }
`

export interface AppointmentsBySpaceIdResponse {
  appointments: Paged<Appointment>
}

export const appointmentByIdOrSlugQuery = gql`
  ${FullAppointmentFragment}

  query Appointment($idOrSlug: String!) {
    appointment(idOrSlug: $idOrSlug) {
      ...FullAppointment
    }
  }
`

export interface appointmentByIdOrSlugResponse {
  appointment: Appointment
}

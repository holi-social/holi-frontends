import { gql } from '@apollo/client'

import { Appointment } from '@holi/core/screens/appointments/types'
import { Paged } from '@holi/core/types'

export enum APPOINTMENT_STATUS_TYPE {
  PAST = 'PAST',
  UPCOMING = 'UPCOMING',
}

export const FullAppointmentFragment = gql`
  fragment FullAppointment on Appointment {
    id
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
    location
    geolocation {
      longitude
      latitude
    }
  }
`

export const appointmentsBySpaceIdQuery = gql`
  ${FullAppointmentFragment}

  query Appointments($spaceId: UUID!, $statusType: StatusType!, $offset: Int! = 0, $limit: Int! = 10) {
    appointments(spaceId: $spaceId, statusType: $statusType, offset: $offset, limit: $limit) {
      totalResults
      data {
        ...FullAppointment
      }
    }
  }
`

export interface AppointmentsBySpaceIdResponse {
  appointments: Paged<Appointment>
}

import { gql } from '@apollo/client'

import type { Paged } from '@holi/core/types'

export const FullEventFragment = gql`
  fragment FullEvent on Event {
    id
    title
    organisationName
    startDate
    endDate
    location {
      street
      streetNo
      zipCode
      city
    }
    isRemote
    imageUrl
    eventDetails {
      description
      externalLink
      meetingLink
    }
  }
`

export const eventsQuery = gql`
  ${FullEventFragment}

  query EventsById($offset: Int = 0, $limit: Int = 5, $location: String) {
    eventsById(offset: $offset, limit: $limit, location: $location) {
      ...Event
    }
  }
`

export interface EventsByIdResponse {
  eventsById: Paged<Event>
}

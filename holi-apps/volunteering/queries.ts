import { gql } from '@apollo/client/core'

import { VolunteeringEngagement } from './types'

export const FullEngagementFragment = gql`
  fragment FullEngagement on AppVolunteering_Engagement {
    id
    title
    description
    url
    imageUrl
    source
    categories
    organizer {
      name
      imageUrl
    }
    location
    latitude
    longitude
  }
`

export type VolunteeringEngagementsQueryResponse = {
  appVolunteering_engagements: {
    totalResults: number
    data: VolunteeringEngagement[]
  }
}

export const VolunteeringEngagementsQuery = gql`
  ${FullEngagementFragment}

  query VolunteeringEngagements($location: String, $limit: Int!, $offset: Int!) {
    appVolunteering_engagements(location: $location, limit: $limit, offset: $offset) {
      totalResults
      data {
        ...FullEngagement
      }
    }
  }
`

export const engagementByIdQuery = gql`
  ${FullEngagementFragment}

  query EngagementById($id: Int!) {
    appVolunteering_engagement(id: $id) {
      ...FullEngagement
    }
  }
`

export type AppVolunteeringEngagementByIdResponse = {
  appVolunteering_engagement: VolunteeringEngagement
}

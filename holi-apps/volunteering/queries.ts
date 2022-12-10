import { gql } from '@apollo/client/core'

import { VolunteeringEngagement } from './types'

export const FullEngagementFragment = gql`
  fragment FullEngagement on AppVolunteering_Engagement {
    id
    title
    location
    link
    source
    image
    uses
    hashTags
    orga
    imageOrga
    description
    latitude
    longitude
  }
`

export type VolunteeringEngagementsQueryResponse = {
  appVolunteering_engagements: VolunteeringEngagement[]
}

export const VolunteeringEngagementsQuery = gql`
  ${FullEngagementFragment}

  query VolunteeringEngagements {
    appVolunteering_engagements {
      ...FullEngagement
    }
  }
`

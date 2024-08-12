import { gql } from '@apollo/client/core'

import { VolunteeringEngagement } from './types'

export const fullEngagementFragment = gql`
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
  appVolunteering_engagementOpportunities: {
    totalResults: number
    data: VolunteeringEngagement[]
  }
}

export const volunteeringEngagementsQuery = gql`
  ${fullEngagementFragment}

  query VolunteeringEngagements(
    $location: AppVolunteering_GeoJSON
    $category: String
    $limit: Int! = 10
    $offset: Int! = 0
  ) {
    appVolunteering_engagementOpportunities(location: $location, category: $category, limit: $limit, offset: $offset) {
      totalResults
      data {
        ...FullEngagement
      }
    }
  }
`

export type VolunteeringRecosV1QueryVariables = {
  limit?: number
  offset?: number
  topics?: string[]
  skills?: string[]
  geolocationId?: string
}
export type VolunteeringRecosV1QueryResponse = {
  appVolunteering_engagementRecommendations: {
    totalResults: number
    data: VolunteeringEngagement[]
  }
}

export const volunteeringRecosV1Query = gql`
  ${fullEngagementFragment}

  query VolunteeringRecommendations(
    $limit: Int! = 10
    $offset: Int! = 0
    $topics: [String!] = []
    $skills: [String!] = []
    $geolocationId: String
  ) {
    appVolunteering_engagementRecommendations(
      limit: $limit
      offset: $offset
      topics: $topics
      skills: $skills
      geolocationId: $geolocationId
    ) {
      totalResults
      data {
        ...FullEngagement
      }
    }
  }
`

export const engagementByIdQuery = gql`
  ${fullEngagementFragment}

  query EngagementById($id: String!) {
    appVolunteering_engagement(id: $id) {
      ...FullEngagement
    }
  }
`
export type AppVolunteeringEngagementByIdResponse = {
  appVolunteering_engagement: VolunteeringEngagement
}

export const trackEngagementViewMutation = gql`
  mutation TrackEngagementView($id: String!) {
    appVolunteering_trackEngagementView(id: $id) {
      id
    }
  }
`

export const volunteeringCategoriesQuery = gql`
  query VolunteeringCategories {
    appVolunteering_categories {
      data {
        name
      }
    }
  }
`

export type TrackEngagementViewResponse = {
  id: string
}

export type Category = {
  name: string
}

export interface VolunteeringCategoriesQueryResult {
  appVolunteering_categories: {
    data: Category[]
  }
}

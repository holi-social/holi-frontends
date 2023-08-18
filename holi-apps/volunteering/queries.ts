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

  query VolunteeringEngagements($location: AppVolunteering_GeoJSON, $category: String, $limit: Int!, $offset: Int!) {
    appVolunteering_engagements(location: $location, category: $category, limit: $limit, offset: $offset) {
      totalResults
      data {
        ...FullEngagement
      }
    }
  }
`

export const engagementByIdQuery = gql`
  ${FullEngagementFragment}

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

export const VolunteeringCitiesQuery = gql`
  query VolunteeringCities {
    appVolunteering_cities {
      data {
        name
      }
    }
  }
`
export const VolunteeringCategoriesQuery = gql`
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

export type City = {
  name: string
}

export interface VolunteeringCitiesQueryResult {
  appVolunteering_cities: {
    data: City[]
  }
}
export type Category = {
  name: string
}

export interface VolunteeringCategoriesQueryResult {
  appVolunteering_categories: {
    data: Category[]
  }
}

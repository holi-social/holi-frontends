import { gql } from '@apollo/client/core'

import type { VolunteeringEngagement, VolunteeringReco } from './types'

export const fullEngagementFragment = gql`
  fragment FullEngagement on AppVolunteering_Engagement {
    id
    title
    description
    url
    imageUrl
    source
    organizer {
      name
      imageUrl
    }
    location
    latitude
    longitude
    topicsV2
    skillsV2
  }
`

export const fullEngagementRecoFragment = gql`
  ${fullEngagementFragment}

  fragment FullEngagementReco on AppVolunteering_EngagementReco {
    engagement {
      ...FullEngagement
    }
    matchedTopicsV2
    matchedSkillsV2
  }
`

export type VolunteeringRecosQueryVariables = {
  limit?: number
  offset?: number
  topics?: string[]
  skills?: string[]
  geolocationId?: string
}

export type VolunteeringRecosQueryResponse = {
  appVolunteering_engagementRecosV2: {
    totalResults: number
    data: VolunteeringReco[]
  }
}

export const volunteeringRecosQuery = gql`
  ${fullEngagementRecoFragment}

  query VolunteeringRecommendations(
    $limit: Int! = 10
    $offset: Int! = 0
    $topics: [String!] = []
    $skills: [String!] = []
    $geolocationId: String
  ) {
    appVolunteering_engagementRecosV2(
      limit: $limit
      offset: $offset
      topics: $topics
      skills: $skills
      geolocationId: $geolocationId
    ) {
      totalResults
      data {
        ...FullEngagementReco
      }
    }
  }
`

export type VolunteeringSimilarRecosQueryVariables = {
  id: string
  offset?: number
  limit?: number
}

export type VolunteeringSimilarRecosQueryResponse = {
  appVolunteering_similarRecommendations: {
    totalResults: number
    data: VolunteeringEngagement[]
  }
}

export const volunteeringSimilarRecosQuery = gql`
  ${fullEngagementFragment}

  query SimilarRecommendations($id: String!, $offset: Int! = 0, $limit: Int = 10) {
    appVolunteering_similarRecommendations(id: $id, offset: $offset, limit: $limit) {
      totalResults
      data {
        ...FullEngagement
      }
    }
  }
`

export const filteredVolunteeringEngagementsQuery = gql`
  ${fullEngagementFragment}

  query FilteredVolunteeringEngagements(
    $limit: Int! = 10
    $offset: Int! = 0
    $topics: [String!] = []
    $skills: [String!] = []
    $geolocationId: String
  ) {
    appVolunteering_filteredEngagementsV2(
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

export type AppVolunteeringEngagementByIdVariables = {
  id: string
}

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

export type TrackEngagementViewResponse = {
  id: string
}

import { gql } from '@apollo/client/core'

import { Insight } from '@holi/core/screens/insights/types'

const InsightFragment = gql`
  fragment InsightFull on Insight {
    id
    title
    description
    datePublished
    curator {
      id
      avatar
      firstName
      lastName
      aboutMe
    }
    headerImage
    posts {
      id
      text
      creator {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`

export const lastInsightsQuery = gql`
  ${InsightFragment}

  query LastInsights($numberOfItems: Int!) {
    lastInsights(numberOfItems: $numberOfItems) {
      ...InsightFull
    }
  }
`

export type LastInsightsResponse = {
  lastInsights: Insight[]
}

export const insightById = gql`
  ${InsightFragment}

  query InsightById($id: String!) {
    insightById(id: $id) {
      ...InsightFull
    }
  }
`

export type InsightByIdResponse = {
  insightById: Insight
}

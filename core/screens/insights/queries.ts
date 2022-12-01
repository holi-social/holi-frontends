import { gql } from '@apollo/client/core'

import { Insight } from '@holi/core/screens/insights/types'

const InsightFragment = gql`
  fragment InsightFull on Insight {
    id
    title
    description
    datePublished
    creator {
      id
      avatar
      avatarLabel
      avatarDefaultColor
      firstName
      lastName
      fullName
      aboutMe
    }
    headerImage
    topic {
      id
      title
    }
    posts {
      id
      text
      title
      created
      creator {
        id
        firstName
        lastName
        fullName
        avatar
        avatarLabel
        avatarDefaultColor
      }
      links {
        requestedUrl
        url
        title
        description
        type
        image
        siteName
        origin
      }
      mentions {
        id
        fullName
      }
    }
  }
`

export const lastInsightsQuery = gql`
  ${InsightFragment}

  query LastInsights($limit: Int!) {
    lastInsights(limit: $limit) {
      data {
        ...InsightFull
      }
    }
  }
`

export type LastInsightsResponse = {
  lastInsights: {
    data: Insight[]
  }
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

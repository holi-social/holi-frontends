import { gql } from '@apollo/client/core'

import { Insight } from '@holi/core/screens/insights/types'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'

const LinkFragment = gql`
  fragment LinkFragment on LinkPreview {
    requestedUrl
    url
    title
    description
    type
    image
    siteName
    origin
  }
`

const InsightFragment = gql`
  ${userAvatarFragment}
  ${LinkFragment}

  fragment InsightFull on Insight {
    id
    title
    description
    datePublished
    creator {
      ...UserAvatar
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
        ...UserAvatar
      }
      links {
        ...LinkFragment
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

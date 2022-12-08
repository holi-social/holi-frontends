import { gql } from '@apollo/client/core'

import { Insight } from '@holi/core/screens/insights/types'
import { PostFragment } from '@holi/core/screens/posts/queries'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'

const InsightFragment = gql`
  ${userAvatarFragment}
  ${PostFragment}

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
      ...PostFull
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

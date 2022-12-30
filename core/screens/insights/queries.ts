import { gql } from '@apollo/client/core'

import { Insight } from '@holi/core/screens/insights/types'
import { PostFragment } from '@holi/core/screens/posts/queries'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { Paged } from '@holi/core/types'

const InsightWithPostsFragment = gql`
  ${userAvatarFragment}
  ${PostFragment}

  fragment InsightWithPosts on Insight {
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
      ...PostFragment
    }
  }
`

export const lastInsightsQuery = gql`
  ${userAvatarFragment}

  query LastInsights($limit: Int!) {
    lastInsights(limit: $limit) {
      data {
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
        numberOfPosts
        involvedUsers {
          totalResults
          data {
            ...UserAvatar
          }
        }
      }
    }
  }
`

export type LastInsightsResponse = {
  lastInsights: Paged<Insight>
}

export const insightById = gql`
  ${InsightWithPostsFragment}

  query InsightById($id: String!) {
    insightById(id: $id) {
      ...InsightWithPosts
    }
  }
`

export type InsightByIdResponse = {
  insightById: Insight
}

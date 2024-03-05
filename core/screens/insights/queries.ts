import { gql } from '@apollo/client/core'

import { LinkFragment, PostFragment, RecommendationFragment } from '@holi/core/screens/posts/queries'
import { Insight, Recommendation } from '@holi/core/screens/insights/types'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { Paged } from '@holi/core/types'

const QuotesFragment = gql`
  ${LinkFragment}

  fragment QuotesFragment on Quote {
    id
    text
    author
    authorProfession
    link
    linkPreview {
      ...LinkFragment
      icon
    }
    category
    comment
  }
`

export const RecommendationFragment = gql`
  ${LinkFragment}

  fragment RecommendationFragment on Recommendation {
    id
    category
    comment
    link
    linkPreview {
      ...LinkFragment
    }
  }
`

const InsightWithPostsFragment = gql`
  ${UserAvatarFragment}
  ${PostFragment}
  ${RecommendationFragment}
  ${QuotesFragment}

  fragment InsightWithPosts on Insight {
    id
    title
    description
    datePublished
    creator {
      ...UserAvatar
      aboutMe
      firstName
    }
    headerImage
    headerImageBlurhash
    topic {
      id
      title
    }
    posts {
      ...PostFragment
    }
    isBookmarked
    recommendations {
      ...RecommendationFragment
    }
    quotes {
      ...QuotesFragment
    }
  }
`

export const lastInsightsQuery = gql`
  ${UserAvatarFragment}

  query LastInsights($offset: Int! = 0, $limit: Int! = 4) {
    lastInsights(offset: $offset, limit: $limit) {
      data {
        id
        title
        description
        datePublished
        creator {
          ...UserAvatar
          aboutMe
        }
        headerImage
        headerImageBlurhash
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
      totalResults
    }
  }
`

export type LastInsightsResponse = {
  lastInsights: Paged<Insight>
}

export const favoriteInsightsQuery = gql`
  ${UserAvatarFragment}

  query FavoriteInsights($offset: Int! = 0, $limit: Int! = 10) {
    favoriteInsights(offset: $offset, limit: $limit) {
      data {
        id
        title
        datePublished
        creator {
          ...UserAvatar
          aboutMe
        }
        headerImage
        headerImageBlurhash
      }
      totalResults
    }
  }
`

export type FavoriteInsightsResponse = {
  favoriteInsights: Paged<Insight>
}

export const insightById = gql`
  ${InsightWithPostsFragment}

  query InsightById($id: UUID!) {
    insightById(id: $id) {
      ...InsightWithPosts
    }
  }
`

export type InsightByIdResponse = {
  insightById: Insight
}

export const recommendationById = gql`
  ${RecommendationFragment}

  query RecommendationById($id: UUID!) {
    recommendationById(id: $id) {
      ...RecommendationFragment
    }
  }
`

export type RecommendationByIdResponse = {
  recommendationById: Recommendation
}

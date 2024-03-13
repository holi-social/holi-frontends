import { gql } from '@apollo/client/core'

import { Insight, InsightWithQuote, Recommendation } from '@holi/core/screens/insights/types'
import { LinkFragment, PostFragment } from '@holi/core/screens/posts/queries'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { User } from '@holi/core/screens/userprofile/types'
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

export const insightWithQuoteById = gql`
  ${QuotesFragment}
  ${UserAvatarFragment}

  query InsightWithQuoteById($insightId: UUID!, $quoteId: UUID!) {
    insightById(id: $insightId) {
      id
      title
      description
      datePublished
      creator {
        ...UserAvatar
        aboutMe
        firstName
      }
      quote(id: $quoteId) {
        ...QuotesFragment
      }
    }
  }
`

export type InsightWithQuoteByIdResponse = {
  insightById: InsightWithQuote
}

export const insightWithRecommendation = gql`
  ${RecommendationFragment}
  ${UserAvatarFragment}

  query InsightWithRecommendation($insightId: UUID!, $recommendationId: UUID!) {
    insightById(id: $insightId) {
      creator {
        ...UserAvatar
      }
      recommendation(id: $recommendationId) {
        ...RecommendationFragment
      }
    }
  }
`

export type InsightWithRecommendationResponse = {
  insightById: {
    creator: User
    recommendation: Recommendation
  }
}

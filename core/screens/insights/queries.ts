import { gql } from '@apollo/client/core'

import { UserAvatarFragment } from '@holi/core/domain/shared/queries'
import type { User } from '@holi/core/domain/shared/types'
import { LinkFragment } from '@holi/core/screens/comments/queries'
import type { Initiative, Insight, InsightWithQuote, Recommendation } from '@holi/core/screens/insights/types'
import { PollFragment } from '@holi/core/screens/polls/queries'
import { PostFragment } from '@holi/core/screens/posts/queries'
import type { Paged } from '@holi/core/types'

export const QuoteFragment = gql`
  ${LinkFragment}

  fragment QuoteFragment on Quote {
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
    reactions {
      HEART
    }
    myReaction {
      HEART
    }
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
    reactions {
      HEART
    }
    myReaction {
      HEART
    }
  }
`

export const InitiativeFragment = gql`
  ${LinkFragment}

  fragment InitiativeFragment on Initiative {
    id
    category
    comment
    link
    linkPreview {
      ...LinkFragment
    }
    reactions {
      HEART
    }
    myReaction {
      HEART
    }
  }
`

const InsightWithPostsFragment = gql`
  ${UserAvatarFragment}
  ${UserAvatarFragment}
  ${PostFragment}
  ${PollFragment}
  ${RecommendationFragment}
  ${QuoteFragment}
  ${InitiativeFragment}

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
    polls {
      ...PollFragment
    }
    isFavorite
    recommendations {
      ...RecommendationFragment
    }
    quotes {
      ...QuoteFragment
    }
    initiatives {
      ...InitiativeFragment
    }
    discussions {
      id
      question
    }
  }
`

export const InsightFragment = gql`
  ${UserAvatarFragment}

  fragment InsightFragment on Insight {
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
`

export const lastInsightsQuery = gql`
  ${InsightFragment}

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
  ${QuoteFragment}
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
        ...QuoteFragment
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

export const insightWithInitiative = gql`
  ${InitiativeFragment}
  ${UserAvatarFragment}

  query InsightWithInitiative($insightId: UUID!, $initiativeId: UUID!) {
    insightById(id: $insightId) {
      creator {
        ...UserAvatar
      }
      initiative(id: $initiativeId) {
        ...InitiativeFragment
      }
    }
  }
`

export type InsightWithInitiativeResponse = {
  insightById: {
    creator: User
    initiative: Initiative
  }
}

export const insightAuthors = gql`
  ${UserAvatarFragment}

  query InsightAuthors($limit: Int! = 10, $offset: Int! = 0) {
    insightAuthors(limit: $limit, offset: $offset) {
      data {
        ...UserAvatar
      }
    }
  }
`
export type InsightAuthorsResponse = {
  insightAuthors: Paged<User>
}

export const discussionById = gql`
  query Discussion($discussionId: UUID!) {
    discussionById(id: $discussionId) {
      id
      question
    }
  }
`

export type DiscussionResponse = {
  discussionById: {
    id: string
    question: string
  }
}

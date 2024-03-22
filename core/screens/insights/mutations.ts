import { gql } from '@apollo/client/core'

import { InitiativeFragment, QuoteFragment, RecommendationFragment } from '@holi/core/screens/insights/queries'
import { Initiative, Quote, Recommendation } from '@holi/core/screens/insights/types'

export const bookmarkInsightMutation = gql`
  mutation BookmarkInsight($insightId: UUID!) {
    bookmarkInsight(insightId: $insightId) {
      success
    }
  }
`

export const removeInsightBookmarkMutation = gql`
  mutation RemoveInsightBookmark($insightId: UUID!) {
    removeInsightBookmark(insightId: $insightId) {
      success
    }
  }
`

export interface BookmarkInsightResponse {
  success: boolean
}

export interface RemoveInsightBookmark {
  success: boolean
}

export const UpdateQuoteReactionMutation = gql`
  ${QuoteFragment}

  mutation UpdateQuoteReaction($quoteId: UUID!, $reactionType: ReactionType!, $reactionAction: ReactionAction!) {
    updateQuoteReaction(quoteId: $quoteId, reactionType: $reactionType, reactionAction: $reactionAction) {
      ...QuoteFragment
    }
  }
`

export interface UpdateQuoteReactionResponse {
  quote: Quote
}

export const UpdateRecommendationReactionMutation = gql`
  ${RecommendationFragment}

  mutation UpdateRecommendationReaction(
    $recommendationId: UUID!
    $reactionType: ReactionType!
    $reactionAction: ReactionAction!
  ) {
    updateRecommendationReaction(
      recommendationId: $recommendationId
      reactionType: $reactionType
      reactionAction: $reactionAction
    ) {
      ...RecommendationFragment
    }
  }
`

export interface UpdateRecommendationReactionResponse {
  recommendation: Recommendation
}

export const UpdateInitiativeReactionMutation = gql`
  ${InitiativeFragment}

  mutation UpdateInitiativeReaction(
    $initiativeId: UUID!
    $reactionType: ReactionType!
    $reactionAction: ReactionAction!
  ) {
    updateInitiativeReaction(
      initiativeId: $initiativeId
      reactionType: $reactionType
      reactionAction: $reactionAction
    ) {
      ...InitiativeFragment
    }
  }
`

export interface UpdateInitiativeReactionResponse {
  initiative: Initiative
}

import { gql } from '@apollo/client'

import { InitiativeFragment, QuoteFragment, RecommendationFragment } from '@holi/core/screens/insights/queries'
import { Initiative, Quote, Recommendation } from '@holi/core/screens/insights/types'

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

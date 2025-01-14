import { useMutation } from '@apollo/client'
import { capitalize } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import {
  UpdateInitiativeReactionMutation,
  UpdateInitiativeReactionResponse,
  UpdateQuoteReactionMutation,
  UpdateQuoteReactionResponse,
  UpdateRecommendationReactionMutation,
  UpdateRecommendationReactionResponse,
} from '@holi/core/screens/insights/mutations'
import { Initiative, Quote, Recommendation } from '@holi/core/screens/insights/types'
import { ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export enum ItemType {
  QUOTE = 'QUOTE',
  RECOMMENDATION = 'RECOMMENDATION',
  INITIATIVE = 'INITIATIVE',
}

export interface InsightReactionsProps {
  item: Quote | Recommendation | Initiative
  itemType: ItemType
  style?: ViewStyle
}

const InsightReactions: React.FC<InsightReactionsProps> = ({ item, itemType, style }) => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const { displayError } = useErrorHandling()
  const { track } = useTracking()

  const heartReactions = item.reactions.HEART
  const currentUserHasReacted = !!item.myReaction.HEART

  let mutation
  switch (itemType) {
    case ItemType.QUOTE:
      mutation = UpdateQuoteReactionMutation
      break
    case ItemType.RECOMMENDATION:
      mutation = UpdateRecommendationReactionMutation
      break
    case ItemType.INITIATIVE:
      mutation = UpdateInitiativeReactionMutation
      break
  }

  const [updateItemReaction] = useMutation<
    UpdateQuoteReactionResponse | UpdateRecommendationReactionResponse | UpdateInitiativeReactionResponse
  >(mutation, {
    onError: (error) =>
      displayError(error, `Failed to update ${itemType} reaction`, {
        location: `InsightReactions.update${itemType}Reaction`,
        [`${itemType.toLowerCase()}Id`]: item.id,
      }),
  })

  const reactOnItem = () => {
    if (!user) {
      return openSignupModal({
        description: t(`insights.${itemType.toLowerCase()}s.loginRedirect.text`),
        trackTrigger: 'REACT_ON_INSIGHT',
      })
    }
    updateItemReaction({
      variables: {
        [`${itemType.toLowerCase()}Id`]: item.id,
        reactionType: ReactionType.HEART,
        reactionAction: currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET,
      },
      onCompleted: () => {
        if (!currentUserHasReacted) {
          track(TrackingEvent.Engaging.reacted(capitalize(itemType), item.id))
        }
      },
    })
  }

  return (
    <HoliReactionsCount
      onPress={reactOnItem}
      type="insight"
      count={heartReactions}
      active={currentUserHasReacted}
      fullName={ItemType.QUOTE ? (item as Quote).author : undefined}
      style={style}
      testID={`btn-react-to-insight-${itemType.toLowerCase()}-HEART`}
    />
  )
}

export default InsightReactions

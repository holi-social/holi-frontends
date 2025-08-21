import { useMutation } from '@apollo/client'
import { capitalize } from 'lodash'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import type { ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import {
  UpdateInitiativeReactionMutation,
  type UpdateInitiativeReactionResponse,
  UpdateQuoteReactionMutation,
  type UpdateQuoteReactionResponse,
  UpdateRecommendationReactionMutation,
  type UpdateRecommendationReactionResponse,
} from '@holi/core/screens/insights/mutations'
import type { Initiative, Quote, Recommendation } from '@holi/core/screens/insights/types'
import { ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import ReactButton from '@holi/core/components/reactions/ReactButton'

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

const InsightReactions: React.FC<InsightReactionsProps> = ({ item, itemType }) => {
  const { t } = useTranslation()
  const { requireLogin } = useSignupModal()
  const { displayError } = useErrorHandling()
  const { track } = useTracking()

  const currentUserHasReacted = !!item.myReaction.HEART

  const fullName = ItemType.QUOTE ? (item as Quote).author : undefined
  const notActiveText = fullName
    ? t('insights.reactions.like', { name: fullName })
    : t('insights.reactions.like.noUser')
  const activeText = t('insights.reactions.unlike')
  const labelText = currentUserHasReacted ? activeText : notActiveText

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
    <ReactButton
      onPress={() =>
        requireLogin(reactOnItem, {
          description: t(`insights.${itemType.toLowerCase()}s.loginRedirect.text`),
          trackTrigger: 'REACT_ON_INSIGHT',
        })
      }
      active={currentUserHasReacted}
      label={labelText}
    />
  )
}

export default InsightReactions

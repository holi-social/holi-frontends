import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import {
  UpdateQuoteReactionMutation,
  UpdateQuoteReactionResponse,
  UpdateRecommendationReactionMutation,
  UpdateRecommendationReactionResponse,
} from '@holi/core/screens/insights/mutations'
import { Quote, Recommendation } from '@holi/core/screens/insights/types'
import { ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export enum ItemType {
  QUOTE = 'QUOTE',
  RECOMMENDATION = 'RECOMMENDATION',
}

export interface InsightReactionsProps {
  item: Quote | Recommendation
  itemType: ItemType
  style?: ViewStyle
}

const InsightReactions: React.VFC<InsightReactionsProps> = ({ item, itemType, style }) => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const { displayError } = useErrorHandling()

  const heartReactions = item.reactions.HEART
  const currentUserHasReacted = !!item.myReaction.HEART

  const [updateItemReaction] = useMutation<UpdateQuoteReactionResponse | UpdateRecommendationReactionResponse>(
    itemType === ItemType.QUOTE ? UpdateQuoteReactionMutation : UpdateRecommendationReactionMutation,
    {
      onError: (error) =>
        displayError(error, `Failed to update ${itemType} reaction`, {
          location: `InsightReactions.update${itemType}Reaction`,
          [`${itemType.toLowerCase()}Id`]: item.id,
        }),
    }
  )

  const reactOnItem = () => {
    if (!user) {
      return openLoginModal({
        description: t(`insights.${itemType.toLowerCase()}s.loginRedirect.text`),
      })
    }
    updateItemReaction({
      variables: {
        id: item.id,
        reactionType: ReactionType.HEART,
        reactionAction: currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET,
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

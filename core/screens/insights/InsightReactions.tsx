import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import { UpdateInsightReactionMutation, UpdateInsightReactionResponse } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import { ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export interface InsightReactionsProps {
  insight: Insight
  onChange?: () => void
  style?: ViewStyle
}

const InsightReactions: React.VFC<InsightReactionsProps> = ({ insight, onChange, style }) => {
  // console.log(insight)

  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const { displayError } = useErrorHandling()

  const heartReactions = 22 //quote.reactions.HEART
  const currentUserHasReacted = true //!!quote.myReaction.HEART

  const [updateInsightReaction] = useMutation<UpdateInsightReactionResponse>(UpdateInsightReactionMutation, {
    onCompleted: () => onChange?.(),
    onError: (error) =>
      displayError(error, 'Failed to update insight reaction', {
        location: 'InsightReactions.updateInsightReaction',
        insightId: insight.id,
      }),
  })

  const reactOnInsight = () => {
    if (!user) {
      return openLoginModal({
        description: t('insights.posts.comments.react.loginRedirect.text'),
      })
    }
    updateInsightReaction({
      variables: {
        id: insight.id,
        reactionType: ReactionType.HEART,
        reactionAction: currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET,
      },
    })
  }

  return (
    <View>
      <HoliReactionsCount
        onPress={reactOnInsight}
        type="insight"
        count={heartReactions}
        active={currentUserHasReacted}
        fullName={insight?.creator?.fullName || ''}
        style={style}
        testID="btn-react-to-insight-HEART"
      />
    </View>
  )
}

export default InsightReactions

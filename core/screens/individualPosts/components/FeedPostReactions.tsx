import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import {
  UpdateFeedPostReactionMutation,
  UpdateFeedPostReactionResponse,
} from '@holi/core/screens/individualPosts/mutations'
import { FeedPost, ReactionAction, ReactionType } from '@holi/core/screens/individualPosts/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export interface FeedPostReactionsProps {
  post: FeedPost
  onChange?: () => void
  style?: ViewStyle
}

const FeedPostReactions: React.FC<FeedPostReactionsProps> = ({ post, onChange, style }) => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const { displayError } = useErrorHandling()

  const heartReactions = post.reactions.HEART
  const currentUserHasReacted = !!post.myReaction.HEART

  const [updateFeedPostReaction, { loading }] = useMutation<UpdateFeedPostReactionResponse>(
    UpdateFeedPostReactionMutation,
    {
      onCompleted: () => onChange?.(),
      onError: (error) =>
        displayError(error, 'Failed to update feed post reaction', {
          location: 'FeedPostReactions.updateFeedPostReaction',
          postId: post.id,
        }),
    }
  )

  const reactOnPost = () => {
    if (!user) {
      return openLoginModal({
        description: t('individuals.post.reaction.loginRedirect.text'),
      })
    }
    updateFeedPostReaction({
      variables: {
        postId: post.id,
        reactionType: ReactionType.HEART,
        reactionAction: currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET,
      },
    })
  }

  return (
    <HoliReactionsCount
      onPress={reactOnPost}
      type="post"
      count={heartReactions}
      active={currentUserHasReacted}
      fullName={post.creator.fullName}
      style={style}
      testID="btn-react-to-feed-post-HEART"
      disabled={loading}
    />
  )
}

export default FeedPostReactions

import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { UpdateFeedPostReactionMutation } from '@holi/core/screens/individualPosts/mutations'
import { FeedPost, ReactionAction, ReactionType } from '@holi/core/screens/individualPosts/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export interface FeedPostReactionsProps {
  post: FeedPost
  onChange?: () => void
  style?: ViewStyle
}

const FeedPostReactions: React.FC<FeedPostReactionsProps> = ({ post, onChange, style }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const { displayError } = useErrorHandling()
  const { track } = useTracking()

  const heartReactions = post.reactions.HEART
  const currentUserHasReacted = !!post.myReaction.HEART

  const [updateFeedPostReaction] = useMutation(UpdateFeedPostReactionMutation, {
    onCompleted: () => onChange?.(),
    onError: (error) =>
      displayError(error, 'Failed to update feed post reaction', {
        location: 'FeedPostReactions.updateFeedPostReaction',
        postId: post.id,
      }),
    optimisticResponse: {
      updateFeedPostReaction: {
        ...post,
        reactions: {
          ...post.reactions,
          HEART: currentUserHasReacted ? post.reactions.HEART - 1 : post.reactions.HEART + 1,
        },
        myReaction: {
          ...post.myReaction,
          HEART: currentUserHasReacted ? 0 : 1,
        },
      },
    },
  })

  const reactOnPost = () => {
    if (!isLoggedIn) {
      openSignupModal({
        description: t('individuals.post.reaction.loginRedirect.text'),
        trackTrigger: 'REACT_ON_POST',
      })
    } else {
      const reactionAction = currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET
      const reactionType = ReactionType.HEART
      updateFeedPostReaction({
        variables: {
          postId: post.id,
          reactionType: reactionType,
          reactionAction: reactionAction,
        },
        onCompleted: () => {
          if (reactionAction === ReactionAction.SET) {
            track(TrackingEvent.Engaging.reacted('FeedPost', post.id))
          }
        },
      })
    }
  }

  return (
    <HoliReactionsCount
      onPress={reactOnPost}
      type="post"
      count={heartReactions}
      active={currentUserHasReacted}
      fullName={post.author.fullName}
      style={style}
      testID="btn-react-to-feed-post-HEART"
    />
  )
}

export default FeedPostReactions

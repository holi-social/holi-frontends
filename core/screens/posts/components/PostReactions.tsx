import { useMutation } from '@apollo/client/react'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import type { ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { UpdatePostReactionMutation } from '@holi/core/screens/posts/queries'
import { type Post, ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export interface PostReactionsProps {
  post: Post
  onChange?: () => void
  style?: ViewStyle
}

const PostReactions: React.FC<PostReactionsProps> = ({ post, onChange, style }) => {
  const { t } = useTranslation()
  const { requireLogin } = useSignupModal()
  const { displayError } = useErrorHandling()
  const { track } = useTracking()

  const heartReactions = post.reactions.HEART
  const currentUserHasReacted = !!post.myReaction.HEART

  const [updatePostReaction] = useMutation(UpdatePostReactionMutation, {
    onCompleted: () => onChange?.(),
    onError: (error) =>
      displayError(error, 'Failed to update post reaction', {
        location: 'PostReactions.updatePostReaction',
        postId: post.id,
      }),
  })

  const reactOnPost = () => {
    updatePostReaction({
      variables: {
        id: post.id,
        reactionType: ReactionType.HEART,
        reactionAction: currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET,
      },
      onCompleted: () => {
        if (!currentUserHasReacted) {
          track(TrackingEvent.Engaging.reacted('Post', post.id))
        }
      },
      optimisticResponse: {
        updatePostReaction: {
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
  }

  return (
    <HoliReactionsCount
      onPress={() =>
        requireLogin(reactOnPost, {
          description: t('insights.reactions.post.loginRedirect.text'),
          trackTrigger: 'REACT_ON_POST',
        })
      }
      type="post"
      count={heartReactions}
      active={currentUserHasReacted}
      fullName={post.creator.fullName}
      style={style}
      testID="btn-react-to-post-HEART"
    />
  )
}

export default PostReactions

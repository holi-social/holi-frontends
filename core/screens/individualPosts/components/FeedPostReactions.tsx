import { useMutation } from '@apollo/client'
import type React from 'react'
import { useTranslation } from 'react-i18next'
import type { ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { UpdateFeedPostReactionMutation } from '@holi/core/screens/individualPosts/mutations'
import {
  type FeedPost,
  ReactionAction,
  ReactionType as FeedPostReactionType,
} from '@holi/core/screens/individualPosts/types'
import { UpdatePostReactionMutation } from '@holi/core/screens/posts/queries'
import {
  type Post,
  ReactionAction as PostReactionAction,
  ReactionType as PostReactionType,
} from '@holi/core/screens/posts/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import PostReactionCount from '@holi/core/screens/individualPosts/components/PostResponseBar/PostReactionCount'

export interface FeedPostReactionsProps {
  post: FeedPost | Post
  onChange?: () => void
  style?: ViewStyle
  showCount?: boolean
}

const FeedPostReactions: React.FC<FeedPostReactionsProps> = ({ post, onChange, style, showCount = true }) => {
  const { t } = useTranslation()
  const { isLoggedIn, user } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const { displayError } = useErrorHandling()
  const { track } = useTracking()

  const isFeedPost = post.__typename === 'FeedPost'
  const heartReactions = post.reactions.HEART
  const currentUserHasReacted = !!post.myReaction.HEART
  const authorName = isFeedPost ? (post as FeedPost).author.fullName : (post as Post).creator.fullName

  const [updateFeedPostReaction] = useMutation(UpdateFeedPostReactionMutation, {
    onCompleted: () => onChange?.(),
    onError: (error) =>
      displayError(error, 'Failed to update feed post reaction', {
        location: 'PostReactions.updateFeedPostReaction',
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

  const [updatePostReaction] = useMutation(UpdatePostReactionMutation, {
    onCompleted: () => onChange?.(),
    onError: (error) =>
      displayError(error, 'Failed to update post reaction', {
        location: 'PostReactions.updatePostReaction',
        postId: post.id,
      }),
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

  const reactOnPost = () => {
    if (isFeedPost) {
      if (!isLoggedIn) {
        openSignupModal({
          description: t('individuals.post.reaction.loginRedirect.text'),
          trackTrigger: 'REACT_ON_POST',
        })
      } else {
        const reactionAction = currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET
        const reactionType = FeedPostReactionType.HEART
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
    } else {
      // Regular Post
      if (!user) {
        return openSignupModal({
          description: t('insights.reactions.post.loginRedirect.text'),
          trackTrigger: 'REACT_ON_POST',
        })
      }
      updatePostReaction({
        variables: {
          id: post.id,
          reactionType: PostReactionType.HEART,
          reactionAction: currentUserHasReacted ? PostReactionAction.REMOVE : PostReactionAction.SET,
        },
        onCompleted: () => {
          if (!currentUserHasReacted) {
            track(TrackingEvent.Engaging.reacted('Post', post.id))
          }
        },
      })
    }
  }

  return (
    <PostReactionCount
      onPress={reactOnPost}
      type="post"
      count={heartReactions}
      active={currentUserHasReacted}
      fullName={authorName}
      style={style}
      showCount={showCount}
      testID={`btn-react-to-${isFeedPost ? 'feed-' : ''}post-HEART`}
    />
  )
}

export default FeedPostReactions

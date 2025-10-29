import { useMutation } from '@apollo/client/react'
import type React from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import {
  UpdateFeedPostReactionMutation,
  type UpdateFeedPostReactionResponse,
} from '@holi/core/screens/individualPosts/mutations'
import {
  type FeedPost,
  ReactionAction,
  ReactionType as FeedPostReactionType,
} from '@holi/core/screens/individualPosts/types'
import { UpdatePostReactionMutation, type UpdatePostReactionResponse } from '@holi/core/screens/posts/queries'
import {
  type Post,
  ReactionAction as PostReactionAction,
  ReactionType as PostReactionType,
} from '@holi/core/screens/posts/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import ReactButton from '@holi/core/components/reactions/ReactButton'

export interface PostReactButtonProps {
  post: FeedPost | Post
  onChange?: () => void
}

const PostReactButton: React.FC<PostReactButtonProps> = ({ post, onChange }) => {
  const { t } = useTranslation()
  const { requireLogin } = useSignupModal()
  const { displayError } = useErrorHandling()
  const { track } = useTracking()

  const isFeedPost = post.__typename === 'FeedPost'
  const currentUserHasReacted = !!post.myReaction.HEART
  const authorName = isFeedPost ? (post as FeedPost).author.fullName : (post as Post).creator.fullName

  const notActiveLabel = authorName
    ? t('insights.reactions.post.like', { name: authorName })
    : t('insights.reactions.post.like.noUser')
  const activeLabel = t('insights.reactions.post.unlike')
  const label = currentUserHasReacted ? activeLabel : notActiveLabel

  const [updateFeedPostReaction] = useMutation<UpdateFeedPostReactionResponse>(UpdateFeedPostReactionMutation, {
    onCompleted: () => onChange?.(),
    onError: (error) =>
      displayError(error, 'Failed to update feed post reaction', {
        location: 'PostReactions.updateFeedPostReaction',
        postId: post.id,
      }),
    optimisticResponse: {
      updateFeedPostReaction: {
        ...(post as FeedPost),
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

  const [updatePostReaction] = useMutation<UpdatePostReactionResponse>(UpdatePostReactionMutation, {
    onCompleted: () => onChange?.(),
    onError: (error) =>
      displayError(error, 'Failed to update post reaction', {
        location: 'PostReactions.updatePostReaction',
        postId: post.id,
      }),
    optimisticResponse: {
      updatePostReaction: {
        ...(post as Post),
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
    } else {
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
    <ReactButton
      onPress={() =>
        requireLogin(reactOnPost, {
          description: t('individuals.post.reaction.loginRedirect.text'),
          trackTrigger: 'REACT_ON_POST',
        })
      }
      active={currentUserHasReacted}
      label={label}
    />
  )
}

export default PostReactButton

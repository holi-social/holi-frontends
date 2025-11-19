import type { ApolloLink } from '@apollo/client'

import { useMutation } from '@apollo/client/react'

import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  AddReactionToCommentMutation,
  type AddReactionToCommentResponse,
  RemoveReactionFromCommentMutation,
  type RemoveReactionFromCommentResponse,
} from '@holi/core/screens/comments/mutations'
import type { ReactionType } from '@holi/core/screens/comments/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'

type ReactionFunction = (options?: {
  variables: {
    input: {
      commentId: string
      reactionType: ReactionType
    }
  }
}) => Promise<ApolloLink.Result>

type UseReactOnComment = [ReactionFunction, ReactionFunction, boolean, boolean]

const useReactOnComment = (id: string, reactionType: ReactionType): UseReactOnComment => {
  const { displayError } = useErrorHandling()
  const { track } = useTracking()

  const [addReaction, { loading: loadingAddReaction }] = useMutation<AddReactionToCommentResponse>(
    AddReactionToCommentMutation,
    {
      variables: {
        input: {
          commentId: id,
          reactionType,
        },
      },
      onCompleted: () => {
        track(TrackingEvent.Engaging.reacted('Comment', id))
      },
      onError: (error) =>
        displayError(error, 'Failed to add comment reaction', {
          location: 'CommentReactions.addReaction',
          commentId: id,
        }),
    }
  )

  const [removeReaction, { loading: loadingRemoveReaction }] = useMutation<RemoveReactionFromCommentResponse>(
    RemoveReactionFromCommentMutation,
    {
      variables: {
        input: {
          commentId: id,
          reactionType,
        },
      },
      onError: (error) =>
        displayError(error, 'Failed to remove comment reaction', {
          location: 'CommentReactions.removeReaction',
          commentId: id,
        }),
    }
  )

  return [addReaction, removeReaction, loadingAddReaction, loadingRemoveReaction]
}

export default useReactOnComment

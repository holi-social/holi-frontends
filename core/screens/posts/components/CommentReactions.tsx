import { useMutation } from '@apollo/client'
import React from 'react'
import { ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import { UpdatePostCommentReactionMutation, UpdatePostCommentReactionResponse } from '@holi/core/screens/posts/queries'
import { Comment, ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export interface CommentReactionsProps {
  comment: Comment
  onChange?: () => void
  style?: ViewStyle
}

const CommentReactions: React.VFC<CommentReactionsProps> = ({ comment, onChange, style }) => {
  const { isLoggedIn } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const { displayError } = useErrorHandling()

  const heartReactions = comment.reactions.HEART
  const currentUserHasReacted = !!comment.myReaction.HEART

  const [updatePostCommentReaction] = useMutation<UpdatePostCommentReactionResponse>(
    UpdatePostCommentReactionMutation,
    {
      onCompleted: () => onChange?.(),
      onError: (error) =>
        displayError(error, 'Failed to update post comment reaction', {
          location: 'CommentReactions.updatePostCommentReaction',
          commentId: comment.id,
        }),
    }
  )

  const reactOnComment = () => {
    if (!isLoggedIn) {
      return openLoginModal()
    }
    updatePostCommentReaction({
      variables: {
        id: comment.id,
        reactionType: ReactionType.HEART,
        reactionAction: currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET,
      },
    })
  }

  return (
    <HoliReactionsCount
      onPress={reactOnComment}
      type="comment"
      count={heartReactions}
      active={currentUserHasReacted}
      fullName={comment.creator.fullName}
      style={style}
      testID="btn-react-to-comment-HEART"
    />
  )
}

export default CommentReactions

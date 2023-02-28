import { useMutation } from '@apollo/client'
import React, { useCallback } from 'react'
import { ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import { UpdatePostCommentReactionMutation, UpdatePostCommentReactionResponse } from '@holi/core/screens/posts/queries'
import { Comment, ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export interface CommentReactionsProps {
  comment: Comment
  onChange?: () => void
  style?: ViewStyle
}

const CommentReactions: React.VFC<CommentReactionsProps> = ({ comment, onChange, style }) => {
  const { isLoggedIn } = useAuth()
  const { openLoginDialog } = useLoginRedirect()
  const { displayError } = useErrorHandling()

  // currently only HEART-reactions are displayed
  const heartReactions = comment.reactions.filter((reaction) => reaction.type === ReactionType.HEART)[0]
  const currentUserHasReacted = comment.myReaction === ReactionType.HEART

  const [updatePostCommentReaction] = useMutation<UpdatePostCommentReactionResponse>(
    UpdatePostCommentReactionMutation,
    {
      onCompleted: () => onChange?.(),
      onError: (error) => displayError(error),
    }
  )

  const reactOnComment = useCallback(() => {
    if (!isLoggedIn) {
      return openLoginDialog()
    }
    updatePostCommentReaction({
      variables: {
        id: comment.id,
        reactionType: ReactionType.HEART,
        reactionAction: currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET,
      },
    })
  }, [isLoggedIn, openLoginDialog, comment.id, currentUserHasReacted, updatePostCommentReaction])

  return (
    <HoliReactionsCount
      onPress={reactOnComment}
      type="comment"
      count={heartReactions.count}
      active={currentUserHasReacted}
      fullName={comment.creator.fullName}
      style={style}
    />
  )
}

export default CommentReactions

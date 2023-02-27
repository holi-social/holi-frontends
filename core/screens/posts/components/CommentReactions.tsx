import { useMutation } from '@apollo/client'
import React, { useCallback } from 'react'
import { ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import { UpdatePostCommentReactionMutation, UpdatePostCommentReactionResponse } from '@holi/core/screens/posts/queries'
import { Comment, ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export type CommentReactionsProps = {
  comment: Comment
  onChange?: () => void
  style?: ViewStyle
}

const CommentReactions: React.VFC<CommentReactionsProps> = ({ comment, onChange, style }) => {
  const { isLoggedIn } = useAuth()
  const { openLoginDialog } = useLoginRedirect()

  // currently only HEART-reactions are displayed
  const heartReactions = comment.reactions.filter((reaction) => reaction.type === ReactionType.HEART)[0]
  const currentUserHasReacted = comment.myReaction === ReactionType.HEART

  const [updatePostCommentReaction] = useMutation<UpdatePostCommentReactionResponse>(
    UpdatePostCommentReactionMutation,
    {
      onCompleted: (response) => {
        onChange?.()
        console.log('updateCommentReaction done', response)
      },
      onError: (error) => {
        // TODO: show some error
        console.log('updateCommentReaction error', error)
      },
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
      count={heartReactions ? heartReactions.count : 0}
      active={currentUserHasReacted}
      fullName={comment.creator.fullName}
      style={style}
    />
  )
}

export default CommentReactions

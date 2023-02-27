import { useMutation } from '@apollo/client'
import React, { useCallback } from 'react'
import { ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import { UpdatePostReactionMutation, UpdatePostReactionResponse } from '@holi/core/screens/posts/queries'
import { Post, ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export type PostReactionsProps = {
  post: Post
  onChange?: () => void
  style?: ViewStyle
}

const PostReactions: React.VFC<PostReactionsProps> = ({ post, onChange, style }) => {
  const { isLoggedIn } = useAuth()
  const { openLoginDialog } = useLoginRedirect()

  // currently only HEART-reactions are displayed
  const heartReactions = post.reactions.filter((reaction) => reaction.type === ReactionType.HEART)[0]
  const currentUserHasReacted = post.myReaction === ReactionType.HEART

  const [updatePostReaction] = useMutation<UpdatePostReactionResponse>(UpdatePostReactionMutation, {
    onCompleted: (response) => {
      onChange?.()
      console.log('updateReaction done', response)
    },
    onError: (error) => {
      // TODO: react on error
      console.log('updateReaction error', error)
    },
  })

  const reactOnPost = useCallback(() => {
    if (!isLoggedIn) {
      return openLoginDialog()
    }
    updatePostReaction({
      variables: {
        id: post.id,
        reactionType: ReactionType.HEART,
        reactionAction: currentUserHasReacted ? ReactionAction.REMOVE : ReactionAction.SET,
      },
    })
  }, [isLoggedIn, openLoginDialog, post.id, currentUserHasReacted, updatePostReaction])

  return (
    <HoliReactionsCount
      onPress={reactOnPost}
      type="post"
      count={heartReactions ? heartReactions.count : 0}
      active={currentUserHasReacted}
      fullName={post.creator.fullName}
      style={style}
    />
  )
}

export default PostReactions

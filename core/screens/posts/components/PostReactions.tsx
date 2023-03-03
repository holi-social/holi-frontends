import { useMutation } from '@apollo/client'
import React from 'react'
import { ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginRedirect } from '@holi/core/provider/LoginRedirectProvider'
import { UpdatePostReactionMutation, UpdatePostReactionResponse } from '@holi/core/screens/posts/queries'
import { Post, ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export interface PostReactionsProps {
  post: Post
  onChange?: () => void
  style?: ViewStyle
}

const PostReactions: React.VFC<PostReactionsProps> = ({ post, onChange, style }) => {
  const { isLoggedIn } = useAuth()
  const { openLoginDialog } = useLoginRedirect()
  const { displayError } = useErrorHandling()

  const heartReactions = post.reactions.HEART
  const currentUserHasReacted = !!post.myReaction.HEART

  const [updatePostReaction] = useMutation<UpdatePostReactionResponse>(UpdatePostReactionMutation, {
    onCompleted: () => onChange?.(),
    onError: (error) => displayError(error),
  })

  const reactOnPost = () => {
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
  }

  return (
    <HoliReactionsCount
      onPress={reactOnPost}
      type="post"
      count={heartReactions}
      active={currentUserHasReacted}
      fullName={post.creator.fullName}
      style={style}
    />
  )
}

export default PostReactions

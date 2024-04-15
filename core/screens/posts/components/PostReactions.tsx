import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import { UpdatePostReactionMutation, UpdatePostReactionResponse } from '@holi/core/screens/posts/queries'
import { Post, ReactionAction, ReactionType } from '@holi/core/screens/posts/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliReactionsCount from '@holi/ui/components/molecules/HoliReactionsCount'

export interface PostReactionsProps {
  post: Post
  onChange?: () => void
  style?: ViewStyle
}

const PostReactions: React.FC<PostReactionsProps> = ({ post, onChange, style }) => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const { openLoginModal } = useLoginModal()
  const { displayError } = useErrorHandling()

  const heartReactions = post.reactions.HEART
  const currentUserHasReacted = !!post.myReaction.HEART

  const [updatePostReaction] = useMutation<UpdatePostReactionResponse>(UpdatePostReactionMutation, {
    onCompleted: () => onChange?.(),
    onError: (error) =>
      displayError(error, 'Failed to update post reaction', {
        location: 'PostReactions.updatePostReaction',
        postId: post.id,
      }),
  })

  const reactOnPost = () => {
    if (!user) {
      return openLoginModal({
        description: t('insights.reactions.post.loginRedirect.text'),
      })
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
      testID="btn-react-to-post-HEART"
    />
  )
}

export default PostReactions

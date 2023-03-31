import { ApolloError, useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { DeletePostCommentMutation, DeletePostCommentResponse } from '@holi/core/screens/posts/queries'
import { PostById } from '@holi/core/screens/posts/queries'
import { Comment } from '@holi/core/screens/posts/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliConfirmation, { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { colors } from '@holi/ui/styles/globalVars'

export interface CommentDeleteButtonProps {
  comment: Comment
  postId: string
  onConfirm?: () => void
  style?: StyleProp<ViewStyle>
  testID?: string
}

const CommentDeleteButton: React.VFC<CommentDeleteButtonProps> = ({ comment, postId, onConfirm, style, testID }) => {
  const { t } = useTranslation()
  const { user } = useLoggedInUser()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const { isLoggedIn } = useLoggedInUser()

  const [deleteComment, { loading }] = useMutation<DeletePostCommentResponse>(DeletePostCommentMutation, {
    variables: { id: comment.id },
    onCompleted: () => {
      openToast(t('insights.posts.comment.delete.success'), HoliToastType.SUCCESS, 3000)
      onConfirm?.()
    },
    onError: (error: ApolloError) => {
      onConfirm?.()
      displayError(error, t('global.technicalError'), 5000)
    },
    refetchQueries: [{ query: PostById, variables: { id: postId } }],
  })

  // state props for confirmation modal
  const { setShow: setShowConfirmationModal, props: confirmationStateProps } = useConfirmationState({
    onConfirm: () => {
      setShowConfirmationModal(false)
      deleteComment()
    },
  })

  if (!isLoggedIn || user?.id !== comment.creator.id) return <></>

  return (
    <>
      <MoreOptionItem
        label={t('insights.posts.comment.delete')}
        icon="delete"
        tintColor={colors.error20}
        loading={loading}
        onPress={() => setShowConfirmationModal(true)}
        contentStyle={style}
        testID={testID}
      />

      <HoliConfirmation
        label={t('insights.posts.comment.delete')}
        title={t('insights.posts.comment.delete')}
        description={t('insights.posts.comment.delete.confirm.text')}
        confirmText={t('insights.posts.comment.delete')}
        confirmationButtonType="warning"
        testID="delete-comment"
        {...confirmationStateProps}
      />
    </>
  )
}

export default CommentDeleteButton

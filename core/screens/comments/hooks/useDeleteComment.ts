import { useMutation } from '@apollo/client'
import type { ApolloError, FetchResult, MutationFunctionOptions } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { DeleteCommentMutation, DeleteCommentResponse } from '@holi/core/screens/comments/mutations'
import { CommentableType } from '@holi/core/screens/comments/types'
import { PostById } from '@holi/core/screens/posts/queries'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type UseDeleteComment = [boolean, (options?: MutationFunctionOptions) => Promise<FetchResult>]

const useDeleteComment = (
  id: string,
  commentableId: string,
  commentableType: CommentableType,
  handleConfirm?: () => void
): UseDeleteComment => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const [deleteComment, { loading: isLoadingCommentDelete }] = useMutation<DeleteCommentResponse>(
    DeleteCommentMutation,
    {
      variables: { id },
      onCompleted: () => {
        openToast(t('comment.delete.success'), HoliToastType.SUCCESS)
        handleConfirm?.()
      },
      onError: (error: ApolloError) => {
        handleConfirm?.()
        displayError(error, 'Failed to delete comment', {
          location: 'useDeleteComment',
          commentId: id,
          commentableId,
          commentableType,
        })
      },
      refetchQueries:
        commentableType === CommentableType.POST
          ? [{ query: PostById, variables: { id: commentableId }, fetchPolicy: 'network-only' }]
          : [],
    }
  )

  return [isLoadingCommentDelete, deleteComment]
}

export default useDeleteComment

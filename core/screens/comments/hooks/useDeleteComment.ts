import type { ApolloLink, ErrorLike } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { DeleteCommentMutation, type DeleteCommentResponse } from '@holi/core/screens/comments/mutations'
import { commentsByCommentable, commentsMetadata } from '@holi/core/screens/comments/queries'
import { CommentableType } from '@holi/core/screens/comments/types'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { PostById } from '@holi/core/screens/posts/queries'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { useCallback } from 'react'

export type UseDeleteComment = [boolean, (options?: useMutation.MutationFunctionOptions) => Promise<ApolloLink.Result>]

const useDeleteComment = (
  id: string,
  commentableId: string,
  commentableType: CommentableType,
  handleConfirm?: () => void
): UseDeleteComment => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const commonQueries = [
    {
      query: commentsByCommentable,
      variables: { commentableId, commentableType },
      fetchPolicy: 'network-only',
    },
    {
      query: commentsMetadata,
      variables: { commentableId, commentableType },
      fetchPolicy: 'network-only',
    },
  ]

  const refetchQueriesMap = {
    [CommentableType.POST]: [
      { query: lastInsightsQuery },
      {
        query: PostById,
        variables: { id: commentableId },
        fetchPolicy: 'network-only',
      },
      ...commonQueries,
    ],
    [CommentableType.DISCUSSION]: [{ query: lastInsightsQuery }, ...commonQueries],
  }

  // @ts-ignore
  const refetchQueries = refetchQueriesMap[commentableType] || commonQueries

  const [deleteComment, { loading: isLoadingCommentDelete }] = useMutation<DeleteCommentResponse>(
    DeleteCommentMutation,
    {
      onCompleted: () => {
        openToast(t('comment.delete.success'), HoliToastType.SUCCESS)
        handleConfirm?.()
      },
      onError: (error: ErrorLike) => {
        handleConfirm?.()
        displayError(error, 'Failed to delete comment', {
          location: 'useDeleteComment',
          commentId: id,
          commentableId,
          commentableType,
        })
      },
      refetchQueries,
    }
  )

  const deleteCommentCallback = useCallback(
    () =>
      deleteComment({
        variables: { id },
      }),
    [deleteComment, id]
  )

  return [isLoadingCommentDelete, deleteCommentCallback]
}

export default useDeleteComment

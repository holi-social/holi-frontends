import { useMutation } from '@apollo/client'
import type { ApolloError, FetchResult, MutationFunctionOptions } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { DeletePostCommentResponse, PostById } from '@holi/core/screens/posts/queries'
import { DeletePostCommentMutation } from '@holi/core/screens/posts/queries'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type UseDeleteComment = [boolean, (options?: MutationFunctionOptions) => Promise<FetchResult>]

const useDeleteComment = (id: string, postId: string, handleConfirm?: () => void): UseDeleteComment => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const [deleteComment, { loading: isLoadingCommentDelete }] = useMutation<DeletePostCommentResponse>(
    DeletePostCommentMutation,
    {
      variables: { id },
      onCompleted: () => {
        openToast(t('insights.posts.comment.delete.success'), HoliToastType.SUCCESS, 3000)
        handleConfirm?.()
      },
      onError: (error: ApolloError) => {
        handleConfirm?.()
        displayError(error, t('global.technicalError'), 5000)
      },
      refetchQueries: [{ query: PostById, variables: { id: postId } }],
    }
  )

  return [isLoadingCommentDelete, deleteComment]
}

export default useDeleteComment

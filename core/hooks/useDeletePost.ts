import { useMutation } from '@apollo/client'
import type { ApolloError } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { deleteSpacePostMutation } from '@holi/core/screens/spaces/updates/mutations'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

const useDeletePost = (postId: string, handleConfirm?: () => void) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const [deletePost, { loading: isLoadingPostDeletion }] = useMutation<null>(deleteSpacePostMutation, {
    variables: { id: postId },
    onCompleted: () => {
      openToast(t('insights.post.delete.success'), HoliToastType.SUCCESS, 3000)
      handleConfirm?.()
    },
    onError: (error: ApolloError) => {
      handleConfirm?.()
      displayError(error, t('global.technicalError'), 5000)
    },
    refetchQueries: [spacePostsQuery],
  })

  return { isLoadingPostDeletion, deletePost }
}

export default useDeletePost

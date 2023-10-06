import { useMutation } from '@apollo/client'
import type { ApolloError } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { Post } from '@holi/core/screens/posts/types'
import { VisibilityFilter } from '@holi/core/screens/spaces/types'
import { deleteSpacePostMutation } from '@holi/core/screens/spaces/updates/mutations'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

const useDeletePost = (post: Post, spaceIdOrName?: string, handleConfirm?: () => void) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const [deletePost, { loading: isLoadingPostDeletion }] = useMutation<null>(deleteSpacePostMutation, {
    variables: { id: post.id },
    onCompleted: () => {
      openToast(t('insights.post.delete.success'), HoliToastType.SUCCESS)
      handleConfirm?.()
    },
    onError: (error: ApolloError) => {
      handleConfirm?.()
      displayError(error, 'Failed to delete post', {
        location: 'useDeletePost',
        postId: post.id,
        spaceIdOrName,
      })
    },
    // refetch first page of both the current visibility filter and the ALL filter
    refetchQueries: spaceIdOrName
      ? [
          {
            query: spacePostsQuery,
            variables: {
              idOrName: spaceIdOrName,
              offset: 0,
              limit: 10,
              visibility: post.isPublic ? VisibilityFilter.PUBLIC : VisibilityFilter.MEMBERS,
            },
          },
          {
            query: spacePostsQuery,
            variables: { idOrName: spaceIdOrName, offset: 0, limit: 10, visibility: VisibilityFilter.ALL },
          },
        ]
      : [],
  })

  return { isLoadingPostDeletion, deletePost }
}

export default useDeletePost

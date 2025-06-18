import type { ApolloError } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import type { Post } from '@holi/core/screens/posts/types'

import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import {
  SpacePostsBySpaceIdDocument,
  useDeleteSpacePostMutation,
  VisibilityFilter,
} from '@holi/api/graphql/graphql-codegen'

const useDeletePost = (post: Post, spaceIdOrName?: string, handleConfirm?: () => void) => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const [deletePost, { loading: isLoadingPostDeletion }] = useDeleteSpacePostMutation({
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
            query: SpacePostsBySpaceIdDocument,
            variables: {
              idOrName: spaceIdOrName,
              offset: 0,
              limit: 10,
              visibility: post.isPublic ? VisibilityFilter.Public : VisibilityFilter.Members,
            },
          },
          {
            query: SpacePostsBySpaceIdDocument,
            variables: { idOrName: spaceIdOrName, offset: 0, limit: 10, visibility: VisibilityFilter.All },
          },
        ]
      : [],
  })

  return { isLoadingPostDeletion, deletePost }
}

export default useDeletePost

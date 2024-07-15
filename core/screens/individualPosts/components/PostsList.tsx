import { ApolloError, DocumentNode } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import PostsListResults from '@holi/core/screens/individualPosts/components/PostsListResults'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type PostsListProps = {
  paginationOptions: PaginationQueryHookOptions
  postsQuery: DocumentNode
  emptyMessage?: ReactNode
  showVisibilityBadge?: boolean
}

const PostsList = ({
  postsQuery: allPostsQuery,
  paginationOptions,
  emptyMessage,
  showVisibilityBadge = false,
}: PostsListProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const mixins = useStyleMixins()

  const queryOptions: PaginationQueryHookOptions = {
    ...{
      fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
      onError: (error: ApolloError) => {
        displayError(error, 'Failed to query posts', {
          location: 'allPostsQuery',
        })
      },
    },
    ...paginationOptions,
  }

  return (
    <SpaceTermContextProvider>
      <Pagination
        query={allPostsQuery}
        queryOptions={queryOptions}
        fetchMoreButtonProps={{
          type: 'secondary',
          style: mixins.moreButton,
        }}
        fetchMoreButtonLabel={t('individuals.post.loadMoreText')}
      >
        <PostsListResults emptyMessage={emptyMessage} showVisibilityBadge={showVisibilityBadge} />
      </Pagination>
    </SpaceTermContextProvider>
  )
}

export default withProfiler(PostsList, { name: 'PostsList' })

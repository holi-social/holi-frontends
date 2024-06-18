import { ApolloError, DocumentNode } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import PostsListResults from '@holi/core/screens/individualPosts/components/PostsListResults'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type PostsListProps = {
  paginationOptions: PaginationQueryHookOptions
  feedPostsQuery: DocumentNode
  emptyMessage?: ReactNode
  showVisibilityBadge?: boolean
}

const PostsList = ({
  feedPostsQuery,
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
        displayError(error, 'Failed to query feed posts', {
          location: 'feedPostsQuery',
        })
      },
    },
    ...paginationOptions,
  }

  return (
    <Pagination
      query={feedPostsQuery}
      queryOptions={queryOptions}
      fetchMoreButtonProps={{
        type: 'secondary',
        style: mixins.moreButton,
      }}
      fetchMoreButtonLabel={t('individuals.post.loadMoreText')}
    >
      <PostsListResults emptyMessage={emptyMessage} showVisibilityBadge={showVisibilityBadge} />
    </Pagination>
  )
}

export default withProfiler(PostsList, { name: 'PostsList' })

import { ApolloError, DocumentNode } from '@apollo/client'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination, usePaginationContext } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import PostCard from '@holi/core/screens/individualPosts/components/PostCard'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type PostsListProps = {
  paginationOptions: PaginationQueryHookOptions
  feedPostsQuery: DocumentNode
  emptyMessage?: ReactNode
  showVisibilityBadge?: boolean
}

type PostsListResultsProps = {
  emptyMessage?: ReactNode
  showVisibilityBadge?: boolean
}

const PostsListResults = ({ emptyMessage, showVisibilityBadge }: PostsListResultsProps) => {
  const { loading, data, totalResults } = usePaginationContext<FeedPost>()

  return (
    <HoliGridWrapper gap={Spacing.xxs}>
      {loading ? (
        <LoadingSkeleton />
      ) : totalResults === 0 ? (
        emptyMessage
      ) : (
        data.map((p) => (
          <HoliGridCell key={p.id}>
            <PostCard post={p} showVisibilityBadge={showVisibilityBadge} />
          </HoliGridCell>
        ))
      )}
    </HoliGridWrapper>
  )
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

const LoadingSkeleton = () => <HoliSkeleton height={60} width="100%" borderRadius={20} />

export default PostsList

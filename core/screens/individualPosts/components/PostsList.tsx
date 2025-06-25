import type { ApolloError, DocumentNode } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import PostsListResults from '@holi/core/screens/individualPosts/components/PostsListResults'
import { dimensions } from '@holi/ui/styles/globalVars'
import type { DimensionValue, FlexAlignType } from 'react-native'

type PostsListProps = {
  paginationOptions: PaginationQueryHookOptions
  postsQuery: DocumentNode
  emptyMessage?: ReactNode
  showVisibilityBadge?: boolean
}

const PostsList = ({ postsQuery, paginationOptions, emptyMessage, showVisibilityBadge = false }: PostsListProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const styles = getStyles()

  const queryOptions: PaginationQueryHookOptions = {
    ...{
      fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
      onError: (error: ApolloError) => {
        displayError(error, 'Failed to query posts', {
          location: 'PostsList',
        })
      },
    },
    ...paginationOptions,
  }

  return (
    <Pagination
      query={postsQuery}
      queryOptions={queryOptions}
      fetchMoreButtonProps={{
        variant: 'secondary',
        style: styles.button,
      }}
      fetchMoreButtonLabel={t('individuals.post.loadMoreText')}
    >
      <PostsListResults emptyMessage={emptyMessage} showVisibilityBadge={showVisibilityBadge} />
    </Pagination>
  )
}

export default withProfiler(PostsList, { name: 'PostsList' })

const getStyles = () => ({
  button: {
    marginVertical: 24,
    maxWidth: dimensions.maxButtonWidth,
    alignSelf: 'center' as FlexAlignType,
    width: '100%' as DimensionValue,
  },
})

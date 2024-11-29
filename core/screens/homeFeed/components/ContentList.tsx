import type { ApolloError, DocumentNode } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import ContentListResults from '@holi/core/screens/homeFeed/components/ContentListResults'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ContentListProps = {
  paginationOptions: PaginationQueryHookOptions
  postsQuery: DocumentNode
  emptyMessage?: ReactNode
  showVisibilityBadge?: boolean
}

const ContentList = ({
  postsQuery: feedQuery,
  paginationOptions,
  emptyMessage,
  showVisibilityBadge = false,
}: ContentListProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const mixins = useStyleMixins()

  const queryOptions: PaginationQueryHookOptions = {
    ...{
      fetchPolicy: 'cache-and-network',
      onError: (error: ApolloError) => {
        displayError(error, 'Failed to query posts', {
          location: 'feed',
        })
      },
    },
    ...paginationOptions,
  }

  return (
    <SpaceTermContextProvider>
      <Pagination
        query={feedQuery}
        queryOptions={queryOptions}
        fetchMoreButtonProps={{
          type: 'secondary',
          style: mixins.moreButton,
        }}
        loadMoreOnScroll
        // fetchMoreButtonLabel={t('individuals.post.loadMoreText')}
      >
        <ContentListResults emptyMessage={emptyMessage} showVisibilityBadge={showVisibilityBadge} />
      </Pagination>
    </SpaceTermContextProvider>
  )
}

export default withProfiler(ContentList, { name: 'ContentList' })

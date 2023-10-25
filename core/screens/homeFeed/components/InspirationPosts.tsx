import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import InspirationPostsList from '@holi/core/screens/homeFeed/components/InspirationPostsList'
import { inspirationPostsQuery } from '@holi/core/screens/homeFeed/queries'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export const POSTS_PAGE_SIZE = 4

const InspirationPosts = () => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const mixins = useStyleMixins()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: POSTS_PAGE_SIZE,
    queryPath: 'inspirationPosts',
    onError: (error) => {
      displayError(error, 'Failed to query inspiration posts', {
        location: 'inspirationPostsQuery',
      })
    },
    fetchPolicy: 'cache-first',
  }

  return (
    <View style={mixins.container}>
      <Pagination
        query={inspirationPostsQuery}
        queryOptions={queryOptions}
        fetchMoreButtonProps={{
          type: 'secondary',
          style: mixins.moreButton,
          testID: 'btn-inspiration-posts-list-load-more',
        }}
        fetchMoreButtonLabel={t('homeFeed.inspirationPosts.loadMoreText')}
      >
        <InspirationPostsList />
      </Pagination>
    </View>
  )
}

export default withProfiler(InspirationPosts, { name: 'InspirationPosts' })

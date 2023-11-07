import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { Pagination, usePaginationContext } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import { inspirationPostsQuery } from '@holi/core/screens/homeFeed/queries'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import { Post } from '@holi/core/screens/posts/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const POSTS_PAGE_SIZE = 4

const InspirationPostsList = () => {
  const { loading, data: posts, totalResults } = usePaginationContext<Post>()

  const { t } = useTranslation()

  const postGridItemsInRow = useBreakpointMatcher()

  if (!loading && !totalResults) return <></>

  return (
    <>
      <HoliBox padding={[0, 0, 24, 0]}>
        <HoliHeading size="large">{t('homeFeed.inspirationPosts.heading')}</HoliHeading>
      </HoliBox>
      <HoliGridWrapper itemsInRow={postGridItemsInRow}>
        {loading
          ? new Array(POSTS_PAGE_SIZE).fill(1).map((_, idx) => (
              <HoliGridCell key={idx}>
                <PostPreview style={styles.item} loading />
              </HoliGridCell>
            ))
          : posts.map((post) => (
              <HoliGridCell key={post.id}>
                <PostPreview post={post} />
              </HoliGridCell>
            ))}
      </HoliGridWrapper>
    </>
  )
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
  },
})

const InspirationPosts = () => {
  const { ftEnabled } = useFeatureToggle(FeatureToggleName.FEED_DAILY_INSPIRATION)
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

  if (!ftEnabled) return <></>

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

import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { Pagination, usePaginationContext } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import { inspirationPostsQuery } from '@holi/core/screens/homeFeed/queries'
import PostPreview from '@holi/core/screens/posts/components/PostPreview'
import { Post } from '@holi/core/screens/posts/types'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export const POSTS_PAGE_SIZE = 2
const POSTS_TEXT_LINES_SHOWN = 5

const InspirationPostsList = () => {
  const { t } = useTranslation()

  const { loading, data: posts, totalResults } = usePaginationContext<Post>()
  if (!loading && !totalResults) {
    return null
  }

  return (
    <>
      <HoliHeading size="l" testID="home-feed-inspiration-posts-heading">
        {t('homeFeed.inspirationPosts.heading')}
      </HoliHeading>
      <HoliGap />
      <HoliGridWrapper>
        {loading
          ? new Array(POSTS_PAGE_SIZE).fill(1).map((_, idx) => (
              <HoliGridCell key={idx}>
                <PostPreview style={styles.item} numberOfLines={POSTS_TEXT_LINES_SHOWN} loading />
              </HoliGridCell>
            ))
          : posts.map((post) => (
              <HoliGridCell key={post.id}>
                <PostPreview post={post} numberOfLines={POSTS_TEXT_LINES_SHOWN} />
              </HoliGridCell>
            ))}
      </HoliGridWrapper>
    </>
  )
}

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
  }

  const { ftEnabled, ftLoading } = useFeatureToggle(FeatureToggleName.FEED_DAILY_INSPIRATION)
  if (!ftLoading && !ftEnabled) {
    return <></>
  }

  return (
    <HoliContainer>
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
    </HoliContainer>
  )
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
  },
})

export default withProfiler(InspirationPosts, { name: 'InspirationPosts' })

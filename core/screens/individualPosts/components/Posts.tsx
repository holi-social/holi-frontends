import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination, usePaginationContext } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import PostCard from '@holi/core/screens/individualPosts/components/PostCard'
import { feedPostsQuery } from '@holi/core/screens/individualPosts/queries'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export const Posts = () => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const mixins = useStyleMixins()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: 2,
    queryPath: 'feedPosts',
    onError: (error) => {
      displayError(error, 'Failed to query feed posts', {
        location: 'feedPostsQuery',
      })
    },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
  }

  return (
    <HoliContainer>
      <Pagination
        query={feedPostsQuery}
        queryOptions={queryOptions}
        fetchMoreButtonProps={{
          type: 'secondary',
          style: [mixins.moreButton],
          testID: 'btn-posts-feed-load-more',
        }}
        fetchMoreButtonLabel={t('individuals.post.loadMoreText')}
      >
        <FeedPostsList />
      </Pagination>
    </HoliContainer>
  )
}
export const FeedPostsList = () => {
  const { loading, data: posts, totalResults } = usePaginationContext<FeedPost>()

  return (
    <HoliContainer noPadding gap={Spacing.xxs}>
      {loading ? (
        <PostsLoadingSkeleton />
      ) : totalResults === 0 ? null : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </HoliContainer>
  )
}
const PostsLoadingSkeleton = () => (
  <View>
    <HoliSkeleton height={100} width="100%" borderRadius={20} />
    <HoliGap size={'s'} />
    <HoliSkeleton height={100} width="100%" borderRadius={20} />
  </View>
)

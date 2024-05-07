import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { Pagination, usePaginationContext } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import EmptyPosts from '@holi/core/screens/individualPosts/components/EmptyPosts'
import PostCard from '@holi/core/screens/individualPosts/components/PostCard'
import { myPostsQuery } from '@holi/core/screens/individualPosts/queries'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const MyPostsList = () => {
  const { loading, data: myPosts, totalResults } = usePaginationContext<FeedPost>()

  return (
    <HoliContainer gap={Spacing.xxs}>
      {loading ? (
        <LoadingSkeleton />
      ) : totalResults === 0 ? (
        <EmptyPosts />
      ) : (
        myPosts.map((p) => <PostCard key={p.id} post={p} showVisibilityBadge />)
      )}
    </HoliContainer>
  )
}

const MyPostsTab = () => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const mixins = useStyleMixins()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: 10,
    queryPath: 'myPosts',
    onError: (error) => {
      displayError(error, 'Failed to query my posts', {
        location: 'myPostsQuery',
      })
    },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
  }

  return (
    <View style={styles.container}>
      <Pagination
        query={myPostsQuery}
        queryOptions={queryOptions}
        fetchMoreButtonProps={{
          type: 'secondary',
          style: mixins.moreButton,
          testID: 'btn-my-posts-list-load-more',
        }}
        fetchMoreButtonLabel={t('individuals.post.loadMoreText')}
      >
        <MyPostsList />
      </Pagination>
    </View>
  )
}

const LoadingSkeleton = () => <HoliSkeleton height={60} width="100%" borderRadius={20} />

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.xs,
    height: '100%',
  },
})

export default MyPostsTab

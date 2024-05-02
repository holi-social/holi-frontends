import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { Pagination, usePaginationContext } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import EmptyPosts from '@holi/core/screens/individualPosts/components/EmptyPosts'
import PostCard from '@holi/core/screens/individualPosts/components/PostCard'
import { myPostsQuery } from '@holi/core/screens/individualPosts/queries'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const MyPostsList = () => {
  const { loading, data: myPosts, totalResults } = usePaginationContext<FeedPost>()

  if (!loading && !totalResults) {
    return null
  }

  return (
    <HoliContainer gap={Spacing.xxs}>
      {loading ? (
        <LoadingSkeleton />
      ) : totalResults === 0 ? (
        <EmptyPosts />
      ) : (
        myPosts.map((p) => <PostCard key={p.id} post={p} />)
      )}
    </HoliContainer>
  )
}

const MyPostsTab = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background20,
      paddingVertical: Spacing.xs,
      height: '100%',
    },
  })

export default MyPostsTab

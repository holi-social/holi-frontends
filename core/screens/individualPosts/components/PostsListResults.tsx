import { MasonryFlashList } from '@shopify/flash-list'
import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import PostCard from '@holi/core/screens/individualPosts/components/PostCard'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'

const ESTIMATED_POST_HEIGHT = 450
const HALF_PADDING = Spacing.xxs / 2

export type PostsListResultsProps = {
  emptyMessage?: ReactNode
  showVisibilityBadge?: boolean
}

const PostsListResults = ({ emptyMessage, showVisibilityBadge }: PostsListResultsProps) => {
  const { data, loading, totalResults } = usePaginationContext<FeedPost>()
  const numberOfColumns = useBreakpointMatcher() || 1

  if (totalResults == 0) return emptyMessage

  return (
    <View style={{ margin: -HALF_PADDING }}>
      <MasonryFlashList
        data={data}
        renderItem={({ item }) => (
          <HoliBox padding={HALF_PADDING}>
            <PostCard post={item} showVisibilityBadge={showVisibilityBadge} />
          </HoliBox>
        )}
        keyExtractor={(post) => post.id}
        numColumns={numberOfColumns}
        refreshing={loading}
        estimatedItemSize={ESTIMATED_POST_HEIGHT}
      />
    </View>
  )
}

const PostSkeleton = () => (
  <HoliGridCell>
    <View style={skeletonStyles.container}>
      <View style={skeletonStyles.userBox}>
        <HoliSkeleton height={44} width={44} borderRadius={80} />
        <View style={skeletonStyles.metadata}>
          <HoliSkeleton height={22} width={120} borderRadius={10} />
          <HoliSkeleton height={14} width={80} borderRadius={10} />
        </View>
      </View>
      <HoliSkeleton height={22} width={200} borderRadius={20} />
      <HoliSkeleton height={60} width="100%" borderRadius={10} />
      <HoliSkeleton height={160} width="100%" borderRadius={20} />
    </View>
  </HoliGridCell>
)

const LoadingSkeleton = () => (
  <>
    <PostSkeleton />
    <PostSkeleton />
  </>
)

const skeletonStyles = StyleSheet.create({
  container: {
    gap: 10,
    padding: Spacing.xs,
  },
  userBox: {
    flexDirection: 'row',
    gap: 10,
  },
  metadata: {
    gap: 6,
  },
})

export default PostsListResults

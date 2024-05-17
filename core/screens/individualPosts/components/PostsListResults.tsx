import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { createUUID } from '@holi/core/helpers'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import PostCard from '@holi/core/screens/individualPosts/components/PostCard'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'

const HALF_PADDING = Spacing.xs / 2

export type PostsListResultsProps = {
  emptyMessage?: ReactNode
  showVisibilityBadge?: boolean
}

const PostsListResults = ({ emptyMessage, showVisibilityBadge }: PostsListResultsProps) => {
  const { data, loading, totalResults } = usePaginationContext<FeedPost>()

  if (totalResults == 0) return emptyMessage
  if (loading) return <LoadingSkeleton />

  return (
    <HoliGridWrapper gap={Spacing.xxs}>
      {loading ? (
        <LoadingSkeleton />
      ) : totalResults === 0 ? (
        emptyMessage
      ) : (
        data.map((p) => (
          <HoliGridCell key={createUUID()}>
            <PostCard post={p} key={createUUID()} showVisibilityBadge={showVisibilityBadge} />
          </HoliGridCell>
        ))
      )}
    </HoliGridWrapper>
  )
}

const PostSkeleton = () => (
  <HoliGridCell>
    <View style={styles.skeletonPost}>
      <View style={styles.skeletonUserContainer}>
        <HoliSkeleton height={44} width={44} borderRadius={80} />
        <View style={styles.skeletonMetadata}>
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
  <HoliGridWrapper gap={Spacing.xs}>
    <PostSkeleton />
    <PostSkeleton />
  </HoliGridWrapper>
)

const styles = StyleSheet.create({
  container: {
    margin: -HALF_PADDING,
    minHeight: 10,
  },
  skeletonPost: {
    gap: 10,
  },
  skeletonUserContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  skeletonMetadata: {
    gap: 6,
  },
})

export default PostsListResults

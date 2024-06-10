import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import PostCard from '@holi/core/screens/individualPosts/components/PostCard'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import Spacing from '@holi/ui/foundations/Spacing'

export type PostsListResultsProps = {
  emptyMessage?: ReactNode
  showVisibilityBadge?: boolean
}

export const simpleColumnSortingByIndex = <T,>(posts: readonly T[], numberOfColumns: number): T[][] => {
  if (numberOfColumns === 0) return new Array<T[]>()

  return posts.reduce((previous, p, index) => {
    const mod = index % numberOfColumns
    previous[mod] = previous[mod].concat(p)
    return previous
  }, new Array<T[]>(numberOfColumns).fill(new Array<T>()))
}

const PostsListResults = ({ emptyMessage, showVisibilityBadge }: PostsListResultsProps) => {
  const { data, loading, totalResults } = usePaginationContext<FeedPost>()
  const numberOfColumns = useBreakpointMatcher() || 1

  if (loading) return <LoadingSkeleton columns={numberOfColumns} />
  if (totalResults == 0) return emptyMessage

  const dataByColumns = simpleColumnSortingByIndex(data, numberOfColumns)

  return (
    <View style={styles.container}>
      {dataByColumns.map((column, index) => (
        <View key={index} style={styles.column}>
          {column.map((p) => (
            <PostCard post={p} showVisibilityBadge={showVisibilityBadge} key={p.id} />
          ))}
        </View>
      ))}
    </View>
  )
}

const PostSkeleton = () => (
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
)

const LoadingSkeleton = () => (
  <View style={styles.container}>
    <View style={styles.column}>
      <PostSkeleton />
      <PostSkeleton />
    </View>
    <View style={styles.column}>
      <PostSkeleton />
      <PostSkeleton />
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  column: {
    flex: 1,
    gap: Spacing.xs,
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

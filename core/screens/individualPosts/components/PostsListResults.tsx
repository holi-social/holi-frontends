import React, { ReactNode, useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import GenericPostCard from '@holi/core/screens/individualPosts/components/GenericPostCard'
import { FeedPost } from '@holi/core/screens/individualPosts/types'
import { Post } from '@holi/core/screens/posts/types'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
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
  const { data, loading, totalResults } = usePaginationContext<FeedPost | Post>()
  const numberOfColumns = useBreakpointMatcher() || 1
  const { topics: allTopics } = useContext(SpaceTermContext)

  if (totalResults == 0) return emptyMessage

  const dataByColumns = simpleColumnSortingByIndex(data, numberOfColumns)
  const animKey = loading ? 'loading' : data.length > 0 ? 'ready' : 'empty'

  return (
    <HoliTransition.FadeSwitch animKey={animKey}>
      {animKey === 'loading' && <LoadingSkeleton columns={numberOfColumns} />}

      {animKey === 'ready' && (
        <View style={styles.container} testID="posts-list-results">
          {dataByColumns.map((column, index) => (
            <View key={index} style={styles.column}>
              {column.map((p) => (
                <HoliTransition.FadeDown key={p.id} visible index={index}>
                  <GenericPostCard
                    key={p.id}
                    post={p}
                    showVisibilityBadge={showVisibilityBadge}
                    allTopics={allTopics}
                  />
                </HoliTransition.FadeDown>
              ))}
            </View>
          ))}
        </View>
      )}

      {animKey === 'empty' && emptyMessage}
    </HoliTransition.FadeSwitch>
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

const LoadingSkeleton = ({ columns }: { columns: number }) => (
  <View style={styles.container}>
    {new Array(columns).fill(0).map((_, index) => (
      <View style={styles.column} key={index}>
        <PostSkeleton />
        <PostSkeleton />
      </View>
    ))}
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

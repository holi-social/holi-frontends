import React, { type ReactNode, useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { usePaginationContext } from '@holi/core/pagination/Pagination'
import GenericPostCard from '@holi/core/screens/individualPosts/components/GenericPostCard'
import type { FeedPost } from '@holi/core/screens/individualPosts/types'
import type { Post } from '@holi/core/screens/posts/types'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import Spacing from '@holi/ui/foundations/Spacing'
import type { Insight } from '@holi/core/screens/insights/types'
import InsightPreviewBox from '@holi/core/screens/insights/components/InsightPreviewBox'
import { useQuery } from '@apollo/client'
import { feedQuery } from '@holi/core/screens/homeFeed/queries'

const PAGE_SIZE = 20

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
  const numberOfColumns = useBreakpointMatcher() || 2
  const { topics: allTopics } = useContext(SpaceTermContext)
  const { data, loading, fetchMore } = useQuery(feedQuery, {
    variables: {
      offset: 0,
      limit: PAGE_SIZE,
    },
  })

  const feedData = data?.feed?.data || []
  const totalResults = data?.feed?.totalResults || 0

  if (totalResults == 0) return emptyMessage

  console.log('data', data)

  const dataByColumns = simpleColumnSortingByIndex(feedData, numberOfColumns)
  const animKey = loading ? 'loading' : feedData.length > 0 ? 'ready' : 'empty'

  return (
    <HoliTransition.FadeSwitch animKey={animKey}>
      {animKey === 'loading' && <LoadingSkeleton columns={numberOfColumns} />}

      {animKey === 'ready' && (
        <View style={styles.container} testID="posts-list-results">
          {dataByColumns.map((column, index) => (
            <View key={index} style={styles.column}>
              {column.map((item: any) => (
                <HoliTransition.FadeDown key={item.feedPost?.id} visible index={index}>
                  {item.feedPost && (
                    <GenericPostCard
                      key={item.feedPost.id}
                      post={item.feedPost}
                      showVisibilityBadge={showVisibilityBadge}
                      allTopics={allTopics}
                    />
                  )}
                  {item.spacePost && (
                    <GenericPostCard
                      key={item.spacePost.id}
                      post={item.spacePost}
                      showVisibilityBadge={showVisibilityBadge}
                      allTopics={allTopics}
                    />
                  )}
                  {item.insight && <InsightPreviewBox key={item.insight.id} insight={item.insight} />}
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

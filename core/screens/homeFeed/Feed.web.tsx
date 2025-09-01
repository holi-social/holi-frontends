import { withProfiler } from '@sentry/react'
import React, { memo, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useInView } from 'react-intersection-observer'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HomeFeedHeader from '@holi/core/screens/homeFeed/components/HomeFeedHeader.web'
import CreatePostButton, { ButtonFloatingWrapper } from '@holi/core/screens/individualPosts/components/CreatePostButton'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import GenericPostCard from '@holi/core/screens/individualPosts/components/GenericPostCard'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'
import { useBreakpointMatcher } from '@holi/core/helpers/useBreakpointMatcher'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { simpleColumnSortingByIndex } from '@holi/core/screens/homeFeed/helpers'
import type { CombinedFeedItem } from '@holi/core/screens/homeFeed/types'
import GoodNewsCard from '@holi-apps/goodnews/components/GoodNewsCard'

import VolunteeringCard from '@holi-apps/volunteering/components/VolunteeringCard'
import { useFeedQuery } from '@holi/core/screens/homeFeed/useFeedQuery'
import InsightCard from '@holi/core/screens/insights/components/InsightCard'
import useTracking from '@holi/core/tracking/hooks/useTracking'

import type { User } from '@holi/core/domain/shared/types'
import { useFeedStats } from '@holi/core/screens/homeFeed/helpers/useFeedStats'
import { Stack } from 'holi-bricks/components/stack'
import { GoodDeedsChip } from '@holi/core/screens/homeFeed/components/GoodDeedsChip'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'

const FeedListItem = memo(
  ({
    item,
    index,
    columnIndex,
    insightsCreators,
    onItemView,
    loadMoreRef,
  }: {
    item: CombinedFeedItem & { loader?: boolean }
    index: number
    columnIndex: number
    insightsCreators: User[]
    onItemView: (index: number) => void
    loadMoreRef?: ((node?: Element | null | undefined) => void) | undefined
  }) => {
    const { ref } = useInView({
      onChange: (inView) => {
        if (inView) {
          onItemView(index)
        }
      },
      threshold: 0.5,
    })

    return (
      <div ref={ref}>
        <View
          key={
            item.feedPost?.id ||
            item.goodNewsArticle?.id ||
            item.volunteeringReco?.id ||
            item.insight?.id ||
            `${index}-${columnIndex}`
          }
        >
          {item.feedPost && <GenericPostCard key={item.feedPost.id} post={item.feedPost} />}
          {item.spacePost && <GenericPostCard key={item.spacePost.id} post={item.spacePost} />}
          {item.insight && insightsCreators && (
            <InsightCard key={item.insight.id} insight={item.insight} creators={insightsCreators} />
          )}
          {item.goodNewsArticle && <GoodNewsCard article={item.goodNewsArticle} key={item.goodNewsArticle.id} />}
          {item.volunteeringReco && (
            <VolunteeringCard key={item.volunteeringReco?.id} engagement={item.volunteeringReco} index={index} />
          )}
          {item.loader && loadMoreRef && (
            <div ref={loadMoreRef}>
              <View testID="load-more-ref" style={styles.skeleton} key={`${item.loader}-${columnIndex}-${index}`}>
                <HoliSkeleton height={420} width="100%" borderRadius={20} />
              </View>
            </div>
          )}
        </View>
      </div>
    )
  }
)

FeedListItem.displayName = 'FeedListItem'

const HomeFeed = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const colors = useMemo(() => theme.colors, [theme])
  const numberOfColumns = useBreakpointMatcher() || 2
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const [showGoodDeedChip] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_1)

  const { isLoading, canLoadMore, combinedFeedData, fetchMore, initialLoading, insightsCreators } = useFeedQuery()
  const [lastViewedIndex, setLastViewedIndex] = useState(0)
  const { track } = useTracking()

  const loaders = new Array(2).fill({ loader: true })

  // when we have two columns, we are not sure which one shows the loader first
  // so we use two inView hooks to trigger the loading of the next page
  const { ref: loadMoreRef1, inView: inView1 } = useInView({
    threshold: 0,
    triggerOnce: false,
  })
  const { ref: loadMoreRef2, inView: inView2 } = useInView({
    threshold: 0,
    triggerOnce: false,
  })

  useEffect(() => {
    if ((!inView1 && !inView2) || isLoading) return
    fetchMore()
  }, [inView1, inView2, fetchMore, isLoading])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: '',
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTitle: () => null,
      headerTintColor: colors.black300,
      headerLeft: ({ tintColor }) => (
        <HoliTransition.FadeLeft visible>
          <Stack direction="row" gap="xxs" alignItems="center">
            <HoliLogo color={tintColor} />
            {showGoodDeedChip && <GoodDeedsChip />}
          </Stack>
        </HoliTransition.FadeLeft>
      ),
      headerRight: () => (
        <HoliTransition.FadeRight visible>
          <View style={styles.headerRight}>
            <NotificationAndSearchHeader />
          </View>
        </HoliTransition.FadeRight>
      ),
    })
  }, [navigate, t, setScreenOptions, colors.black300, showGoodDeedChip])

  // Update the data sorting to use combinedFeedData
  const dataByColumns = simpleColumnSortingByIndex([...combinedFeedData, ...loaders], numberOfColumns)
  const animKey = initialLoading ? 'loading' : combinedFeedData.length > 0 ? 'ready' : 'empty'

  // Add tracking stats function
  const getFeedStats = useFeedStats(combinedFeedData, lastViewedIndex, track)

  useEffect(() => {
    const handlePageHide = () => {
      getFeedStats()
    }

    const handleHistoryChange = () => {
      getFeedStats()
    }

    // Listen for browser navigation (back/forward)
    window.addEventListener('popstate', handleHistoryChange)

    // Override pushState and replaceState to detect navigation inside the app
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function (...args) {
      originalPushState.apply(this, args)
      handleHistoryChange()
    }

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(this, args)
      handleHistoryChange()
    }

    // Listen for tab close or page hide
    document.addEventListener('visibilitychange', handlePageHide)

    return () => {
      window.removeEventListener('popstate', handleHistoryChange)
      document.removeEventListener('visibilitychange', handlePageHide)

      // Restore original history functions
      window.history.pushState = originalPushState
      window.history.replaceState = originalReplaceState
    }
  }, [getFeedStats])

  const updateLastViewedIndex = (index: number) => {
    setLastViewedIndex((prev) => Math.max(prev, index))
  }

  return (
    <>
      <GestureHandlerRootView style={{ backgroundColor: colors.white200, flex: 1 }} testID="home-feed-listing">
        <View style={styles.sections} testID="posts-list-results">
          <HoliContainer>
            <HoliTransition.FadeDown visible>
              <HomeFeedHeader />
            </HoliTransition.FadeDown>

            <ErrorBoundary>
              <HoliTransition.FadeSwitch animKey={animKey}>
                {animKey === 'loading' && <LoadingSkeleton columns={numberOfColumns} />}

                {animKey === 'ready' && (
                  <View style={styles.container} testID="posts-list-results">
                    {dataByColumns.map((column, columnIndex) => (
                      <View key={columnIndex} style={styles.column}>
                        {column.map((item, index) =>
                          item.loader && !canLoadMore ? (
                            <></>
                          ) : (
                            <FeedListItem
                              key={index}
                              item={item}
                              index={numberOfColumns === 1 ? index : index * numberOfColumns + columnIndex}
                              columnIndex={columnIndex}
                              insightsCreators={insightsCreators}
                              onItemView={updateLastViewedIndex}
                              loadMoreRef={item.loader ? (columnIndex === 0 ? loadMoreRef1 : loadMoreRef2) : undefined}
                            />
                          )
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </HoliTransition.FadeSwitch>
            </ErrorBoundary>
          </HoliContainer>
        </View>
      </GestureHandlerRootView>
      <ButtonFloatingWrapper>
        <CreatePostButton />
      </ButtonFloatingWrapper>
    </>
  )
}

const LoadingSkeleton = ({ columns }: { columns: number }) => (
  <View style={[styles.container, styles.skeleton]}>
    {new Array(columns).fill(0).map((_, index) => (
      <View style={styles.column} key={index}>
        <HoliSkeleton height={160} width="100%" borderRadius={20} />
        <HoliSkeleton height={160} width="100%" borderRadius={20} />
      </View>
    ))}
  </View>
)

const styles = StyleSheet.create({
  sections: {
    gap: Spacing.xxs,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: Spacing.xs,
    gap: Spacing.xs,
  },
  column: {
    flex: 1,
    gap: Spacing.xs,
  },
  skeleton: {
    paddingBottom: Spacing.xs,
  },
})

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })

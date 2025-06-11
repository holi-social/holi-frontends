import { withProfiler } from '@sentry/react'
import React, { memo, useMemo, useCallback, useRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, RefreshControl, AppState } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useNavigation, Link } from 'expo-router'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HomeFeedHeader from '@holi/core/screens/homeFeed/components/HomeFeedHeader'
import CreatePostButton, { ButtonFloatingWrapper } from '@holi/core/screens/individualPosts/components/CreatePostButton'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import GenericPostCard from '@holi/core/screens/individualPosts/components/GenericPostCard'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import type { CombinedFeedItem } from '@holi/core/screens/homeFeed/types'
import TrackableFlatList from '@holi/core/tracking/TrackableFlatList'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { TrackingEvent, Unknown } from '@holi/core/tracking/events'
import GoodNewsCard from '@holi-apps/goodnews/components/GoodNewsCard'
import VolunteeringCard from '@holi-apps/volunteering/components/VolunteeringCard'
import { useFeedQuery } from '@holi/core/screens/homeFeed/useFeedQuery'
import InsightCard from '@holi/core/screens/insights/components/InsightCard'
import { useScrollToTop } from '@react-navigation/native'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useFeedStats } from '@holi/core/screens/homeFeed/helpers/useFeedStats'
import { useRefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'
import type { FeedPost } from '@holi/core/screens/individualPosts/types'
import type { Post } from '@holi/core/screens/posts/types'
import { Stack } from 'holi-bricks/components/stack'
import { ChipGoodDeeds } from '@holi/core/screens/homeFeed/components/ChipGoodDeeds'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { useNotificationsInit } from '@holi/mobile/notifications/useNotificationsInit'
import * as Appcues from '@appcues/react-native'

const HomeFeed = () => {
  Appcues.screen('Feed')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const colors = useMemo(() => theme.colors, [theme])
  const { navigate } = useRouting()
  const [lastViewedIndex, setLastViewedIndex] = useState(0)
  const setScreenOptions = useSetScreenOptions()
  const updateLastViewedIndex = useCallback((index: number) => {
    setLastViewedIndex((prev) => Math.max(prev, index))
  }, [])
  const [showGoodDeedChip] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_1)

  const { refreshControlProps } = useRefreshContext()

  const { initialLoading, canLoadMore, combinedFeedData, fetchMore, insightsCreators } = useFeedQuery()

  const { track } = useTracking()
  const navigation = useNavigation()
  const ref = useRef(null)

  const keyExtractor = useCallback((item: CombinedFeedItem, index: number) => {
    return (
      item.feedPost?.id ||
      item.spacePost?.id ||
      item.insight?.id ||
      item.goodNewsArticle?.id ||
      item.volunteeringReco?.id ||
      index.toString()
    )
  }, [])

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: CombinedFeedItem
      index: number
    }) => {
      return (
        <>
          {item.feedPost && <GenericPostCard post={item.feedPost} />}
          {item.spacePost && <GenericPostCard post={item.spacePost} />}
          {item.insight && insightsCreators && <InsightCard insight={item.insight} creators={insightsCreators} />}
          {item.goodNewsArticle && <GoodNewsCard article={item.goodNewsArticle} />}
          {item.volunteeringReco && <VolunteeringCard engagement={item.volunteeringReco} index={index} />}
        </>
      )
    },
    [insightsCreators]
  )

  const renderFooter = useCallback(
    () =>
      canLoadMore ? (
        <View style={styles.loaderFooter}>
          <HoliSkeleton height={260} width="100%" borderRadius={16} />
          <HoliSkeleton height={260} width="100%" borderRadius={16} />
          <HoliSkeleton height={260} width="100%" borderRadius={16} />
        </View>
      ) : initialLoading ? (
        <View style={[styles.screenLoader, { backgroundColor: colors.white200 }]}>
          <HoliSkeleton height={180} width="100%" borderRadius={16} />
          <HoliSkeleton height={180} width="100%" borderRadius={16} />
          <HoliSkeleton height={180} width="100%" borderRadius={16} />
        </View>
      ) : (
        <></>
      ),
    [canLoadMore, initialLoading, colors.white200]
  )

  const renderHeader = useMemo(
    () => (
      <HoliTransition.FadeDown visible>
        <View style={styles.listHeader}>
          <HomeFeedHeader />
        </View>
      </HoliTransition.FadeDown>
    ),
    []
  )

  const listItemTrackingEvent: ListItemTrackingEvent<CombinedFeedItem> = (item) => {
    if (item.feedPost) {
      const author =
        item.feedPost.__typename === 'FeedPost' ? (item.feedPost as FeedPost).author : (item.feedPost as Post).creator

      return TrackingEvent.FeedPosts.read(item.feedPost.id, item.feedPost.title, {
        id: author.id,
        name: author.fullName,
        role: author.role,
      })
    } else if (item.spacePost) {
      return TrackingEvent.SpacePosts.read(item.spacePost.id, item.spacePost.title)
    } else if (item.insight) {
      return TrackingEvent.InsightCard.CardViewed(item.insight.id, item.insight.title)
    } else if (item.volunteeringReco) {
      return TrackingEvent.RecommendationViewed(
        item.volunteeringReco.type === 'task' ? 'space_task' : 'volunteering_opportunity',
        {
          id: item.volunteeringReco.id,
          title: item.volunteeringReco.title,
          commitmentType: item.volunteeringReco.commitment_label,
          locationType: item.volunteeringReco.location_type,
          source: item.volunteeringReco.source,
          sourceSection: 'Volunteering',
        }
      )
    } else if (item.goodNewsArticle) {
      return TrackingEvent.RecommendationViewed('goodnews', {
        id: item.goodNewsArticle.id,
        title: item.goodNewsArticle.headline,
      })
    }
    return Unknown
  }

  const listItemIdentifier: ListItemIdentifier<CombinedFeedItem> = (item) => {
    return (
      item.feedPost?.id ||
      item.spacePost?.id ||
      item.insight?.id ||
      item.goodNewsArticle?.id ||
      item.volunteeringReco?.id ||
      Math.random().toString()
    )
  }

  useScrollToTop(ref)

  useNotificationsInit()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: '',
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: false,
      headerTitle: () => null,
      headerTintColor: colors.black300,
      headerLeft: ({ tintColor }) => (
        <HoliTransition.FadeLeft visible>
          <Stack direction="row" gap="xxs" alignItems="center">
            <HoliLogo color={tintColor} />
            {showGoodDeedChip && <ChipGoodDeeds />}
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

  const getFeedStats = useFeedStats(combinedFeedData, lastViewedIndex, track)

  useEffect(() => {
    const navigationUnsubscribe = navigation.addListener('blur', () => {
      getFeedStats()
    })

    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        getFeedStats()
      }
    })

    return () => {
      navigationUnsubscribe()
      appStateSubscription.remove()
    }
  }, [navigation, getFeedStats])

  return (
    <>
      <Link href={'/insights'}>Go to </Link>
      <GestureHandlerRootView style={[styles.wrapper, { backgroundColor: colors.white200 }]} testID="home-feed-listing">
        <View style={styles.sections} testID="feed-posts">
          <ErrorBoundary>
            <TrackableFlatList
              removeClippedSubviews={true}
              windowSize={5}
              maxToRenderPerBatch={5}
              initialNumToRender={10}
              refreshControl={<RefreshControl {...refreshControlProps} />}
              data={combinedFeedData}
              renderItem={renderItem}
              ListHeaderComponent={renderHeader}
              keyExtractor={keyExtractor}
              onEndReached={fetchMore}
              onEndReachedThreshold={0.9}
              ListFooterComponent={renderFooter}
              contentContainerStyle={styles.listContent}
              testID="posts-list-results"
              listItemTrackingEvent={listItemTrackingEvent}
              listItemIdentifier={listItemIdentifier}
              ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
              minimumViewTime={1000}
              showsVerticalScrollIndicator={false}
              disableVirtualization={true}
              trackOnce={true}
              withFlashList={false}
              estimatedItemSize={260}
              ref={ref}
              onLastViewedIndexChange={updateLastViewedIndex}
            />
          </ErrorBoundary>
        </View>
      </GestureHandlerRootView>
      <ButtonFloatingWrapper>
        <CreatePostButton />
      </ButtonFloatingWrapper>
    </>
  )
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  sections: {
    gap: Spacing.xxs,
    flex: 1,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  listHeader: {
    gap: Spacing.sm,
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.sm,
  },
  screenLoader: {
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  loaderFooter: {
    marginVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  container: {
    marginTop: Spacing.xs,
  },
})

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })

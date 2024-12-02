import { withProfiler } from '@sentry/react'
import React, { memo, useContext, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, RefreshControl } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
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
import { feedQuery } from '@holi/core/screens/homeFeed/queries'
import SpaceTermContextProvider, {
  SpaceTermContext,
} from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import InsightPreviewBox from '@holi/core/screens/insights/components/InsightPreviewBox'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { useQuery } from '@apollo/client'
import { Text } from 'holi-bricks/components/text'
import type { FeedItem } from '@holi/core/screens/homeFeed/types'
import TrackableFlatList from '@holi/core/tracking/TrackableFlatList'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { TrackingEvent, Unknown } from '@holi/core/tracking/events'

const PAGE_SIZE = 20

const temporalGreeting = (hours: number, t: (key: string) => string) => {
  if (hours >= 5 && hours < 11) return t('homeFeed.headerTitle.goodMorning')
  else if (hours >= 11 && hours < 14) return t('homeFeed.headerTitle.goodDay')
  else if (hours >= 14 && hours < 18) return t('homeFeed.headerTitle.goodAfternoon')
  else if (hours >= 18 && hours < 23) return t('homeFeed.headerTitle.goodEvening')
  else return t('homeFeed.headerTitle.goodNight')
}

const surveyUrl = 'https://tally.so/r/nrdGxX'

const HomeFeed = () => {
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(new Date().getHours(), t)
  const { theme } = useTheme()
  const colors = useMemo(() => theme.colors, [theme])
  const { topics: allTopics } = useContext(SpaceTermContext)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const { loading, fetchMore, refetch, data } = useQuery(feedQuery, {
    fetchPolicy: 'cache-and-network',
    variables: {
      limit: PAGE_SIZE,
      offset: 0,
    },
  })

  const feedData = data?.feed?.data || []

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const displayFeedbackLink = useFeatureFlagWithMaintenance(FeatureFlagKey.FEEDBACK_LINK).isOn

  const handleLoadMore = async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)

    try {
      await fetchMore({
        variables: {
          offset: feedData.length,
          limit: PAGE_SIZE,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.feed?.data) return prev
          return {
            feed: {
              ...prev.feed,
              data: [
                ...prev.feed.data,
                ...fetchMoreResult.feed.data.filter(
                  (newItem: FeedItem) =>
                    !prev.feed.data.some(
                      (existingPost: FeedItem) =>
                        (newItem.feedPost?.id && existingPost.feedPost?.id === newItem.feedPost.id) ||
                        (newItem.spacePost?.id && existingPost.spacePost?.id === newItem.spacePost.id) ||
                        (newItem.insight?.id && existingPost.insight?.id === newItem.insight.id)
                    )
                ),
              ],
            },
          }
        },
      })
    } finally {
      setIsLoadingMore(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await refetch()
    } finally {
      setRefreshing(false)
    }
  }

  const renderItem = ({ item }: { item: FeedItem }) => (
    <HoliTransition.FadeDown visible>
      {item.feedPost && <GenericPostCard post={item.feedPost} allTopics={allTopics} />}
      {item.spacePost && <GenericPostCard post={item.spacePost} allTopics={allTopics} />}
      {item.insight && <InsightPreviewBox insight={item.insight} />}
    </HoliTransition.FadeDown>
  )

  const renderFooter = () => (
    <View style={styles.loaderFooter}>
      <HoliSkeleton height={260} width="100%" borderRadius={20} />
      <HoliSkeleton height={260} width="100%" borderRadius={20} />
      <HoliSkeleton height={260} width="100%" borderRadius={20} />
    </View>
  )

  const renderHeader = useMemo(
    () => (
      <HoliTransition.FadeDown visible>
        <HomeFeedHeader />
      </HoliTransition.FadeDown>
    ),
    []
  )

  const listItemTrackingEvent: ListItemTrackingEvent<FeedItem> = (item) => {
    if (item.feedPost) {
      return TrackingEvent.FeedPosts.read(item.feedPost.id)
    } else if (item.spacePost) {
      return TrackingEvent.SpacePosts.read(item.spacePost.id)
    } else if (item.insight) {
      return TrackingEvent.InsightCard.CardViewed(item.insight.id)
    }
    return Unknown
  }

  const listItemIdentifier: ListItemIdentifier<FeedItem> = (item) => {
    return item.feedPost?.id || item.spacePost?.id || item.insight?.id || Math.random().toString()
  }

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: headerTitle,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: false,
      headerTitle: () => null,
      headerTintColor: colors.black300,
      headerLeft: ({ tintColor }) => (
        <HoliTransition.FadeLeft visible>
          <HoliLogo color={tintColor} />
        </HoliTransition.FadeLeft>
      ),
      headerRight: (props) => (
        <HoliTransition.FadeRight visible>
          <View style={styles.headerRight}>
            {displayFeedbackLink && (
              <HoliLink external href={surveyUrl} label={t('homeFeed.feedback')}>
                <Text size="sm">{t('homeFeed.feedback')}</Text>
              </HoliLink>
            )}
            <NotificationAndSearchHeader {...props} />
          </View>
        </HoliTransition.FadeRight>
      ),
    })
  }, [navigate, t, headerTitle, setScreenOptions, colors.black300, displayFeedbackLink])

  if (loading && !feedData.length)
    return (
      <View style={[styles.wrapper, { backgroundColor: colors.white200 }]}>
        <View style={styles.screenLoader}>
          <HoliSkeleton height={60} width={220} borderRadius={20} />
          <HoliSkeleton height={180} width="100%" borderRadius={20} />
          <HoliSkeleton height={180} width="100%" borderRadius={20} />
          <HoliSkeleton height={180} width="100%" borderRadius={20} />
        </View>
      </View>
    )

  return (
    <SpaceTermContextProvider>
      <GestureHandlerRootView style={[styles.wrapper, { backgroundColor: colors.white200 }]}>
        <View style={styles.sections} testID="posts-list-results">
          <ErrorBoundary>
            <TrackableFlatList
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
              data={feedData}
              renderItem={renderItem}
              ListHeaderComponent={renderHeader}
              keyExtractor={(item) =>
                item.feedPost?.id || item.spacePost?.id || item.insight?.id || Math.random().toString()
              }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.6}
              ListFooterComponent={renderFooter}
              contentContainerStyle={styles.flatListContent}
              testID="posts-list-results"
              listItemTrackingEvent={listItemTrackingEvent}
              listItemIdentifier={listItemIdentifier}
              itemVisiblePercentThreshold={80}
              minimumViewTime={1000}
              trackOnce={true}
            />
          </ErrorBoundary>
        </View>
      </GestureHandlerRootView>
      <ButtonFloatingWrapper>
        <CreatePostButton />
      </ButtonFloatingWrapper>
    </SpaceTermContextProvider>
  )
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  sections: {
    gap: Spacing.xxs,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  flatListContent: {
    gap: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  screenLoader: {
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  loaderFooter: {
    marginTop: Spacing['4xs'],
    gap: Spacing.sm,
  },
})

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })

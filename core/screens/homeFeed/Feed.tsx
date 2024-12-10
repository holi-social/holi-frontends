import { withProfiler } from '@sentry/react'
import React, { memo, useContext, useMemo, useState, useCallback } from 'react'
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
import { goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import type { GoodNewsArticlesQueryArgs, GoodNewsArticlesQueryResponse } from '@holi-apps/goodnews/queries'
import type { GoodNewsArticle } from '@holi-apps/goodnews/types'
import GoodNewsCard from '@holi-apps/goodnews/components/GoodNewsCard'
import { logError } from '@holi/core/errors/helpers/logError'
import { volunteeringRecosQuery } from '@holi-apps/volunteering/queries'
import type { VolunteeringReco } from '@holi-apps/volunteering/types'
import VolunteeringCard from '@holi-apps/volunteering/components/VolunteeringCard'
import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'

const PAGE_SIZE = 20
const VOLUNTEERING_FREQUENCY = 10 // every 10 items, one volunteering engagement
const GOOD_NEWS_FREQUENCY = 5 // every 5 items, one good news article

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

  const { data: dataGoodNews } = useQuery<GoodNewsArticlesQueryResponse, GoodNewsArticlesQueryArgs>(
    goodNewsArticlesQuery,
    {
      variables: {
        lastDate: undefined,
      },
      onError: (error) =>
        logError(error, 'Failed to load good news articles', {
          location: 'HomeFeed.GoodNewsArticlesQuery',
        }),
    }
  )

  const { queryVariables, loading: loadingQueryVariables } = useVolunteeringRecosQueryVariables()

  const { data: dataVolunteering } = useQuery(volunteeringRecosQuery, {
    variables: { ...queryVariables, offset: 0, limit: PAGE_SIZE },
    skip: loadingQueryVariables,
    onError: (error) =>
      logError(error, 'Failed to load volunteering recommendations', {
        location: 'HomeFeed.volunteeringRecosQuery',
      }),
  })

  const combinedFeedData = useMemo(() => {
    const feedData = data?.feed?.data || []
    const combined: (FeedItem & {
      goodNewsArticle?: GoodNewsArticle
      volunteeringReco?: VolunteeringReco
    })[] = [...feedData]
    const articles = dataGoodNews?.appGoodNews_articles?.articles || []
    const engagements = dataVolunteering?.appVolunteering_engagementRecos?.data || []

    // Insert a good news article after every 5 feed items
    articles.forEach((article, index) => {
      const insertPosition = (index + 1) * GOOD_NEWS_FREQUENCY
      if (insertPosition < combined.length) {
        combined.splice(insertPosition, 0, { goodNewsArticle: article })
      }
    })

    // Insert volunteering engagement after every 10 feed items, but only use available items
    engagements.forEach((recommendation: VolunteeringReco, index: number) => {
      const insertPosition = (index + 1) * VOLUNTEERING_FREQUENCY
      if (insertPosition < combined.length) {
        combined.splice(insertPosition, 0, { volunteeringReco: recommendation })
      }
    })

    return combined
  }, [
    data?.feed?.data,
    dataGoodNews?.appGoodNews_articles?.articles,
    dataVolunteering?.appVolunteering_engagementRecos?.data,
  ])

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const displayFeedbackLink = useFeatureFlagWithMaintenance(FeatureFlagKey.FEEDBACK_LINK).isOn

  const handleLoadMore = async () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)

    try {
      await fetchMore({
        variables: {
          offset: data?.feed?.data?.length || 0,
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

  const keyExtractor = useCallback(
    (
      item: FeedItem & {
        goodNewsArticle?: GoodNewsArticle
        volunteeringReco?: VolunteeringReco
      },
      index: number
    ) => {
      return (
        item.feedPost?.id ||
        item.spacePost?.id ||
        item.insight?.id ||
        item.goodNewsArticle?.id ||
        item.volunteeringReco?.engagement.id ||
        index.toString()
      )
    },
    []
  )

  const renderItem = useCallback(
    ({ item }: { item: FeedItem & { goodNewsArticle?: GoodNewsArticle; volunteeringReco?: VolunteeringReco } }) => (
      <HoliTransition.FadeDown visible>
        {item.feedPost && <GenericPostCard post={item.feedPost} allTopics={allTopics} />}
        {item.spacePost && <GenericPostCard post={item.spacePost} allTopics={allTopics} />}
        {item.insight && <InsightPreviewBox insight={item.insight} />}
        {item.goodNewsArticle && <GoodNewsCard article={item.goodNewsArticle} />}
        {item.volunteeringReco && <VolunteeringCard recommendation={item.volunteeringReco} />}
      </HoliTransition.FadeDown>
    ),
    [allTopics]
  )

  const renderFooter = useCallback(
    () => (
      <View style={styles.loaderFooter}>
        <HoliSkeleton height={260} width="100%" borderRadius={20} />
        <HoliSkeleton height={260} width="100%" borderRadius={20} />
        <HoliSkeleton height={260} width="100%" borderRadius={20} />
      </View>
    ),
    []
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

  const listItemIdentifier: ListItemIdentifier<
    FeedItem & { goodNewsArticle?: GoodNewsArticle; volunteeringReco?: VolunteeringReco }
  > = (item) => {
    return (
      item.feedPost?.id ||
      item.spacePost?.id ||
      item.insight?.id ||
      item.goodNewsArticle?.id ||
      item.volunteeringReco?.engagement.id ||
      Math.random().toString()
    )
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

  if (loading && !combinedFeedData.length)
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
      <GestureHandlerRootView style={[styles.wrapper, { backgroundColor: colors.white200 }]} testID="home-feed-listing">
        <View style={styles.sections} testID="posts-list-results">
          <ErrorBoundary>
            <TrackableFlatList
              removeClippedSubviews={true}
              windowSize={5}
              maxToRenderPerBatch={5}
              initialNumToRender={10}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
              data={combinedFeedData}
              renderItem={renderItem}
              ListHeaderComponent={renderHeader}
              keyExtractor={keyExtractor}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.9}
              ListFooterComponent={renderFooter}
              contentContainerStyle={styles.listContent}
              testID="posts-list-results"
              listItemTrackingEvent={listItemTrackingEvent}
              listItemIdentifier={listItemIdentifier}
              ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
              itemVisiblePercentThreshold={80}
              minimumViewTime={1000}
              showsVerticalScrollIndicator={false}
              trackOnce={true}
              withFlashList={true}
              estimatedItemSize={260}
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
    flex: 1,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  listHeader: {
    paddingBottom: Spacing.xs,
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.sm,
  },
  screenLoader: {
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  loaderFooter: {
    marginVertical: Spacing.sm,
    gap: Spacing.sm,
  },
})

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })

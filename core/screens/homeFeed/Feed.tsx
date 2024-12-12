import { withProfiler } from '@sentry/react'
import React, { memo, useContext, useMemo, useCallback } from 'react'
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
import SpaceTermContextProvider, {
  SpaceTermContext,
} from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { Text } from 'holi-bricks/components/text'
import type { FeedItem } from '@holi/core/screens/homeFeed/types'
import TrackableFlatList from '@holi/core/tracking/TrackableFlatList'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { TrackingEvent, Unknown } from '@holi/core/tracking/events'
import type { GoodNewsArticle } from '@holi-apps/goodnews/types'
import GoodNewsCard from '@holi-apps/goodnews/components/GoodNewsCard'
import type { VolunteeringReco } from '@holi-apps/volunteering/types'
import VolunteeringCard from '@holi-apps/volunteering/components/VolunteeringCard'
import { useFeedQuery } from '@holi/core/screens/homeFeed/useFeedQuery'
import InsightCard from '@holi/core/screens/insights/components/InsightCard'

const surveyUrl = 'https://tally.so/r/nrdGxX'

const HomeFeed = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const colors = useMemo(() => theme.colors, [theme])
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const displayFeedbackLink = useFeatureFlagWithMaintenance(FeatureFlagKey.FEEDBACK_LINK).isOn
  const { topics: allTopics } = useContext(SpaceTermContext)
  const { initialLoading, canLoadMore, combinedFeedData, fetchMore, refetch, refreshing, insightsCreators } =
    useFeedQuery()

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
        {item.insight && insightsCreators && <InsightCard insight={item.insight} creators={insightsCreators} />}
        {item.goodNewsArticle && <GoodNewsCard article={item.goodNewsArticle} />}
        {item.volunteeringReco && <VolunteeringCard recommendation={item.volunteeringReco} />}
      </HoliTransition.FadeDown>
    ),
    [allTopics, insightsCreators]
  )

  const renderFooter = useCallback(
    () =>
      canLoadMore ? (
        <View style={styles.loaderFooter}>
          <HoliSkeleton height={260} width="100%" borderRadius={20} />
          <HoliSkeleton height={260} width="100%" borderRadius={20} />
          <HoliSkeleton height={260} width="100%" borderRadius={20} />
        </View>
      ) : (
        <></>
      ),
    [canLoadMore]
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
      title: '',
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
  }, [navigate, t, setScreenOptions, colors.black300, displayFeedbackLink])

  if (initialLoading)
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
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
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
  container: {
    marginTop: Spacing.xs,
  },
})

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })

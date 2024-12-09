import { withProfiler } from '@sentry/react'
import React, { type LegacyRef, memo, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useInView } from 'react-intersection-observer'

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
import { useBreakpointMatcher } from '@holi/core/helpers/useBreakpointMatcher'
import SpaceTermContextProvider, {
  SpaceTermContext,
} from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import InsightPreviewBox from '@holi/core/screens/insights/components/InsightPreviewBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { useQuery } from '@apollo/client'
import { Text } from 'holi-bricks/components/text'
import { simpleColumnSortingByIndex } from '@holi/core/screens/homeFeed/helpers'
import type { FeedItem } from '@holi/core/screens/homeFeed/types'
import { isSSR } from '@holi/core/helpers/isSSR'
import { goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import type { GoodNewsArticlesQueryArgs } from '@holi-apps/goodnews/queries'
import type { GoodNewsArticlesQueryResponse } from '@holi-apps/goodnews/queries'
import { logError } from '@holi/core/errors/helpers'
import type { GoodNewsArticle } from '@holi-apps/goodnews/types'
import GoodNewsCard from '@holi-apps/goodnews/components/GoodNewsCard'

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
  const numberOfColumns = useBreakpointMatcher() || 2
  const { topics: allTopics } = useContext(SpaceTermContext)
  const [feedData, setFeedData] = useState<FeedItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const loaders = new Array(2).fill({ loader: true })

  const { loading, fetchMore, data } = useQuery(feedQuery, {
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
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

  useEffect(() => {
    if (data?.feed?.data) {
      setFeedData(data.feed.data)
    }
  }, [data])

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const displayFeedbackLink = useFeatureFlagWithMaintenance(FeatureFlagKey.FEEDBACK_LINK).isOn

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
    setIsLoading(true)
    fetchMore({
      variables: {
        offset: feedData.length,
        limit: PAGE_SIZE,
      },
    })
      .then((data) => {
        if (!data?.data?.feed?.data) return
        setFeedData((prev) => {
          const newItems = data?.data?.feed?.data || []
          const uniqueItems = newItems.filter(
            (newItem: FeedItem) =>
              !prev.some(
                (existingPost) =>
                  (newItem.feedPost?.id && existingPost.feedPost?.id === newItem.feedPost.id) ||
                  (newItem.spacePost?.id && existingPost.spacePost?.id === newItem.spacePost.id) ||
                  (newItem.insight?.id && existingPost.insight?.id === newItem.insight.id)
              )
          )
          return [...prev, ...uniqueItems]
        })
      })
      .finally(() => setIsLoading(false))
  }, [inView1, inView2, fetchMore, feedData.length, isLoading])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: headerTitle,
      headerBackTitleVisible: true,
      headerBackVisible: true,
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

  // Combine feed data with good news articles
  const combinedFeedData = useMemo(() => {
    const combined: (FeedItem & { goodNewsArticle?: GoodNewsArticle })[] = [...feedData]
    const articles = dataGoodNews?.appGoodNews_articles?.articles || []

    // Insert a good news article after every 10 feed items
    articles.forEach((article, index) => {
      const insertPosition = (index + 1) * 10
      if (insertPosition < combined.length) {
        combined.splice(insertPosition, 0, { goodNewsArticle: article })
      }
    })

    return combined
  }, [feedData, dataGoodNews?.appGoodNews_articles?.articles])

  // Update the data sorting to use combinedFeedData
  const dataByColumns = simpleColumnSortingByIndex([...combinedFeedData, ...loaders], numberOfColumns)
  const animKey = loading ? 'loading' : feedData.length > 0 ? 'ready' : 'empty'

  return (
    <SpaceTermContextProvider>
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
                        {column.map(
                          (
                            item: FeedItem & { loader?: boolean } & { goodNewsArticle?: GoodNewsArticle },
                            index: number
                          ) => (
                            <HoliTransition.FadeDown
                              key={item.feedPost?.id || item.goodNewsArticle?.id}
                              visible
                              index={index}
                            >
                              {item.feedPost && (
                                <GenericPostCard key={item.feedPost.id} post={item.feedPost} allTopics={allTopics} />
                              )}
                              {item.spacePost && (
                                <GenericPostCard key={item.spacePost.id} post={item.spacePost} allTopics={allTopics} />
                              )}
                              {item.insight && <InsightPreviewBox key={item.insight.id} insight={item.insight} />}
                              {item.goodNewsArticle && (
                                <GoodNewsCard article={item.goodNewsArticle} key={item.goodNewsArticle.id} />
                              )}
                              {item.loader && columnIndex === 0 && (
                                <View testID="load-more-ref" ref={loadMoreRef1 as LegacyRef<View>}>
                                  <HoliSkeleton height={420} width="100%" borderRadius={20} />
                                </View>
                              )}
                              {item.loader && columnIndex === 1 && (
                                <View testID="load-more-ref" ref={loadMoreRef2 as LegacyRef<View>}>
                                  <HoliSkeleton height={420} width="100%" borderRadius={20} />
                                </View>
                              )}
                            </HoliTransition.FadeDown>
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
    </SpaceTermContextProvider>
  )
}

const LoadingSkeleton = ({ columns }: { columns: number }) => (
  <View style={styles.container}>
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
})

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })

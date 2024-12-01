import { withProfiler } from '@sentry/react'
import React, { memo, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HomeFeedHeader from '@holi/core/screens/homeFeed/components/HomeFeedHeader'
import InsightsOfTheWeek from '@holi/core/screens/homeFeed/components/InsightsOfTheWeek'
import RecommendationsNoAct from '@holi/core/screens/homeFeed/components/RecommendationsNoAct'
import UserSuggestions from '@holi/core/screens/homeFeed/components/UserSuggestions'
import AllPosts from '@holi/core/screens/individualPosts/components/AllPosts'
import CreatePostButton, { ButtonFloatingWrapper } from '@holi/core/screens/individualPosts/components/CreatePostButton'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import HoliText from '@holi/ui/components/atoms/HoliText'
import GenericPostCard from '@holi/core/screens/individualPosts/components/GenericPostCard'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'

import AttendingChallengeEvents from '@holi-apps/challenges/components/AttendingChallengeEvents'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { feedQuery } from '@holi/core/screens/homeFeed/queries'
import ContentList from '@holi/core/screens/homeFeed/components/ContentList'
import { dimensions } from '@holi/ui/styles/globalVars'
import SpaceTermContextProvider, {
  SpaceTermContext,
} from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import InsightPreviewBox from '@holi/core/screens/insights/components/InsightPreviewBox'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import { simpleColumnSortingByIndex } from '@holi/core/screens/homeFeed/components/ContentListResults'
import { useBreakpointMatcher } from '@holi/core/helpers/useBreakpointMatcher'
import { useQuery } from '@apollo/client'

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

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const displayFeedbackLink = useFeatureFlagWithMaintenance(FeatureFlagKey.FEEDBACK_LINK).isOn

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

  if (totalResults == 0) return <></>

  console.log('data', data)

  const dataByColumns = simpleColumnSortingByIndex(feedData, numberOfColumns)
  const animKey = loading ? 'loading' : feedData.length > 0 ? 'ready' : 'empty'

  // TODO: when SSR is enabled we need to lazy load the header because it can only be rendered on the client.
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
                <HoliText>{t('homeFeed.feedback')}</HoliText>
              </HoliLink>
            )}
            <NotificationAndSearchHeader {...props} />
          </View>
        </HoliTransition.FadeRight>
      ),
    })
  }, [navigate, t, headerTitle, setScreenOptions, colors.black300, displayFeedbackLink])

  return (
    <SpaceTermContextProvider>
      <GestureHandlerRootView style={{ backgroundColor: colors.white200 }}>
        <ScrollView>
          <View style={styles.sections}>
            <HoliTransition.FadeDown visible>
              <HomeFeedHeader />
            </HoliTransition.FadeDown>

            <AttendingChallengeEvents />
            <ErrorBoundary>
              <HoliContainer>
                <HoliTransition.FadeSwitch animKey={animKey}>
                  {animKey === 'loading' && <LoadingSkeleton columns={numberOfColumns} />}

                  {animKey === 'ready' && (
                    <View style={styles.container} testID="posts-list-results">
                      {dataByColumns.map((column, index) => (
                        <View key={index} style={styles.column}>
                          {column.map((item: any) => (
                            <HoliTransition.FadeDown key={item.feedPost?.id} visible index={index}>
                              {item.feedPost && (
                                <GenericPostCard key={item.feedPost.id} post={item.feedPost} allTopics={allTopics} />
                              )}
                              {item.spacePost && (
                                <GenericPostCard key={item.spacePost.id} post={item.spacePost} allTopics={allTopics} />
                              )}
                              {item.insight && <InsightPreviewBox key={item.insight.id} insight={item.insight} />}
                            </HoliTransition.FadeDown>
                          ))}
                        </View>
                      ))}
                    </View>
                  )}

                  {animKey === 'empty' && <></>}
                </HoliTransition.FadeSwitch>
              </HoliContainer>
            </ErrorBoundary>
          </View>

          {/* Floating CreatePostButton needs to be outside the Layout */}
        </ScrollView>
      </GestureHandlerRootView>
      <ButtonFloatingWrapper>
        <CreatePostButton />
      </ButtonFloatingWrapper>
    </SpaceTermContextProvider>
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

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })

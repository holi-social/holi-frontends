import { DocumentNode, useApolloClient } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import Animated, { FadeInDown, FadeInLeft, FadeInRight } from 'react-native-reanimated'

import { useLoginState } from '@holi/core/auth/loginState'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { FeatureFlagKey } from '@holi/core/featureFlags/hooks/useFeatureFlag.common'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HomeFeedHeader from '@holi/core/screens/homeFeed/components/HomeFeedHeader'
import InsightsOfTheWeek from '@holi/core/screens/homeFeed/components/InsightsOfTheWeek'
import Recommendations from '@holi/core/screens/homeFeed/components/Recommendations'
import UserSuggestions from '@holi/core/screens/homeFeed/components/UserSuggestions'
import { userSuggestionsQuery } from '@holi/core/screens/homeFeed/queries'
import AllPosts from '@holi/core/screens/individualPosts/components/AllPosts'
import CreatePostButton from '@holi/core/screens/individualPosts/components/CreatePostButton'
import { allPostsQuery } from '@holi/core/screens/individualPosts/queries'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import OnboardingInitializer from '@holi/core/screens/onboarding/OnboardingInitializer'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import { useTheme } from '@holi/ui/styles/theme'

import AttendingChallengeEvents from '@holi-apps/challenges/components/AttendingChallengeEvents'
import RecommendedChallenges from '@holi-apps/challenges/components/RecommendedChallenges'
import { donationProjectsQuery } from '@holi-apps/donations/queries'
import { goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { volunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'

const temporalGreeting = (hours: number, t: (key: string) => string) => {
  if (hours >= 5 && hours < 11) return t('homeFeed.headerTitle.goodMorning')
  else if (hours >= 11 && hours < 14) return t('homeFeed.headerTitle.goodDay')
  else if (hours >= 14 && hours < 18) return t('homeFeed.headerTitle.goodAfternoon')
  else if (hours >= 18 && hours < 23) return t('homeFeed.headerTitle.goodEvening')
  else return t('homeFeed.headerTitle.goodNight')
}

const HomeFeed = () => {
  const { isLoggedIn } = useLoginState()
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(new Date().getHours(), t)
  const { theme } = useTheme()
  const colors = useMemo(() => theme.colors, [theme])
  const client = useApolloClient()

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const donationsEnabled = useFeatureFlagWithMaintenance(FeatureFlagKey.DONATIONS).isOn
  const goodnewsEnabled = useFeatureFlagWithMaintenance(FeatureFlagKey.GOODNEWS).isOn
  const volunteeringEnabled = useFeatureFlagWithMaintenance(FeatureFlagKey.VOLUNTEERING).isOn

  // TODO: when SSR is enabled we need to lazy load the header because it can only be rendered on the client.
  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: headerTitle,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerTitle: () => null,
      headerLeft: () => (
        <Animated.View entering={FadeInLeft}>
          <HoliLogo />
        </Animated.View>
      ),
      headerRight: (props) => (
        <Animated.View entering={FadeInRight}>
          <NotificationAndSearchHeader {...props} />
        </Animated.View>
      ),
    })
  }, [navigate, t, headerTitle, setScreenOptions, colors.background10])

  const { refreshing, onRefresh } = useOnRefresh(() =>
    client.refetchQueries({
      include: [
        allPostsQuery,
        lastInsightsQuery,
        donationsEnabled ? donationProjectsQuery : undefined,
        goodnewsEnabled ? goodNewsArticlesQuery : undefined,
        volunteeringEnabled ? volunteeringEngagementsQuery : undefined,
        isLoggedIn ? userSuggestionsQuery : undefined,
      ].filter((q) => q !== undefined) as DocumentNode[],
    })
  )

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        style={[styles.layout, { backgroundColor: colors.white200 }]}
      >
        <View style={styles.sections}>
          <Animated.View entering={FadeInDown}>
            <HomeFeedHeader />
          </Animated.View>

          <AttendingChallengeEvents />
          <ErrorBoundary>
            <AllPosts />
          </ErrorBoundary>
          <ErrorBoundary>
            <RecommendedChallenges />
          </ErrorBoundary>
          <ErrorBoundary>
            <InsightsOfTheWeek />
          </ErrorBoundary>
          <ErrorBoundary>
            <Recommendations />
          </ErrorBoundary>
          {isLoggedIn && <UserSuggestions />}
        </View>
      </ScrollHeaderLayout.Refreshable>

      {/* Floating CreatePostButton need to be outside the Layout */}
      <CreatePostButton />

      <OnboardingInitializer />
    </>
  )
}

const styles = StyleSheet.create({
  layout: {
    paddingBottom: 80,
  },
  sections: {
    gap: 32,
  },
})

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })

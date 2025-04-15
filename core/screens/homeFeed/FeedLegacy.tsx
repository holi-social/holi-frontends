import { withProfiler } from '@sentry/react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HomeFeedHeader from '@holi/core/screens/homeFeed/components/HomeFeedHeader'
import InsightsOfTheWeek from '@holi/core/screens/homeFeed/components/InsightsOfTheWeek'
import Recommendations from '@holi/core/screens/homeFeed/components/Recommendations'
import UserSuggestions from '@holi/core/screens/homeFeed/components/UserSuggestions'
import AllPosts from '@holi/core/screens/individualPosts/components/AllPosts'
import CreatePostButton, { ButtonFloatingWrapper } from '@holi/core/screens/individualPosts/components/CreatePostButton'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'

import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import AttendingChallengeEventsLegacy from '@holi-apps/challenges/components/AttendingChallengeEventsLegacy'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import { SURVEY_URL } from '@holi/core/constants/urls'

const HomeFeed = () => {
  const { isLoggedIn } = useLoggedInUser()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const colors = useMemo(() => theme.colors, [theme])

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const displayFeedbackLink = useFeatureFlagWithMaintenance(FeatureFlagKey.FEEDBACK_LINK).isOn

  // TODO: when SSR is enabled we need to lazy load the header because it can only be rendered on the client.
  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: '',
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTitle: () => null,
      headerTintColor: colors.black300,
      headerLeft: ({ tintColor }) => (
        <HoliTransition.FadeLeft visible>
          <HoliLogo color={tintColor} />
        </HoliTransition.FadeLeft>
      ),
      headerRight: () => (
        <HoliTransition.FadeRight visible>
          <View style={styles.headerRight}>
            {displayFeedbackLink && (
              <HoliLink external href={SURVEY_URL} label={t('homeFeed.feedback')}>
                <HoliText>{t('homeFeed.feedback')}</HoliText>
              </HoliLink>
            )}
            <NotificationAndSearchHeader />
          </View>
        </HoliTransition.FadeRight>
      ),
    })
  }, [navigate, t, setScreenOptions, colors.black300, displayFeedbackLink])

  return (
    <GestureHandlerRootView testID="home-feed-listing">
      <ScrollViewRefreshable style={{ backgroundColor: colors.white200 }} contentContainerStyle={styles.layout}>
        <View style={styles.sections}>
          <HoliContainer>
            <HoliTransition.FadeDown visible>
              <HomeFeedHeader />
            </HoliTransition.FadeDown>
          </HoliContainer>

          <AttendingChallengeEventsLegacy />
          <ErrorBoundary>
            <AllPosts />
          </ErrorBoundary>
          <ErrorBoundary>
            <InsightsOfTheWeek />
          </ErrorBoundary>
          <ErrorBoundary>
            <Recommendations />
          </ErrorBoundary>
          {isLoggedIn && <UserSuggestions />}
        </View>
      </ScrollViewRefreshable>

      {/* Floating CreatePostButton needs to be outside the Layout */}
      <ButtonFloatingWrapper>
        <CreatePostButton />
      </ButtonFloatingWrapper>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  layout: {
    paddingBottom: 80,
  },
  sections: {
    gap: 32,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
})

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })

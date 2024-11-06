import { withProfiler } from '@sentry/react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
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
import Recommendations from '@holi/core/screens/homeFeed/components/Recommendations'
import UserSuggestions from '@holi/core/screens/homeFeed/components/UserSuggestions'
import AllPosts from '@holi/core/screens/individualPosts/components/AllPosts'
import CreatePostButton, { ButtonFloatingWrapper } from '@holi/core/screens/individualPosts/components/CreatePostButton'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'

import AttendingChallengeEvents from '@holi-apps/challenges/components/AttendingChallengeEvents'

const temporalGreeting = (hours: number, t: (key: string) => string) => {
  if (hours >= 5 && hours < 11) return t('homeFeed.headerTitle.goodMorning')
  else if (hours >= 11 && hours < 14) return t('homeFeed.headerTitle.goodDay')
  else if (hours >= 14 && hours < 18) return t('homeFeed.headerTitle.goodAfternoon')
  else if (hours >= 18 && hours < 23) return t('homeFeed.headerTitle.goodEvening')
  else return t('homeFeed.headerTitle.goodNight')
}

const surveyUrl = 'https://tally.so/r/nrdGxX'

const HomeFeed = () => {
  const { isLoggedIn } = useLoggedInUser()
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(new Date().getHours(), t)
  const { theme } = useTheme()
  const colors = useMemo(() => theme.colors, [theme])

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  // TODO: when SSR is enabled we need to lazy load the header because it can only be rendered on the client.
  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: headerTitle,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
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
            <HoliLink external href={surveyUrl} label={t('homeFeed.feedback')}>
              <HoliText>{t('homeFeed.feedback')}</HoliText>
            </HoliLink>
            <NotificationAndSearchHeader {...props} />
          </View>
        </HoliTransition.FadeRight>
      ),
    })
  }, [navigate, t, headerTitle, setScreenOptions, colors.black300])

  return (
    <GestureHandlerRootView>
      <ScrollHeaderLayout style={{ backgroundColor: colors.white200 }} contentContainerStyle={styles.layout}>
        <View style={styles.sections}>
          <HoliTransition.FadeDown visible>
            <HomeFeedHeader />
          </HoliTransition.FadeDown>

          <AttendingChallengeEvents />
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
      </ScrollHeaderLayout>

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

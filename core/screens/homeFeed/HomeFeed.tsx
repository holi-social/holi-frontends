import { DocumentNode } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import client from '@holi/api/graphql/client'
import { useAuth } from '@holi/core/auth/helpers/useAuth'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import NotificationSearchButtons from '@holi/core/navigation/components/NotificationSearchButtons'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import AppsDrawer from '@holi/core/screens/homeFeed/components/AppsDrawer'
import InsightsOfTheWeek from '@holi/core/screens/homeFeed/components/InsightsOfTheWeek'
import UpdatesOfYourApps from '@holi/core/screens/homeFeed/components/UpdatesOfYourApps'
import UserSuggestions from '@holi/core/screens/homeFeed/components/UserSuggestions'
import { FeatureToggleStatus, userSuggestionsQuery } from '@holi/core/screens/homeFeed/queries'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import type { BottomTabsScreens } from '@holi/mobile/navigation/BottomTabsNavigator'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

import { projectsQuery } from '@holi-apps/donations/queries'
import { GoodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { VolunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'

export type HomeFeedProps = Partial<NativeStackScreenProps<BottomTabsScreens>>

const temporalGreeting = (hours: number, t: (key: string) => string) => {
  if (hours >= 5 && hours < 11) return t('homeFeed.headerTitle.goodMorning')
  else if (hours >= 11 && hours < 14) return t('homeFeed.headerTitle.goodDay')
  else if (hours >= 14 && hours < 18) return t('homeFeed.headerTitle.goodAfternoon')
  else if (hours >= 18 && hours < 23) return t('homeFeed.headerTitle.goodEvening')
  else return t('homeFeed.headerTitle.goodNight')
}

const HomeFeed = () => {
  const { isLoggedIn } = useAuth()
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(new Date().getHours(), t)

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const { status: ftDonationsStatus } = useFeatureToggle(FeatureToggleName.APPS_DONATIONS)
  const { status: ftGoodnewsStatus } = useFeatureToggle(FeatureToggleName.APPS_GOODNEWS)
  const { status: ftVolunteeringStatus } = useFeatureToggle(FeatureToggleName.APPS_VOLUNTEERING)

  // TODO: when SSR is enabled we need to lazy load the header
  // because it can only be rendered on the client.
  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: headerTitle,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerTitle: () => null,
      headerLeft: () => (
        <HoliButton label={t('navigation.home')} inline transparent onPress={() => navigate('/')}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/holi/holi_beta.svg')}
            isSvg
            width={78}
            height={24}
            label={t('navigation.title')}
          />
        </HoliButton>
      ),
      headerRight: (props) => <NotificationSearchButtons {...props} />,
    })
  }, [navigate, t, headerTitle, setScreenOptions])

  const { refreshing, onRefresh } = useOnRefresh(() =>
    client.refetchQueries({
      include: [
        lastInsightsQuery,
        ftDonationsStatus === FeatureToggleStatus.PRODUCTION || ftDonationsStatus === FeatureToggleStatus.PREVIEW
          ? projectsQuery
          : undefined,
        ftGoodnewsStatus === FeatureToggleStatus.PRODUCTION || ftGoodnewsStatus === FeatureToggleStatus.PREVIEW
          ? GoodNewsArticlesQuery
          : undefined,
        ftVolunteeringStatus === FeatureToggleStatus.PRODUCTION || ftVolunteeringStatus === FeatureToggleStatus.PREVIEW
          ? VolunteeringEngagementsQuery
          : undefined,
        isLoggedIn ? userSuggestionsQuery : undefined,
      ].filter((q) => q !== undefined) as DocumentNode[],
    })
  )

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          isLoading: refreshing,
          onRefresh,
        }}
        style={styles.layout}
      >
        <>
          <InsightsOfTheWeek style={styles.insightsOfTheWeek} />

          <UpdatesOfYourApps style={styles.updatesOfYourApps} />

          {isLoggedIn && <UserSuggestions style={[styles.userSuggestionsContainer]} />}
        </>
      </ScrollHeaderLayout.Refreshable>

      {/* AppsDrawer needs to be outside of the Layout */}
      <AppsDrawer />
    </>
  )
}

const styles = StyleSheet.create({
  layout: {
    paddingBottom: 80,
  },
  view: {
    alignItems: 'center',
    maxWidth: '100%',
    marginTop: 5,
  },
  insightsOfTheWeek: {
    marginTop: 32,
  },
  updatesOfYourApps: {
    marginTop: 100,
  },
  userSuggestionsContainer: {
    marginTop: 64,
  },
})

export default withProfiler(memo(HomeFeed), { name: 'HomeFeed' })

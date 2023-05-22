import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import client from '@holi/api/graphql/client'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import NotificationSearchButtons from '@holi/core/navigation/components/NotificationSearchButtons'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import AppsDrawer from '@holi/core/screens/homeFeed/components/AppsDrawer'
import InsightsOfTheWeek, { INSIGHT_PAGE_SIZE } from '@holi/core/screens/homeFeed/components/InsightsOfTheWeek'
import TestingBanner from '@holi/core/screens/homeFeed/components/TestingBanner'
import UpdatesOfYourApps from '@holi/core/screens/homeFeed/components/UpdatesOfYourApps'
import UserSuggestions from '@holi/core/screens/homeFeed/components/UserSuggestions'
import { userSuggestionsQuery } from '@holi/core/screens/homeFeed/queries'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import type { BottomTabsScreens } from '@holi/mobile/navigation/BottomTabsNavigator'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { PROJECT_PAGE_SIZE } from '@holi-apps/donations/components/DonationUpdates'
import { projectsQuery } from '@holi-apps/donations/queries'
import { GOOD_NEWS_PAGE_SIZE } from '@holi-apps/goodnews/components/GoodNewsUpdates'
import { GoodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { ENGAGEMENT_PAGE_SIZE } from '@holi-apps/volunteering/components/VolunteeringUpdates'
import { VolunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'

export type HomeFeedProps = Partial<NativeStackScreenProps<BottomTabsScreens>>

const refreshHomeFeedPage = (isLoggedIn: boolean) =>
  Promise.all([
    client.query({ query: lastInsightsQuery, variables: { limit: INSIGHT_PAGE_SIZE }, fetchPolicy: 'network-only' }),
    client.query({
      query: projectsQuery,
      variables: { limit: PROJECT_PAGE_SIZE, offset: 0 },
      fetchPolicy: 'network-only',
    }),
    client.query({ query: GoodNewsArticlesQuery, fetchPolicy: 'network-only' }),
    client.query({
      query: VolunteeringEngagementsQuery,
      variables: {
        offset: 0,
        limit: GOOD_NEWS_PAGE_SIZE,
      },
      fetchPolicy: 'network-only',
    }),
    isLoggedIn
      ? client.query({
          query: userSuggestionsQuery,
          variables: { limit: ENGAGEMENT_PAGE_SIZE },
          fetchPolicy: 'network-only',
        })
      : Promise.resolve(),
  ])

const temporalGreeting = (hours: number, t: (key: string) => string) => {
  if (hours >= 5 && hours < 11) return t('homeFeed.headerTitle.goodMorning')
  else if (hours >= 11 && hours < 14) return t('homeFeed.headerTitle.goodDay')
  else if (hours >= 14 && hours < 18) return t('homeFeed.headerTitle.goodAfternoon')
  else if (hours >= 18 && hours < 23) return t('homeFeed.headerTitle.goodEvening')
  else return t('homeFeed.headerTitle.goodNight')
}

const HomeFeed = () => {
  const { isLoggedIn } = useLoggedInUser()
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(new Date().getHours(), t)

  const mixins = useStyleMixins()

  const { setOptions, navigate } = useUnifiedNavigation()

  // TODO: when SSR is enabled we need to lazy load the header
  // because it can only be rendered on the client.
  useIsomorphicLayoutEffect(() => {
    setOptions({
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
  }, [setOptions, navigate, t, headerTitle])

  const [refreshing, setRefreshing] = useState(false)

  return (
    <>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          isLoading: refreshing,
          onRefresh: async () => {
            setRefreshing(true)
            await refreshHomeFeedPage(isLoggedIn)
            setRefreshing(false)
          },
          refreshHeight: 100,
          loaderTopOffset: 56,
        }}
        style={styles.layout}
      >
        <>
          {Platform.OS === 'web' && (
            <View style={[mixins.container, styles.testingBannerWrapper]}>
              <TestingBanner />
            </View>
          )}

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
  testingBannerWrapper: {
    marginTop: 24,
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

export default memo(HomeFeed)

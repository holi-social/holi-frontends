import { DocumentNode } from '@apollo/client'
import { useApolloClient } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import AppsDrawer from '@holi/core/screens/appsHub/components/AppsDrawer'
import HomeFeedHeader from '@holi/core/screens/homeFeed/components/HomeFeedHeader'
import InsightsOfTheWeek from '@holi/core/screens/homeFeed/components/InsightsOfTheWeek'
import InspirationPosts from '@holi/core/screens/homeFeed/components/InspirationPosts'
import Recommendations from '@holi/core/screens/homeFeed/components/Recommendations'
import UserSuggestions from '@holi/core/screens/homeFeed/components/UserSuggestions'
import { inspirationPostsQuery, userSuggestionsQuery } from '@holi/core/screens/homeFeed/queries'
import CreatePostButton from '@holi/core/screens/individualPosts/components/CreatePostButton'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import type { BottomTabsScreens } from '@holi/mobile/navigation/BottomTabsNavigator'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { useTheme } from '@holi/ui/styles/theme'

import { donationProjectsQuery } from '@holi-apps/donations/queries'
import { goodNewsArticlesQuery } from '@holi-apps/goodnews/queries'
import { volunteeringEngagementsQuery } from '@holi-apps/volunteering/queries'

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
  const { theme } = useTheme()
  const colors = useMemo(() => theme.colors, [theme])
  const client = useApolloClient()

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const { ftEnabled: ftEnabledDonations, ftPreview: ftPreviewDonations } = useFeatureToggle(
    FeatureToggleName.APPS_DONATIONS
  )
  const { ftEnabled: ftEnabledGoodnews, ftPreview: ftPreviewGoodnews } = useFeatureToggle(
    FeatureToggleName.APPS_GOODNEWS
  )
  const { ftEnabled: ftEnabledVolunteering, ftPreview: ftPreviewVolunteering } = useFeatureToggle(
    FeatureToggleName.APPS_VOLUNTEERING
  )

  const { ftEnabled: ftEnabledPosts } = useFeatureToggle(FeatureToggleName.INDIVIDUALS_POST)

  const logo = useMemo(
    () =>
      theme.dark ? (
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/holi/holi_beta_white.svg')}
          isSvg
          width={78}
          height={24}
          label={t('navigation.title')}
        />
      ) : (
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/holi/holi_beta.svg')}
          isSvg
          width={78}
          height={24}
          label={t('navigation.title')}
        />
      ),
    [theme.dark, t]
  )

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
      headerLeft: () => logo,
      headerRight: (props) => <NotificationAndSearchHeader {...props} />,
    })
  }, [navigate, t, headerTitle, setScreenOptions, logo, colors.background10])

  const { refreshing, onRefresh } = useOnRefresh(() =>
    client.refetchQueries({
      include: [
        inspirationPostsQuery,
        lastInsightsQuery,
        ftEnabledDonations || ftPreviewDonations ? donationProjectsQuery : undefined,
        ftEnabledGoodnews || ftPreviewGoodnews ? goodNewsArticlesQuery : undefined,
        ftEnabledVolunteering || ftPreviewVolunteering ? volunteeringEngagementsQuery : undefined,
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
        style={styles.layout}
      >
        <View style={styles.sections}>
          <HomeFeedHeader />
          <InspirationPosts />
          <InsightsOfTheWeek />
          <Recommendations />
          {isLoggedIn && <UserSuggestions />}
        </View>
      </ScrollHeaderLayout.Refreshable>

      {/* AppsDrawer & CreatePostButton need to be outside of the Layout */}
      {/* {ftEnabledPosts ? <CreatePostButton /> : <AppsDrawer />} */}
      <CreatePostButton />
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

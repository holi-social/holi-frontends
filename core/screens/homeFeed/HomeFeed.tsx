import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import AppsDrawer from '@holi/core/screens/homeFeed/components/AppsDrawer'
import InsightsOfTheWeek from '@holi/core/screens/homeFeed/components/InsightsOfTheWeek'
import UpdatesOfYourApps from '@holi/core/screens/homeFeed/components/UpdatesOfYourApps'
import UserSuggestions from '@holi/core/screens/homeFeed/components/UserSuggestions'
import SpacesFilterHeader from '@holi/core/screens/spaces/SpacesFilterHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'

type HomeFeedProps = NativeStackScreenProps<HomeStackScreens>

const temporalGreeting = (hours: number, t: (key: string) => string) => {
  if (hours >= 5 && hours < 11) return t('homeFeed.headerTitle.goodMorning')
  else if (hours >= 11 && hours < 14) return t('homeFeed.headerTitle.goodDay')
  else if (hours >= 14 && hours < 18) return t('homeFeed.headerTitle.goodAfternoon')
  else if (hours >= 18 && hours < 23) return t('homeFeed.headerTitle.goodEvening')
  else return t('homeFeed.headerTitle.goodNight')
}

const HomeFeed: React.VFC<HomeFeedProps> = ({ navigation }: HomeFeedProps) => {
  const { isLoggedIn } = useContext(AuthContext)
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(new Date().getHours(), t)

  useNavigationHeader(navigation, { title: headerTitle })

  return (
    <>
      <DefaultLayout>
        <SpacesFilterHeader title={'all'} location={'hamburg'} style={styles.spacesContainer} />

        <InsightsOfTheWeek style={styles.insightsOfTheWeek} />
        <UpdatesOfYourApps style={styles.updatesOfYourApps} />
        {isLoggedIn && <UserSuggestions style={[styles.userSuggestionsContainer]} />}
      </DefaultLayout>

      {/* AppsDrawer needs to be outside of the Layout */}
      <AppsDrawer />
    </>
  )
}

const styles = StyleSheet.create({
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
    marginTop: 88,
  },
  spacesContainer: {
    marginVertical: 16,
    marginHorizontal: 24,
  },
})

export default HomeFeed

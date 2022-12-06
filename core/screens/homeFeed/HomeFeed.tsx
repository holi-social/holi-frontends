import React, { memo, useContext, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { useScrollYHandler } from '@holi/core/helpers'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import AppsDrawer from '@holi/core/screens/homeFeed/components/AppsDrawer'
import InsightsOfTheWeek from '@holi/core/screens/homeFeed/components/InsightsOfTheWeek'
import UpdatesOfYourApps from '@holi/core/screens/homeFeed/components/UpdatesOfYourApps'
import UserSuggestions from '@holi/core/screens/homeFeed/components/UserSuggestions'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { colors } from '@holi/ui/styles/globalVars'

type HomeFeedProps = NativeStackScreenProps<HomeStackScreens>

const temporalGreeting = (hours: number, t: (key: string) => string) => {
  if (hours >= 5 && hours < 11) return t('homeFeed.headerTitle.goodMorning')
  else if (hours >= 11 && hours < 14) return t('homeFeed.headerTitle.goodDay')
  else if (hours >= 14 && hours < 18) return t('homeFeed.headerTitle.goodAfternoon')
  else if (hours >= 18 && hours < 23) return t('homeFeed.headerTitle.goodEvening')
  else return t('homeFeed.headerTitle.goodNight')
}

const HomeFeed: React.VFC<HomeFeedProps> = () => {
  const { isLoggedIn } = useContext(AuthContext)
  const { t } = useTranslation()
  const headerTitle = temporalGreeting(new Date().getHours(), t)
  const onScreenScroll = useScrollYHandler()

  const { setOptions, navigate } = useUnifiedNavigation()

  useLayoutEffect(() => {
    setOptions({
      title: headerTitle,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.backgroundColorWhite },
      headerTitle: () => null,
      headerLeft: () => (
        <HoliButton label={t('navigation.home')} inline transparent onPress={() => navigate('/')}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/holi/holi.svg')}
            isSvg
            width={56}
            height={24}
            label="Holi"
          />
        </HoliButton>
      ),
      headerRight: ({ tintColor }) => (
        <HoliHorizontalRow>
          <HoliButton label={t('notifications.title')} inline transparent onPress={() => navigate('/notifications')}>
            <HoliIcon icon="notification-2" size={24} color={tintColor} />
          </HoliButton>

          <HoliButton label={t('navigation.search')} inline transparent onPress={() => navigate('/search')}>
            <HoliIcon icon="search" size={24} color={tintColor} />
          </HoliButton>
        </HoliHorizontalRow>
      ),
    })
  }, [setOptions, navigate, t, headerTitle])

  return (
    <>
      <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200} testID="scroll-container">
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
})

export default memo(HomeFeed)

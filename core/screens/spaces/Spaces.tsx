import { useQuery } from '@apollo/client'
import React, { useCallback, useContext, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationSearchButtons from '@holi/core/navigation/components/NotificationSearchButtons'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import DiscoverSpaces from '@holi/core/screens/spaces/components/DiscoverSpaces'
import MySpaces from '@holi/core/screens/spaces/components/MySpaces'
import SpaceFilterModal, { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import SpaceTermContextProvider from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import { MySpacesResponse, mySpaceQuery } from '@holi/core/screens/spaces/queries'
import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import type { BottomTabsScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<BottomTabsScreens>

const Spaces: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()
  const mixins = useStyleMixins()
  const { setOptions, navigate } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  const { height: deviceHeight } = useWindowDimensions()
  const { openToast } = useToast()
  const { user } = useContext(UserContext)

  const styles = getStyles(deviceHeight)

  let hasOwnSpaces = false
  const {
    loading,
    data: mySpacesData,
    error: mySpacesError,
  } = useQuery<MySpacesResponse>(mySpaceQuery, { skip: !isLoggedIn })
  const mySpaces = mySpacesData?.mySpaces || []
  hasOwnSpaces = isLoggedIn && !!(mySpacesData && mySpacesData?.mySpaces?.length > 0)

  useLayoutEffect(() => {
    const title = t('spaces.title')
    setOptions({
      title,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.backgroundColorWhite },
      headerTitle: () => null,
      headerLeft: ({ tintColor }) => (
        <HeaderTitle size="large" widthOfScreen={0.6} tintColor={tintColor}>
          {title}
        </HeaderTitle>
      ),
      headerRight: (props) => <NotificationSearchButtons {...props} />,
    })
  }, [setOptions, navigate, t])

  const applyFilters = useCallback(
    (filters: SpaceFilter) => {
      const params = new URLSearchParams()
      if (filters.topicSlug) {
        params.set('topic', filters.topicSlug)
      }
      if (filters.location) {
        params.set('location', filters.location)
      }
      filters.skillSlugs?.forEach((skill) => {
        params.append('skill', skill)
      })
      const paramsString = params.toString()
      paramsString && navigate('/spaces/filter?' + paramsString)
    },
    [navigate]
  )

  if (mySpacesError) {
    if (mySpacesError.message === 'Unauthorized') {
      hasOwnSpaces = false
    } else {
      openToast(t('global.technicalError'), HoliToastType.ERROR)
      return (
        <DefaultLayout style={styles.layout}>
          <View style={[mixins.container, styles.discoverSpacesContainer]} />
        </DefaultLayout>
      )
    }
  }

  if (loading) {
    return (
      <DefaultLayout style={styles.layout}>
        <View style={[mixins.container, styles.discoverSpacesContainer]} testID="spaces-loading">
          <HoliText>{t('spaces.spaceListing.loading')}</HoliText>
        </View>
      </DefaultLayout>
    )
  }

  return (
    <SpaceTermContextProvider>
      <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200} style={styles.layout}>
        {/* User has NO spaces => show discover view */}
        {!hasOwnSpaces && (
          <View style={[mixins.container, styles.discoverSpacesContainer]}>
            <DiscoverSpaces user={user} />
          </View>
        )}

        {/* User HAS spaces => show tabs with mine and discover */}
        {hasOwnSpaces && (
          <HoliTabs
            id="space-tabs"
            style={styles.holiTabs}
            tabs={[
              {
                title: t('spaces.tabs.mine'),
                style: styles.tabStyle,
                children: (
                  <View style={[mixins.container, styles.tabContentContainer]}>
                    <MySpaces mySpaces={mySpaces} />
                  </View>
                ),
              },
              {
                title: t('spaces.tabs.discover'),
                style: styles.tabStyle,
                children: (
                  <View style={[mixins.container, styles.tabContentContainer]}>
                    <DiscoverSpaces user={user} />
                  </View>
                ),
              },
            ]}
            testID="spaces-tab-navigation"
          />
        )}
      </DefaultLayout>
      <SpaceFilterModal applyFilters={applyFilters} />
    </SpaceTermContextProvider>
  )
}

const getStyles = (deviceHeight: number) =>
  StyleSheet.create({
    layout: {
      minHeight: deviceHeight,
    },
    discoverSpacesContainer: {
      flex: 1,
      paddingTop: 24,
      paddingBottom: vars.bottomBarHeight,
      backgroundColor: colors.backgroundColorGrey,
    },
    holiTabs: {
      flex: 1,
    },
    tabStyle: {
      minHeight: '100%',
      backgroundColor: colors.backgroundColorGrey,
    },
    tabContentContainer: {
      marginTop: 24,
    },
  })

export default Spaces

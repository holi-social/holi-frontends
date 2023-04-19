import { useQuery } from '@apollo/client'
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import CreateSpaceButton from '@holi/core/navigation/components/CreateSpaceButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationSearchButtons from '@holi/core/navigation/components/NotificationSearchButtons'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { useLoginModal } from '@holi/core/provider/LoginModalProvider'
import DiscoverSpaces from '@holi/core/screens/spaces/components/DiscoverSpaces'
import MySpaces from '@holi/core/screens/spaces/components/MySpaces'
import SpaceFilterModal, { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import SpaceTermContextProvider from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import { MySpacesResponse, mySpaceQuery } from '@holi/core/screens/spaces/queries'
import { useLoggedInUser } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const Spaces: React.VFC = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { setOptions, navigate } = useUnifiedNavigation()
  const [activeTab, setActiveTab] = useState(0)
  const { openToast } = useToast()
  const { user, isLoggedIn } = useLoggedInUser()
  const pageViewRef = useRef<ScrollView>(null)
  const { openLoginModal } = useLoginModal()
  // This is added to keep the reference of the current tab to handle the active tab in back navigation
  global.spaceDetailInitialTabIndex = 0

  let hasOwnSpaces = false
  // For now every pageview triggers a new fetch since business requirements of signup process are still in flux
  const {
    loading,
    data: mySpacesData,
    error: mySpacesError,
  } = useQuery<MySpacesResponse>(mySpaceQuery, { skip: !isLoggedIn })
  const mySpaces = mySpacesData?.mySpaces || []
  hasOwnSpaces = isLoggedIn && !!(mySpacesData && mySpacesData?.mySpaces?.length > 0)
  global.hasOwnSpaces = hasOwnSpaces

  const handleCreateSpaceButtonPress = useCallback(() => {
    isLoggedIn ? navigate('/spaces/create') : openLoginModal()
  }, [isLoggedIn, navigate, openLoginModal])

  useLayoutEffect(() => {
    const title = t('spaces.title')
    setOptions({
      title,
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerTitle: () => null,
      headerLeft: ({ tintColor }) => (
        <HeaderTitle size="large" tintColor={tintColor}>
          {title}
        </HeaderTitle>
      ),
      headerRight: (props) => (
        <HoliHorizontalRow>
          <CreateSpaceButton onPress={handleCreateSpaceButtonPress} {...props} />
          <NotificationSearchButtons {...props} />
        </HoliHorizontalRow>
      ),
    })
  }, [setOptions, navigate, t, handleCreateSpaceButtonPress])

  const onChangeTab = (tabIndex: number) => {
    setActiveTab(tabIndex)
    pageViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })
  }

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
      <DefaultScrollHeaderLayout ref={pageViewRef} style={styles.layout}>
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
            onChangeTab={onChangeTab}
            style={styles.holiTabs}
            tabs={[
              {
                title: t('spaces.tabs.mine'),
                style: styles.tabStyle,
                children: (
                  <View style={mixins.container}>
                    <MySpaces mySpaces={mySpaces} />
                  </View>
                ),
              },
              {
                title: t('spaces.tabs.discover'),
                style: styles.tabStyle,
                children: (
                  <View style={[mixins.container, styles.discoverSpacesContainer]}>
                    <DiscoverSpaces user={user} />
                  </View>
                ),
              },
            ]}
            testID="spaces-tab-navigation"
          />
        )}
      </DefaultScrollHeaderLayout>

      {(!hasOwnSpaces || (hasOwnSpaces && activeTab === 1)) && <SpaceFilterModal applyFilters={applyFilters} />}
    </SpaceTermContextProvider>
  )
}

const styles = StyleSheet.create({
  layout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    backgroundColor: colors.background20,
  },
  discoverSpacesContainer: {
    flex: 1,
    paddingTop: 24,
    paddingBottom: vars.bottomBarHeight,
  },
  holiTabs: {
    flex: 1,
  },
  tabStyle: {
    minHeight: '100%',
    backgroundColor: colors.background20,
  },
})

export default Spaces

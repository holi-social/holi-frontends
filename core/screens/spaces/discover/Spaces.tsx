import { DocumentNode, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import client from '@holi/api/graphql/client'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import CreateSpaceButton from '@holi/core/navigation/components/CreateSpaceButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationSearchButtons from '@holi/core/navigation/components/NotificationSearchButtons'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useLoginModal } from '@holi/core/provider/LoginModalProvider'
import SpaceFilterModal, { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import DiscoverSpaces from '@holi/core/screens/spaces/discover/components/DiscoverSpaces'
import MySpaces from '@holi/core/screens/spaces/discover/components/MySpaces'
import { MySpacesResponse, discoverSpacesQuery, mySpaceQuery } from '@holi/core/screens/spaces/discover/queries'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const Spaces = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  const [activeTab, setActiveTab] = useState(0)
  const { openToast } = useToast()
  const { user, isLoggedIn } = useLoggedInUser()
  const pageViewRef = useRef<ScrollView>(null)
  const { openLoginModal } = useLoginModal()
  const setScreenOptions = useSetScreenOptions()

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

  const { refreshing, onRefresh } = useOnRefresh(() =>
    client.refetchQueries({
      include: [isLoggedIn ? mySpaceQuery : undefined, discoverSpacesQuery].filter((q) => !!q) as DocumentNode[],
    })
  )

  const handleCreateSpaceButtonPress = useCallback(() => {
    isLoggedIn ? navigate('/spaces/create') : openLoginModal()
  }, [isLoggedIn, navigate, openLoginModal])

  useLayoutEffect(() => {
    const title = t('spaces.title')
    setScreenOptions({
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
  }, [navigate, t, handleCreateSpaceButtonPress, setScreenOptions])

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
      if (filters.locationId) {
        params.set('location', filters.locationId)
      }
      filters.skillSlugs?.forEach((skill) => {
        params.append('skill', skill)
      })
      const paramsString = params.toString()
      paramsString && navigate('/spaces/filter?' + paramsString)
    },
    [navigate]
  )

  useEffect(() => {
    if (mySpacesError && mySpacesError.message !== 'Unauthorized') {
      openToast(t('global.technicalError'), HoliToastType.ERROR)
      logError(mySpacesError?.message)
    }
  }, [mySpacesError, openToast, t])

  if (mySpacesError) {
    if (mySpacesError.message === 'Unauthorized') {
      hasOwnSpaces = false
    } else {
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
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          isLoading: refreshing,
          onRefresh,
        }}
        ref={pageViewRef}
        style={styles.layout}
      >
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
            scrollEnabled={Platform.OS !== 'android'} // Discover spaces has a horizontal scroll and React Native has a nested scrolling issue with Android
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
      </ScrollHeaderLayout.Refreshable>

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
    backgroundColor: colors.background10,
  },
  tabStyle: {
    minHeight: '100%',
    backgroundColor: colors.background20,
  },
})

export default withProfiler(Spaces, { name: 'Spaces' })

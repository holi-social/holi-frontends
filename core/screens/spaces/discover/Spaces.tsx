import { DocumentNode, useQuery } from '@apollo/client'
import { useApolloClient } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useBreakpointMatcher } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import CreateSpaceButton from '@holi/core/navigation/components/CreateSpaceButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import SpaceFilterModal, { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterModal'
import DiscoverSpaces from '@holi/core/screens/spaces/discover/components/DiscoverSpaces'
import MySpaces from '@holi/core/screens/spaces/discover/components/MySpaces'
import { MySpacesResponse, discoverSpacesQuery, mySpaceQuery } from '@holi/core/screens/spaces/discover/queries'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const Spaces = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  const [activeTab, setActiveTab] = useState(0)
  const { user, isLoggedIn } = useLoggedInUser()
  const pageViewRef = useRef<ScrollView>(null)
  const { openLoginModal } = useLoginModal()
  const setScreenOptions = useSetScreenOptions()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const client = useApolloClient()

  let hasOwnSpaces = false
  // For now every pageview triggers a new fetch since business requirements of signup process are still in flux
  const { loading, data: mySpacesData } = useQuery<MySpacesResponse>(mySpaceQuery, {
    skip: !isLoggedIn,
    onError: (error) => displayError(error, 'Failed to load spaces for user', { location: 'Spaces.mySpaceQuery' }),
  })
  const mySpaces = mySpacesData?.mySpaces || []

  hasOwnSpaces = isLoggedIn && !!mySpacesData?.mySpaces?.length

  const { refreshing, onRefresh } = useOnRefresh(() =>
    client.refetchQueries({
      include: [isLoggedIn ? mySpaceQuery : undefined, discoverSpacesQuery].filter((q) => !!q) as DocumentNode[],
    })
  )

  const handleCreateSpaceButtonPress = useCallback(() => {
    isLoggedIn ? navigate('/spaces/create') : openLoginModal({ description: t('spaces.create.loginRedirect.text') })
  }, [isLoggedIn, navigate, openLoginModal, t])

  const tabBarStyle = useBreakpointMatcher([[dimensions.breakpointS, mixins.container]])

  useIsomorphicLayoutEffect(() => {
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
          <NotificationAndSearchHeader {...props} />
        </HoliHorizontalRow>
      ),
      navigationCustomOptions: {
        seoTitle: t('seo.h1.spaces'),
      },
    })
  }, [navigate, t, handleCreateSpaceButtonPress, setScreenOptions, colors.background10])

  const onChangeTab = (tabIndex: number) => {
    setActiveTab(tabIndex)
    pageViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })
  }

  const applyFilters = useCallback(
    (filters: SpaceFilter) => {
      const params = new URLSearchParams()

      if (filters.location?.id) {
        params.set('location', filters.location.id)
      }

      filters.topicSlugs?.forEach((topic) => {
        params.append('topic', topic)
      })

      filters.skillSlugs?.forEach((skill) => {
        params.append('skill', skill)
      })
      const paramsString = params.toString()
      paramsString && navigate('/spaces/filter?' + paramsString)
    },
    [navigate]
  )

  if (loading) {
    return <HoliLoader style={{ backgroundColor: colors.background20 }} />
  }

  return (
    <SpaceTermContextProvider>
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
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
            tabBarStyle={tabBarStyle}
            backgroundColor={colors.background20}
            scrollEnabled={Platform.OS !== 'android'} // Discover spaces has a horizontal scroll and React Native has a nested scrolling issue with Android
            tabs={[
              {
                title: t('spaces.tabs.mine'),
                style: styles.tabStyle,
                children: (
                  <View style={[mixins.container, styles.mySpacesContainer]}>
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

      {(!hasOwnSpaces || activeTab === 1) && <SpaceFilterModal applyFilters={applyFilters} />}
    </SpaceTermContextProvider>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layout: {
      ...(Platform.select({
        web: {
          minHeight: '100vh',
        },
        native: {
          minHeight: '100%',
        },
      }) as ViewStyle),
      backgroundColor: theme.colors.background20,
    },
    discoverSpacesContainer: {
      flex: 1,
      paddingTop: 24,
      paddingBottom: dimensions.bottomBarHeight,
      minHeight: '100%',
    },
    holiTabs: {
      flex: 1,
      backgroundColor: theme.colors.background10,
    },
    tabStyle: {
      backgroundColor: theme.colors.background20,
    },
    mySpacesContainer: {
      paddingBottom: 24,
      flex: 1,
    },
  })

export default withProfiler(Spaces, { name: 'Spaces' })

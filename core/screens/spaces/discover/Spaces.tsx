import { DocumentNode, useApolloClient, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, ViewStyle } from 'react-native'

import FilterModal from '@holi/core/components/FIlterModal'
import HoliHead from '@holi/core/components/HoliHead'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useBreakpointMatcher } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useOnRefresh } from '@holi/core/helpers/useOnRefresh'
import useTabNavigation from '@holi/core/hooks/useTabNavigation'
import CreateSpaceButton from '@holi/core/navigation/components/CreateSpaceButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import SpaceFilterForm from '@holi/core/screens/spaces/components/SpaceFilterForm'
import { type SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterForm/types'
import DiscoverSpaces from '@holi/core/screens/spaces/discover/components/DiscoverSpaces'
import MySpaces from '@holi/core/screens/spaces/discover/components/MySpaces'
import { MySpacesResponse, discoverSpacesQuery, mySpaceQuery } from '@holi/core/screens/spaces/discover/queries'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export enum Tab {
  MINE = 'mine',
  DISCOVER = 'discover',
}

const Spaces = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
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

  const tabNamesInOrder = [Tab.MINE, Tab.DISCOVER]
  const { selectTabWithIndex, initialTabIndex, currentTabName } = useTabNavigation({
    tabNamesInOrder,
  })

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
    })
  }, [navigate, t, handleCreateSpaceButtonPress, setScreenOptions, colors.background10])

  const onChangeTab = (tabIndex: number) => {
    selectTabWithIndex(tabIndex)
    pageViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })
  }

  const { visible: isFilterModalShown, show: openFilterModal, hide: closeFilterModal } = useModalState()

  const applyFilters = (filters: SpaceFilter) => {
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
  }

  const onSubmit = (filters: SpaceFilter) => {
    applyFilters(filters)
    closeFilterModal()
  }

  if (loading || (isLoggedIn && !mySpacesData)) {
    return <HoliLoader style={{ backgroundColor: colors.background20 }} />
  }

  return (
    <SpaceTermContextProvider>
      <HoliHead
        title={t('metatags.spaces.title')}
        description={t('metatags.spaces.description')}
        ogTitle={t('metatags.spaces.og.title')}
        ogDescription={t('metatags.spaces.og.description')}
      />
      <ScrollHeaderLayout.Refreshable
        refreshableProps={{
          refreshing,
          onRefresh,
        }}
        ref={pageViewRef}
        style={styles.layout}
      >
        {!hasOwnSpaces ? (
          /* User has NO spaces => show discover view */
          <HoliContainer flex={1}>
            <DiscoverSpaces user={user} />
          </HoliContainer>
        ) : (
          /* User HAS spaces => show tabs with mine and discover */
          <HoliTabs
            id="space-tabs"
            onChangeTab={onChangeTab}
            style={styles.holiTabs}
            tabBarStyle={tabBarStyle}
            backgroundColor={colors.background20}
            scrollEnabled={Platform.OS !== 'android'} // Discover spaces has a horizontal scroll and React Native has a nested scrolling issue with Android
            initialStep={initialTabIndex}
            tabs={[
              {
                title: t('spaces.tabs.mine'),
                style: styles.tabStyle,
                children: (
                  <HoliContainer flex={1}>
                    <MySpaces mySpaces={mySpaces} />
                  </HoliContainer>
                ),
              },
              {
                title: t('spaces.tabs.discover'),
                style: styles.tabStyle,
                children: (
                  <HoliContainer flex={1}>
                    <DiscoverSpaces user={user} />
                  </HoliContainer>
                ),
              },
            ]}
            testID="spaces-tab-navigation"
          />
        )}
      </ScrollHeaderLayout.Refreshable>

      {(!hasOwnSpaces || currentTabName === Tab.DISCOVER) && (
        <FilterModal
          label={t('spaces.filter.heading')}
          buttonLabel={t('spaces.filter.button.label')}
          show={isFilterModalShown}
          open={openFilterModal}
          onDismiss={closeFilterModal}
        >
          <SpaceFilterForm onSubmit={onSubmit} />
        </FilterModal>
      )}
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
    holiTabs: {
      flex: 1,
      backgroundColor: theme.colors.background10,
    },
    tabStyle: {
      backgroundColor: theme.colors.background20,
    },
  })

export default withProfiler(Spaces, { name: 'Spaces' })

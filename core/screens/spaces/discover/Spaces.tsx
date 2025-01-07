import { type DocumentNode, useApolloClient, useQuery } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import type Animated from 'react-native-reanimated'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import FilterModal from '@holi/core/components/FIlterModal'
import HoliHead from '@holi/core/components/HoliHead'
import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import CreateSpaceButton from '@holi/core/navigation/components/CreateSpaceButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import createParamHooks, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import SpaceFilterForm from '@holi/core/screens/spaces/components/SpaceFilterForm'
import type { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterForm/types'
import DiscoverSpaces from '@holi/core/screens/spaces/discover/components/DiscoverSpaces'
import MySpaces from '@holi/core/screens/spaces/discover/components/MySpaces'
import { discoverSpacesQuery, mySpaceQuery, type MySpacesResponse } from '@holi/core/screens/spaces/discover/queries'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'

export enum Tab {
  MINE = 'mine',
  DISCOVER = 'discover',
}

export type SpacesTabParams = {
  tab?: Tab
}

const { useParam, useUpdateParams } = createParamHooks<SpacesTabParams>()

const Spaces = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { user, isLoggedIn } = useLoggedInUser()
  const pageViewRef = useRef<Animated.ScrollView>(null)
  const setScreenOptions = useSetScreenOptions()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const client = useApolloClient()
  const { navigateWithAuth } = useAuthRequiredNavigation()

  const { onScroll: onScreenScroll } = useThrottledMobileScrollEvents()

  let hasOwnSpaces = false
  // For now every pageview triggers a new fetch since business requirements of signup process are still in flux
  const { loading, data: mySpacesData } = useQuery<MySpacesResponse>(mySpaceQuery, {
    skip: !isLoggedIn,
    onError: (error) => displayError(error, 'Failed to load spaces for user', { location: 'Spaces.mySpaceQuery' }),
  })
  const mySpaces = mySpacesData?.mySpaces || []

  hasOwnSpaces = isLoggedIn && !!mySpacesData?.mySpaces?.length

  const [activeTab = Tab.MINE] = useParam('tab', singleParamConfig)
  const updateParams = useUpdateParams()
  const onChangeTab = (tabKey: string) => {
    updateParams({ tab: tabKey as Tab })
    pageViewRef.current?.scrollTo({ x: 0, y: 0, animated: true })
  }

  useOnRefresh(() =>
    client.refetchQueries({
      include: [isLoggedIn ? mySpaceQuery : undefined, discoverSpacesQuery].filter((q) => !!q) as DocumentNode[],
    })
  )

  useIsomorphicLayoutEffect(() => {
    const title = t('spaces.title')
    const handleCreateSpaceButtonPress = () =>
      navigateWithAuth('/spaces/create', {
        description: t('spaces.create.loginRedirect.text'),
        trackTrigger: 'CREATE_SPACE',
      })
    setScreenOptions({
      headerBackTitleVisible: true,
      headerBackVisible: true,
      headerShown: true,
      headerTitle: '',
      headerShadowVisible: false,
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
  }, [navigate, t, setScreenOptions, navigateWithAuth])

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
      <ScrollViewRefreshable ref={pageViewRef} style={styles.layout} onScroll={onScreenScroll}>
        {!hasOwnSpaces ? (
          /* User has NO spaces => show discover view */
          <HoliContainer flex={1}>
            <DiscoverSpaces user={user} />
          </HoliContainer>
        ) : (
          <View style={styles.tabsWrapper}>
            {/* User HAS spaces => show tabs with mine and discover */}
            <HoliTabs
              activeTab={activeTab}
              onChange={onChangeTab}
              backgroundColor={colors.background20}
              data={[
                {
                  key: Tab.MINE,
                  tabTitle: t('spaces.tabs.mine'),
                  content: () => <MySpaces mySpaces={mySpaces} />,
                },
                {
                  key: Tab.DISCOVER,
                  tabTitle: t('spaces.tabs.discover'),
                  content: () => <DiscoverSpaces user={user} />,
                },
              ]}
              keyExtractor={({ key }) => key}
              renderTabContent={({ item }) => item.content()}
              testID="spaces-tab-navigation"
            />
          </View>
        )}
      </ScrollViewRefreshable>

      <FilterModal
        actionButtonVisible={!hasOwnSpaces || activeTab === Tab.DISCOVER}
        label={t('spaces.filter.heading')}
        buttonLabel={t('spaces.filter.button.label')}
        shown={isFilterModalShown}
        open={openFilterModal}
        onDismiss={closeFilterModal}
      >
        <SpaceFilterForm onSubmit={onSubmit} />
      </FilterModal>
    </SpaceTermContextProvider>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    layout: {
      backgroundColor: theme.colors.background20,
    },
    tabsWrapper: {
      flex: 1,
      backgroundColor: theme.colors.background10,
    },
  })

export default withProfiler(Spaces, { name: 'Spaces' })

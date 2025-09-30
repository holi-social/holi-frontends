import { type DocumentNode, useApolloClient } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import type Animated from 'react-native-reanimated'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import HoliHead from '@holi/core/components/HoliHead'
import { useThrottledMobileScrollEvents } from '@holi/core/components/ScrollHeaderLayout/useMobileScrollHandler'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { ScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import CreateSpaceButton from '@holi/core/navigation/components/CreateSpaceButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import NotificationAndSearchHeader from '@holi/core/navigation/components/header/NotificationAndSearchHeader'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import createParamHooks, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import GetStartedView from '@holi/core/screens/spaces/discover/components/GetStartedView'
import MySpaces from '@holi/core/screens/spaces/discover/components/MySpaces'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { breakpoints, Spacing } from 'holi-bricks/foundations'
import { MySpacesDocument, useMySpacesQuery } from '@holi/api/graphql/graphql-codegen'
import { DiscoverSpacesDocument } from '@holi/api/graphql/graphql-codegen'
import * as Appcues from '@appcues/react-native'

export enum Tab {
  MINE = 'mine',
  DISCOVER = 'discover',
}

export type SpacesTabParams = {
  tab?: Tab
}

const { useParam, useUpdateParams } = createParamHooks<SpacesTabParams>()

const Spaces = () => {
  Appcues.screen('Organize')
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { isLoggedIn } = useLoggedInUser()
  const pageViewRef = useRef<Animated.ScrollView>(null)
  const setScreenOptions = useSetScreenOptions()
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const client = useApolloClient()
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const marginHorizontal = useBreakpointMatcher([
    [0, 0],
    [breakpoints.sm, Spacing.lg],
    [breakpoints.lg, Spacing['4xl']],
  ])

  const { onScroll: onScreenScroll } = useThrottledMobileScrollEvents()

  let hasOwnSpaces = false
  // For now every pageview triggers a new fetch since business requirements of signup process are still in flux
  const { loading, data: mySpacesData } = useMySpacesQuery({
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
      include: [isLoggedIn ? MySpacesDocument : undefined, DiscoverSpacesDocument].filter((q) => !!q) as DocumentNode[],
    })
  )

  useIsomorphicLayoutEffect(() => {
    const handleCreateSpaceButtonPress = () =>
      navigateWithAuth('/spaces/create', {
        description: t('spaces.create.loginRedirect.text'),
        trackTrigger: 'CREATE_SPACE',
      })

    setScreenOptions({
      /* have white background appearance */
      headerTransparent: false,
      /* hide title on ios with empty title string */
      headerTitle: '',
      headerBackVisible: false,
      headerLeft: ({ tintColor }) => (
        <HeaderTitle size="large" tintColor={tintColor}>
          {t('spaces.organize')}
        </HeaderTitle>
      ),
      headerRight: (props) => (
        <HoliHorizontalRow>
          <CreateSpaceButton onPress={handleCreateSpaceButtonPress} {...props} />
          <NotificationAndSearchHeader />
        </HoliHorizontalRow>
      ),
    })
  }, [navigate, t, setScreenOptions, navigateWithAuth])

  if (loading || (isLoggedIn && !mySpacesData)) {
    return <HoliLoader style={{ backgroundColor: colors.background20 }} />
  }

  return (
    <>
      <HoliHead
        title={t('metatags.spaces.title')}
        description={t('metatags.spaces.description')}
        ogTitle={t('metatags.spaces.og.title')}
        ogDescription={t('metatags.spaces.og.description')}
      />
      <ScrollViewRefreshable ref={pageViewRef} style={styles.layout} onScroll={onScreenScroll}>
        {!hasOwnSpaces ? (
          /* User has NO spaces => show discover view */
          <GetStartedView />
        ) : (
          <HoliTabs
            activeTab={activeTab}
            onChange={onChangeTab}
            backgroundColor={colors.background20}
            marginHorizontal={marginHorizontal}
            data={[
              {
                key: Tab.MINE,
                tabTitle: t('spaces.tabs.mine'),
                content: () => <MySpaces mySpaces={mySpaces} />,
              },
              {
                key: Tab.DISCOVER,
                tabTitle: t('spaces.tabs.getstarted'),
                content: () => <GetStartedView />,
              },
            ]}
            keyExtractor={({ key }) => key}
            renderTabContent={({ item }) => item.content()}
            testID="spaces-tab-navigation"
          />
        )}
      </ScrollViewRefreshable>
    </>
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

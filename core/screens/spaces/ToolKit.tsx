import { useQuery } from '@apollo/client'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StatusBar, StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import AllTools from '@holi/core/screens/spaces/components/AllTools'
import FavouriteTools from '@holi/core/screens/spaces/components/FavouriteTools'
import ToolIdeas from '@holi/core/screens/spaces/components/ToolIdeas'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors } from '@holi/ui/styles/globalVars'

export type ToolKitParams = {
  spaceId: string
}

const { useParam } = createParam<ToolKitParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const ToolKit: React.VFC<ScreenProps> = () => {
  const { setOptions } = useUnifiedNavigation()
  const { t } = useTranslation()
  const [spaceId] = useParam('spaceId')
  const onScreenScroll = useScrollYHandler()

  const { data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { idOrName: spaceId },
  })
  const space = data?.spaceById

  useLayoutEffect(
    () =>
      setOptions({
        animation: 'slide_from_bottom',
        title: t('spaces.toolKit.title'),
        headerStyle: { backgroundColor: colors.background10 },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton icon="arrow-left" />,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setOptions, t, space]
  )

  return (
    <>
      <DefaultLayout
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
      >
        <HoliTabs
          id="upload-image-tabs"
          centeredButtons
          style={{ flex: 1 }}
          tabs={[
            {
              title: t('spaces.toolKit.allTools.label'),
              style: {
                ...styles.tabStyle,
              },
              children: <AllTools />,
            },
            {
              title: t('spaces.toolKit.favouriteTools.label'),
              style: {
                ...styles.tabStyle,
              },
              children: <FavouriteTools />,
            },
            {
              title: t('spaces.toolKit.toolIdeas.label'),
              style: {
                ...styles.tabStyle,
              },
              children: <ToolIdeas />,
            },
          ]}
        />
      </DefaultLayout>
    </>
  )
}

export default ToolKit

const styles = StyleSheet.create({
  defaultLayout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 8,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  contentStyle: {
    paddingBottom: 0,
  },
  tabStyle: {
    backgroundColor: colors.background10,
    width: '100%',
  },
})

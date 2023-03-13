import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import AllTools from '@holi/core/screens/spaces/components/AllTools'
import FavouriteTools from '@holi/core/screens/spaces/components/FavouriteTools'
import ToolIdeas from '@holi/core/screens/spaces/components/ToolIdeas'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type ToolKitParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<ToolKitParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const ToolKit: React.VFC<ScreenProps> = () => {
  const { setOptions } = useUnifiedNavigation()
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')

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
    [setOptions, t]
  )

  return (
    <View style={styles.defaultLayout}>
      <HoliTabs
        id="toolKit-tabs"
        centeredButtons
        style={{ flex: 1 }}
        tabs={[
          {
            title: t('spaces.toolKit.allTools.label'),
            style: {
              ...styles.tabStyle,
            },
            children: <AllTools spaceIdOrName={spaceIdOrName} />,
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
    </View>
  )
}

export default ToolKit

const styles = StyleSheet.create({
  defaultLayout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    marginTop: Platform.OS === 'web' ? vars.topBarHeight : vars.topBarHeight + 38,
  },
  tabStyle: {
    backgroundColor: colors.background10,
    width: '100%',
  },
})

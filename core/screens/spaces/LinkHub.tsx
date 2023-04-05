import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import AllTools from '@holi/core/screens/spaces/components/SpaceLinkHub/AllTools'
import SuggestedTools from '@holi/core/screens/spaces/components/SpaceLinkHub/SuggestedTools'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { colors } from '@holi/ui/styles/globalVars'

export type LinkHubParams = {
  spaceIdOrName: string
}

const { useParam } = createParam<LinkHubParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const LinkHub: React.VFC<ScreenProps> = () => {
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
    <>
      <DefaultScrollHeaderLayout style={styles.defaultLayout}>
        <HoliTabs
          id="toolKit-tabs"
          centeredButtons
          style={{ flex: 1 }}
          tabs={[
            {
              title: t('spaces.toolKit.allTools.label'),
              style: styles.tabStyle,
              children: <AllTools spaceIdOrName={spaceIdOrName} />,
            },
            {
              title: t('spaces.toolKit.toolIdeas.label'),
              style: styles.tabStyle,
              children: <SuggestedTools />,
            },
          ]}
        />
      </DefaultScrollHeaderLayout>
      {/* <AddButton /> */}
    </>
  )
}

export default LinkHub

const styles = StyleSheet.create({
  defaultLayout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    marginTop: 10,
    backgroundColor: colors.background20,
  },
  tabStyle: {
    backgroundColor: colors.background20,
    paddingBottom: 24,
  },
})

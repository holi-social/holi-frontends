import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import AllTools from '@holi/core/screens/spaces/components/AllTools'
import ToolIdeas from '@holi/core/screens/spaces/components/ToolIdeas'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
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
  const { navigate } = useRouting()

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

  const onAddButtonPress = () => {
    navigate(`/spaces/${spaceIdOrName}/addDigitalTool`)
  }

  const AddButton = () => {
    return (
      <HoliButton
        label={t('spaces.toolKit.add.button.label')}
        testID="space-add-tool-button"
        style={styles.overlayButton}
        onPress={onAddButtonPress}
      >
        <HoliIcon icon="add" size={20} />
      </HoliButton>
    )
  }

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
              children: <ToolIdeas />,
            },
          ]}
        />
      </DefaultScrollHeaderLayout>
      <AddButton />
    </>
  )
}

export default ToolKit

const styles = StyleSheet.create({
  defaultLayout: {
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
    marginTop: 10,
  },
  tabStyle: {
    backgroundColor: colors.background20,
    paddingBottom: 24,
  },
  overlayButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 0,
    paddingVertical: 0,
    bottom: vars.topBarHeight,
    right: 24,
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    justifyContent: 'center',
  },
})

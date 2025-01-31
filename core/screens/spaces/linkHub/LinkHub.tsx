import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type DimensionValue, Platform, StyleSheet, useWindowDimensions, View } from 'react-native'

import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useSpace } from '@holi/core/screens/spaces/hooks/useSpace'
import AllTools from '@holi/core/screens/spaces/linkHub/components/AllTools'
import SuggestedTools from '@holi/core/screens/spaces/linkHub/components/SuggestedTools'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { Add } from '@holi/icons/src/generated'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import TabContentScrollView from '@holi/ui/components/organisms/HoliTabs/TabContentScrollViewLayout'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { ButtonIcon } from 'holi-bricks/components/button'

export type LinkHubParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<LinkHubParams>()

const LinkHub = () => {
  const { t } = useTranslation()
  const spaceIdOrName = useParam('spaceIdOrName')
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { width: screenWidth } = useWindowDimensions()
  const screenOffset = Math.min(screenWidth, dimensions.maxScreenWidth) / 2
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { loading, error, space } = useSpace(spaceIdOrName)

  const [activeTab, setActiveTab] = useState<string>('all-links')

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      title: t('spaces.toolKit.title'),
      headerLeft: () => <HeaderBackButton />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t, colors.background10])

  const onAddButtonPress = () => {
    navigate(`/spaces/${spaceIdOrName}/linkhub/tools/create`)
  }

  const AddButton = () => {
    return (
      <View style={[styles.overlayButton, { transform: [{ translateX: -16 + screenOffset }] }]}>
        <ButtonIcon
          label={t('spaces.toolKit.add.button.label')}
          testID="space-add-tool-button"
          onPress={onAddButtonPress}
          icon={Add}
          size="lg"
        />
      </View>
    )
  }

  if (error || !space) {
    return <></>
  }

  if (loading) {
    return <HoliLoader />
  }

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceConnectionType.MEMBER}
    >
      <HoliTabs
        activeTab={activeTab}
        onChange={setActiveTab}
        centeredTabButtons
        data={[
          {
            key: 'all-links',
            tabTitle: t('spaces.toolKit.allTools.label'),
            style: styles.tabStyle,
            content: () => (
              <TabContentScrollView paddingBottom={ADD_BUTTON_DIMENSIONS.bottom + ADD_BUTTON_DIMENSIONS.height}>
                <AllTools spaceIdOrName={spaceIdOrName} />
              </TabContentScrollView>
            ),
          },
          {
            key: 'suggested-links',
            tabTitle: t('spaces.toolKit.toolIdeas.label'),
            style: styles.tabStyle,
            content: () => (
              <TabContentScrollView paddingBottom={ADD_BUTTON_DIMENSIONS.bottom + ADD_BUTTON_DIMENSIONS.height}>
                <SuggestedTools />
              </TabContentScrollView>
            ),
          },
        ]}
        keyExtractor={({ key }) => key}
        renderTabContent={({ item }) => item.content()}
        backgroundColor={colors.background20}
        testID="toolKit-tabs"
      />

      <AddButton />
    </PermissionsGuard>
  )
}

export default LinkHub

const ADD_BUTTON_DIMENSIONS = {
  width: 56,
  height: 56,
  bottom: dimensions.bottomBarHeight,
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    defaultLayout: {
      flex: 1,
      minHeight: Platform.OS === 'web' ? ('100vh' as DimensionValue) : ('100%' as DimensionValue),
      marginTop: 10,
      backgroundColor: theme.colors.background20,
    },
    tabBar: {
      flex: 1,
      backgroundColor: theme.colors.background10,
    },
    tabStyle: {
      backgroundColor: theme.colors.background20,
      paddingBottom: 24,
    },
    overlayButton: {
      ...ADD_BUTTON_DIMENSIONS,
      marginRight: 10,
      paddingHorizontal: 0,
      paddingVertical: 0,
      right: '50%',
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      justifyContent: 'center',
    },
  })

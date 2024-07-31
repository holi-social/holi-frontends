import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Platform, ScrollView, StyleSheet, useWindowDimensions } from 'react-native'

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
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type LinkHubParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<LinkHubParams>()

const LinkHub = () => {
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { width: screenWidth } = useWindowDimensions()
  const screenOffset = Math.min(screenWidth, dimensions.maxScreenWidth) / 2
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const { loading, error, space } = useSpace(spaceIdOrName)

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      animation: 'slide_from_bottom',
      title: t('spaces.toolKit.title'),
      headerTransparent: false,
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
      <HoliButton
        label={t('spaces.toolKit.add.button.label')}
        testID="space-add-tool-button"
        style={[styles.overlayButton, { transform: [{ translateX: -16 + screenOffset }] }]}
        onPress={onAddButtonPress}
      >
        <HoliIcon icon={Add} size={20} />
      </HoliButton>
    )
  }

  if (loading || error || !space) {
    return <></>
  }

  return (
    <PermissionsGuard
      permissionType={PermissionsType.SPACES}
      space={space}
      spaceConnectionType={SpaceConnectionType.MEMBER}
    >
      <ScrollView style={styles.defaultLayout}>
        <HoliTabs
          id="toolKit-tabs"
          centeredButtons
          style={styles.tabBar}
          backgroundColor={colors.background20}
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
      </ScrollView>
      <AddButton />
    </PermissionsGuard>
  )
}

export default LinkHub

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
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 1,
      marginRight: 10,
      paddingHorizontal: 0,
      paddingVertical: 0,
      bottom: dimensions.topBarHeight,
      right: '50%',
      position: Platform.OS === 'web' ? 'fixed' : 'absolute',
      justifyContent: 'center',
    },
  })

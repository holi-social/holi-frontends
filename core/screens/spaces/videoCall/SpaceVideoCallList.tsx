import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type SpaceVideoCallListParams = {
  spaceIdOrName: string
}

const SpaceVideoCallList = () => {
  const { t } = useTranslation()

  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({
      title: t('spaces.videocall.header'),
      headerStyle: { backgroundColor: colors.background10 },
      headerTransparent: true,
      headerLeft: () => <HeaderBackButton icon="arrow-left" />,
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  return (
    <>
      <ScrollHeaderLayout.Default style={styles.defaultLayout} headerOverlap />
    </>
  )
}

export default SpaceVideoCallList

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

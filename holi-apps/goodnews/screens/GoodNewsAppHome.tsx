import { StatusBar } from 'expo-status-bar'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { colors } from '@holi/ui/styles/globalVars'

import GoodNewsCarousel from '@holi-apps/goodnews/components/GoodNewsCarousel'
import GoodNewsHeader from '@holi-apps/goodnews/components/GoodNewsHeader'

const GoodNewsAppHome = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: ({ tintColor }) => <GoodNewsHeader tintColor={tintColor} />,
      headerLeft: ({ tintColor }) => <HeaderBackButton icon="arrow-down-s" tintColor={tintColor} />,
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerTintColor: colors.background10,
      navigationCustomOptions: {
        headerBackgroundGradient: true,
        footerShown: false,
      },
    })
  }, [setScreenOptions, t])

  return (
    <View testID={'goodnews-app-home'}>
      <StatusBar style="light" animated />

      <ScrollHeaderLayout.Default
        bounces={false}
        headerOverlap
        hasFooterTabBar={false}
        style={{ paddingBottom: 0, height: '100%', backgroundColor: colors.background30 }}
        contentStyle={{ height: '100%' }}
      >
        <GoodNewsCarousel />
      </ScrollHeaderLayout.Default>
    </View>
  )
}

export default memo(GoodNewsAppHome)

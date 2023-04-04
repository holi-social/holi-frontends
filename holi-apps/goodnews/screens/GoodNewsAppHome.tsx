import { StatusBar } from 'expo-status-bar'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { colors } from '@holi/ui/styles/globalVars'

import GoodNewsCarousel from '@holi-apps/goodnews/components/GoodNewsCarousel'
import GoodNewsHeader from '@holi-apps/goodnews/components/GoodNewsHeader'

type GoodNewsAppHomeProps = Record<string, never>

const GoodNewsAppHome: React.VFC<GoodNewsAppHomeProps> = () => {
  const { t } = useTranslation()
  const { setOptions } = useUnifiedNavigation()

  useLayoutEffect(
    () =>
      setOptions({
        headerTitle: ({ tintColor }) => <GoodNewsHeader tintColor={tintColor} />,
        headerLeft: ({ tintColor }) => <HeaderBackButton icon="arrow-down-s" tintColor={tintColor} />,
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: colors.background10,
        navigationCustomOptions: {
          headerBackgroundGradient: true,
          footerShown: false,
        },
      }),
    [setOptions, t]
  )

  return (
    <View testID={'goodnews-app-home'}>
      <StatusBar style="light" animated />

      <DefaultScrollHeaderLayout
        bounces={false}
        headerOverlap
        hasFooterTabBar={false}
        style={{ paddingBottom: 0, height: '100%', backgroundColor: colors.background30 }}
        contentStyle={{ height: '100%' }}
      >
        <GoodNewsCarousel />
      </DefaultScrollHeaderLayout>
    </View>
  )
}

export default memo(GoodNewsAppHome)

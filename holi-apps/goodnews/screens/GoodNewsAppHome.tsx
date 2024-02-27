import { StatusBar } from 'expo-status-bar'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import FeatureToggleGuard from '@holi/core/components/FeatureToggleGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useTheme } from '@holi/ui/styles/theme'

import GoodNewsCarousel from '@holi-apps/goodnews/components/GoodNewsCarousel'
import GoodNewsHeader from '@holi-apps/goodnews/components/GoodNewsHeader'

const GoodNewsAppHome = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { colors } = theme

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: ({ tintColor }) => <GoodNewsHeader tintColor={tintColor} />,
      headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerTintColor: colors.background10,
      navigationCustomOptions: {
        headerBackgroundGradient: true,
        footerShown: false,
      },
    })
  }, [setScreenOptions, t, colors.background10])

  return (
    <FeatureToggleGuard toggleName={FeatureToggleName.APPS_GOODNEWS} featureNameKey="goodnews:maintenance.feature">
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
    </FeatureToggleGuard>
  )
}

export default memo(GoodNewsAppHome)

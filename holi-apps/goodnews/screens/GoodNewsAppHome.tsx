import { StatusBar } from 'expo-status-bar'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { View, ScrollView } from 'react-native'

import PosthogFeatureFlagGuard from '@holi/core/featureFlags/components/PosthogFeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
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

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => <GoodNewsHeader />,
      headerLeft: () => <HeaderBackButton tintColor={colors.light} />,
      headerTintColor: colors.light,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      navigationCustomOptions: {
        background: { type: 'gradient' },
        footerShown: false,
      },
    })
  }, [setScreenOptions, t, colors.light])

  return (
    <PosthogFeatureFlagGuard featureFlagKey={FeatureFlagKey.GOODNEWS} i18nKey="goodnews:maintenance.feature">
      <View style={{ flex: 1 }} testID={'goodnews-app-home'}>
        <StatusBar style="light" animated />

        <ScrollView bounces={false} style={{ paddingBottom: 0, backgroundColor: colors.background30 }}>
          <GoodNewsCarousel />
        </ScrollView>
      </View>
    </PosthogFeatureFlagGuard>
  )
}

export default memo(GoodNewsAppHome)

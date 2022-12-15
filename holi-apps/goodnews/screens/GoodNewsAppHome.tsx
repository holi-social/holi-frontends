import { StatusBar } from 'expo-status-bar'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

import GoodNewsCarousel from '@holi-apps/goodnews/components/GoodNewsCarousel'

type GoodNewsAppHomeProps = Record<string, never>

const GoodNewsAppHome: React.VFC<GoodNewsAppHomeProps> = () => {
  const { t } = useTranslation()
  const title = t('goodnews:app.name')
  const onScreenScroll = useScrollYHandler()
  const { setOptions } = useUnifiedNavigation()

  useLayoutEffect(
    () =>
      setOptions({
        headerTitle: ({ tintColor }) => (
          <HoliText size={'large'} style={{ color: tintColor }}>
            {title}
          </HoliText>
        ),
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: colors.fontColorWhite,
        headerLeft: ({ tintColor }) =>
          Platform.OS === 'web' ? null : (
            <HeaderBackButton icon="arrow-down-s" tintColor={tintColor} contentStyle={styles.iconShadow} />
          ),
        navigationCustomOptions: {
          headerBackgroundGradient: true,
          footerShown: false,
        },
      }),
    [setOptions, t, title]
  )

  return (
    <>
      <StatusBar style="light" animated />

      <DefaultLayout
        bounces={false}
        style={styles.wrapper}
        headerOverlap
        hasFooterTabBar={true}
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
      >
        <GoodNewsCarousel />
      </DefaultLayout>
    </>
  )
}

export default memo(GoodNewsAppHome)

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.backgroundColorGreyDark,
  },
  iconShadow: {
    shadowColor: 'rgba(0,0,0,1)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
})

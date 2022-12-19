import { StatusBar } from 'expo-status-bar'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { colors } from '@holi/ui/styles/globalVars'

import GoodNewsCarousel from '@holi-apps/goodnews/components/GoodNewsCarousel'
import GoodNewsHeader from '@holi-apps/goodnews/components/GoodNewsHeader'

type GoodNewsAppHomeProps = Record<string, never>

const GoodNewsAppHome: React.VFC<GoodNewsAppHomeProps> = () => {
  const { t } = useTranslation()
  const title = t('goodnews:app.name')
  const onScreenScroll = useScrollYHandler()
  const { setOptions } = useUnifiedNavigation()

  useLayoutEffect(
    () =>
      setOptions({
        headerTitle: ({ tintColor }) => <GoodNewsHeader tintColor={tintColor} />,
        headerTransparent: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: colors.fontColorWhite,
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
        headerOverlap
        hasFooterTabBar={false}
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={{ paddingBottom: 0, height: '100%', backgroundColor: colors.backgroundColorGreyLight }}
      >
        <GoodNewsCarousel />
      </DefaultLayout>
    </>
  )
}

export default memo(GoodNewsAppHome)

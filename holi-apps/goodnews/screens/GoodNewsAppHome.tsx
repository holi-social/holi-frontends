import { StatusBar } from 'expo-status-bar'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useRoute } from '@holi/core/navigation/hooks/useParam/useRoute'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { colors } from '@holi/ui/styles/globalVars'

import GoodNewsCarousel from '@holi-apps/goodnews/components/GoodNewsCarousel'
import GoodNewsHeader from '@holi-apps/goodnews/components/GoodNewsHeader'

type GoodNewsAppHomeProps = Record<string, never>

// get params from GoodNewsUpdatesItem.tsx and pass them to GoodNewsCarousel.tsx

const GoodNewsAppHome: React.VFC<GoodNewsAppHomeProps> = () => {
  const { t } = useTranslation()
  const title = useRoute()?.params
  const onScreenScroll = useScrollYHandler()
  const { setOptions } = useUnifiedNavigation()
  const articleId = useRoute()?.params

  useLayoutEffect(
    () =>
      setOptions({
        headerTitle: ({ tintColor }) => <GoodNewsHeader tintColor={tintColor} />,
        headerLeft: ({ tintColor }) => (
          <HeaderBackButton icon={Platform.OS === 'web' ? 'arrow-left-s' : 'arrow-down-s'} tintColor={tintColor} />
        ),
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
    <View testID={'goodnews-app-home'}>
      <StatusBar style="light" animated />

      <DefaultLayout
        bounces={false}
        headerOverlap
        hasFooterTabBar={false}
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={{ paddingBottom: 0, height: '100%', backgroundColor: colors.backgroundColorGreyLight }}
      >
        <GoodNewsCarousel articleId={articleId} />
      </DefaultLayout>
    </View>
  )
}

export default memo(GoodNewsAppHome)

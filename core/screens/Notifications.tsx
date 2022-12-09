import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Notifications: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const title = t('notifications.title')
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()

  useLayoutEffect(
    () =>
      setOptions({
        title,
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
        headerRight: ({ tintColor }) =>
          Platform.OS === 'web' ? <HeaderBackButton icon="close" tintColor={tintColor} /> : undefined,
      }),
    [setOptions, title]
  )

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
      <View style={mixins.container}>
        <HoliHeading level="1" size="super">
          {title}
        </HoliHeading>
      </View>
    </DefaultLayout>
  )
}

export default memo(Notifications)

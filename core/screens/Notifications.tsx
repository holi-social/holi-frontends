import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const Notifications: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const title = t('notifications.title')
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  useLayoutEffect(() => setOptions({ title }), [setOptions, title])

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
      <View style={mixins.container}>
        <HoliHeading level="1" size="super">
          {title}
        </HoliHeading>

        {/* Example space join notification -- start -- */}
        <HoliHeading level="1" size="super">
          {t('notifications.join.request', { fullName: 'Uschi' })}
        </HoliHeading>
        <HoliText>Holi Moli Space</HoliText>
        <HoliButton inline label={t('notifications.join.request.accept')}>
          <HoliText>{t('notifications.join.request.accept')}</HoliText>
        </HoliButton>
        <HoliButton inline label={t('notifications.join.request.decline')}>
          <HoliText>{t('notifications.join.request.decline')}</HoliText>
        </HoliButton>
        {/* Example space join notification -- end -- */}
      </View>
    </DefaultLayout>
  )
}

export default memo(Notifications)

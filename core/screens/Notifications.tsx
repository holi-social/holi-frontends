import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type NotificationsProps = NativeStackScreenProps<HomeStackScreens>

const Notifications: React.VFC<NotificationsProps> = ({ navigation }: NotificationsProps) => {
  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('notifications.title')
  const mixins = useStyleMixins()

  useLayoutEffect(() => {
    setNavigationHeader(title)
    return clearNavigationHeader
  }, [navigation, title, setNavigationHeader, clearNavigationHeader])

  return (
    <DefaultLayout>
      <View style={mixins.container}>
        <HoliHeading level="1" size="super">
          {title}
        </HoliHeading>
      </View>
    </DefaultLayout>
  )
}

export default Notifications

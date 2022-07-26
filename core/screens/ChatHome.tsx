import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useTheme } from '@holi/ui/styles/theme'

type ChatHomeProps = NativeStackScreenProps<HomeStackScreens>

const ChatHome: React.VFC<ChatHomeProps> = ({ navigation }: ChatHomeProps) => {
  const { setNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()
  const title = t('chat.title')
  const { theme } = useTheme()

  useLayoutEffect(
    () =>
      setNavigationHeader({
        title: title,
        titleElement: () => <HoliText style={{ paddingTop: 5 }}>{title}</HoliText>,
      }),
    [navigation, setNavigationHeader, title]
  )

  return (
    <DefaultLayout>
      <View style={theme.mixins.container}>
        <HoliHeading level="1" size="super">
          {title}
        </HoliHeading>
      </View>
    </DefaultLayout>
  )
}

export default ChatHome

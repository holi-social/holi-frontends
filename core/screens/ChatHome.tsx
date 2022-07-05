import React, { useLayoutEffect } from 'react'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

type ChatHomeProps = NativeStackScreenProps<HomeStackScreens>

const ChatHome: React.VFC<ChatHomeProps> = ({ navigation }: ChatHomeProps) => {
  const { setNavigationHeader } = useNavigationHeader()
  const title = 'Chat'

  useLayoutEffect(
    () =>
      setNavigationHeader({
        title: title,
        titleElement: () => (
          <HoliText type={HoliTextType.body} style={{ paddingTop: 5 }}>
            {title}
          </HoliText>
        ),
      }),
    [navigation, setNavigationHeader]
  )

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliText type={HoliTextType.super}>Chat</HoliText>
    </View>
  )
}

export default ChatHome

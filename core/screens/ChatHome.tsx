import React, { useLayoutEffect } from 'react'
import { View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'

type ChatHomeProps = NativeStackScreenProps<HomeStackScreens>

const ChatHome: React.VFC<ChatHomeProps> = ({ navigation }: ChatHomeProps) => {
  const { setNavigationHeader } = useNavigationHeader()
  const title = 'Chat'

  useLayoutEffect(
    () =>
      setNavigationHeader({
        title: title,
        titleElement: () => <HoliText style={{ paddingTop: 5 }}>{title}</HoliText>,
      }),
    [navigation]
  )

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliHeading level="1" size="super">
        Chat
      </HoliHeading>
    </View>
  )
}

export default ChatHome

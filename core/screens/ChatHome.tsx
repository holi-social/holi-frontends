import React, { useLayoutEffect } from 'react'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
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
    <DefaultLayout>
      <HoliHeading level="1" size="super">
        Chat
      </HoliHeading>
    </DefaultLayout>
  )
}

export default ChatHome

import React, { useLayoutEffect } from 'react'
import { View } from 'react-native'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export const ChatHomeScreen: React.VFC = ({ navigation }) => {
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
    [navigation]
  )

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliText type={HoliTextType.super}>Chat</HoliText>
    </View>
  )
}

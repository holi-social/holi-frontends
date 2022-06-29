import React from 'react'
import { View } from 'react-native'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import HoliText, { HoliTextType } from '@holi/ui/components/HoliText'

export const ChatHomeScreen: React.VFC = () => {
  const { setNavigationHeader } = useNavigationHeader()
  const title = 'Chat'
  setNavigationHeader({
    title: title,
    titleElement: () => (
      <HoliText type={HoliTextType.body} style={{ paddingTop: 5 }}>
        {title}
      </HoliText>
    ),
  })

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliText type={HoliTextType.super}>Chat</HoliText>
    </View>
  )
}

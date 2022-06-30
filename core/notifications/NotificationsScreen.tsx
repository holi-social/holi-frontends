import React, { useEffect } from 'react'
import { View } from 'react-native'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export const NotificationsScreen: React.VFC = ({ navigation }) => {
  const { setNavigationHeader } = useNavigationHeader()
  const title = 'Your Notifications'

  useEffect(
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
      <HoliText type={HoliTextType.super}>Notifications</HoliText>
    </View>
  )
}

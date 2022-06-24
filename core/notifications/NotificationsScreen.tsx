import React, { useEffect, useLayoutEffect } from 'react'
import { View } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/context'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export const NotificationsScreen: React.VFC = ({ navigation }) => {
  const navigationContext = useNavigationContext()
  useEffect(() => navigationContext.setHeaderTitle('Your notifications'))

  navigation &&
    useLayoutEffect(
      () =>
        navigation.setOptions({
          headerTitle: () => (
            <HoliText type={HoliTextType.body} style={{ paddingTop: 5 }}>
              Your notifications
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

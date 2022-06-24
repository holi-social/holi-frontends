import React, { useEffect, useLayoutEffect } from 'react'
import { View } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/context'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export const VolunteeringAppHomeScreen: React.VFC = ({ navigation }) => {
  const navigationContext = useNavigationContext()
  useEffect(() => navigationContext.setHeaderTitle('Chat'))

  navigation &&
    useLayoutEffect(
      () =>
        navigation.setOptions({
          headerTitle: () => (
            <HoliText type={HoliTextType.body} style={{ paddingTop: 5 }}>
              Lets Act
            </HoliText>
          ),
        }),
      [navigation]
    )

  return (
    <View style={{ padding: 10 }}>
      <HoliText type={HoliTextType.super} testID="home-feed-title">
        Volunteering App Hom
      </HoliText>
    </View>
  )
}

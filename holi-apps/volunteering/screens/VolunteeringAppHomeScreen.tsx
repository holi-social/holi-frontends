import React, { useLayoutEffect } from 'react'
import { View } from 'react-native'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export const VolunteeringAppHomeScreen: React.VFC = ({ navigation }) => {
  const { setNavigationHeader } = useNavigationHeader()
  const title = 'Lets Act'

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
    <View style={{ padding: 10 }}>
      <HoliText type={HoliTextType.super} testID="home-feed-title">
        Volunteering App Home
      </HoliText>
    </View>
  )
}

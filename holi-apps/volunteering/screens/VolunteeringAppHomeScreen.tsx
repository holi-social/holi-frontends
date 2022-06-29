import React from 'react'
import { View } from 'react-native'

import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import HoliText, { HoliTextType } from '@holi/ui/components/HoliText'

export const VolunteeringAppHomeScreen: React.VFC = () => {
  const { setNavigationHeader } = useNavigationHeader()
  const title = 'Lets Act'
  setNavigationHeader({
    title: title,
    titleElement: () => (
      <HoliText type={HoliTextType.body} style={{ paddingTop: 5 }}>
        {title}
      </HoliText>
    ),
  })

  return (
    <View style={{ padding: 10 }}>
      <HoliText type={HoliTextType.super} testID="home-feed-title">
        Volunteering App Home
      </HoliText>
    </View>
  )
}

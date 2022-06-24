import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export const VolunteeringAppHomeScreen: React.VFC = () => (
  <View style={{ padding: 10 }}>
    <HoliText type={HoliTextType.super}>Volunteering App Home</HoliText>
  </View>
)

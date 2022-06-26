import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export const ChatHomeScreen: React.VFC = () => (
  <View style={{ padding: 10, alignItems: 'center' }}>
    <HoliText type={HoliTextType.super}>Chat</HoliText>
  </View>
)

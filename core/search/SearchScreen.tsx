import React from 'react'
import { View } from 'react-native'

import HoliHeading from '@holi/ui/components/HoliHeading'

export const SearchScreen: React.VFC = () => (
  <View style={{ padding: 10, alignItems: 'center' }}>
    <HoliHeading level={1}>Search</HoliHeading>
  </View>
)

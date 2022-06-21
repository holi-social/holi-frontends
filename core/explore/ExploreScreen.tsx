import React, { useEffect } from 'react'
import { View } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/context'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'

export const ExploreScreen: React.VFC = () => {
  const navigationContext = useNavigationContext()

  useEffect(() => navigationContext.setHeaderTitle('Explore Holi'), [])

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliText type={HoliTextType.super}>Explore</HoliText>
    </View>
  )
}

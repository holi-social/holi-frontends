import React, { useEffect } from 'react'
import { View } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/context'
import HoliHeading from '@holi/ui/components/HoliHeading'

export const ChatHomeScreen: React.VFC = () => {
  const navigationContext = useNavigationContext()

  useEffect(() => navigationContext.setHeaderTitle('Chat'), [])

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliHeading level={1}>Chat</HoliHeading>
    </View>
  )
}

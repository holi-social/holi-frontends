import React, { useEffect } from 'react'
import { View } from 'react-native'

import { useNavigationContext } from '@holi/core/navigation/context'
import HoliHeading from '@holi/ui/components/HoliHeading'

export const NotificationsScreen: React.VFC = () => {
  const navigationContext = useNavigationContext()

  useEffect(() => navigationContext.setHeaderTitle('Your notifications'), [])

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <HoliHeading level={1}>Notifications</HoliHeading>
    </View>
  )
}

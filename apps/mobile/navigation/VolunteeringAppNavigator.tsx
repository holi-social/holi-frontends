import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useTheme } from '@holi/ui/styles/theme'

import VolunteeringAppHome from '@holi-apps/volunteering/screens/VolunteeringAppHome'
import VolunteeringEngagementDetail from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'

export type VolunteeringAppScreensList = {
  [RouteName.VolunteeringAppHome]: undefined
  [RouteName.VolunteeringAppEngagmentDetail]: undefined
}

const VolunteeringAppStack = createNativeStackNavigator<VolunteeringAppScreensList>()

const VolunteeringAppNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme
  return (
    <VolunteeringAppStack.Navigator
      initialRouteName={RouteName.VolunteeringAppHome}
      screenOptions={{
        header: HeaderAnimated,
        headerShown: true,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.background10,
        },
      }}
    >
      <VolunteeringAppStack.Screen name={RouteName.VolunteeringAppHome} component={VolunteeringAppHome} />
      <VolunteeringAppStack.Screen
        name={RouteName.VolunteeringAppEngagmentDetail}
        component={VolunteeringEngagementDetail}
      />
    </VolunteeringAppStack.Navigator>
  )
}

export default VolunteeringAppNavigator

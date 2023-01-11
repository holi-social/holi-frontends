import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HeaderAnimated from '@holi//mobile/navigation/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

import VolunteeringAppHome from '@holi-apps/volunteering/screens/VolunteeringAppHome'
import VolunteeringEngagementDetail from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'

export type VolunteeringAppScreensList = {
  [RouteName.VolunteeringAppHome]: undefined
}

const VolunteeringAppStack = createNativeStackNavigator<VolunteeringAppScreensList>()

const VolunteeringAppNavigator: React.VFC = () => {
  return (
    <VolunteeringAppStack.Navigator
      initialRouteName={RouteName.VolunteeringAppHome}
      screenOptions={{
        header: HeaderAnimated,
        headerShown: true,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.backgroundColorWhite,
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

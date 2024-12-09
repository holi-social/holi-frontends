import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { RouteName } from '@holi/mobile/navigation/routeName'

import VolunteeringAppHome from '@holi-apps/volunteering/screens/VolunteeringAppHome'
import VolunteeringEngagementDetail, {
  type VolunteeringEngagementDetailParams,
} from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'
import type { VolunteeringFilterParams } from '@holi-apps/volunteering/types'

export type VolunteeringAppScreensList = {
  [RouteName.VolunteeringAppHome]: VolunteeringFilterParams
  [RouteName.VolunteeringAppHomeOld]: VolunteeringFilterParams
  [RouteName.VolunteeringAppHomeDE]: VolunteeringFilterParams
  [RouteName.VolunteeringAppEngagmentDetail]: VolunteeringEngagementDetailParams
  [RouteName.VolunteeringAppEngagmentDetailOld]: VolunteeringEngagementDetailParams
  [RouteName.VolunteeringAppEngagmentDetailDE]: VolunteeringEngagementDetailParams
}

const VolunteeringAppStack = createNativeStackNavigator<VolunteeringAppScreensList>()

const VolunteeringAppNavigator = () => {
  return (
    <VolunteeringAppStack.Navigator
      initialRouteName={RouteName.VolunteeringAppHome}
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
      }}
    >
      <VolunteeringAppStack.Screen name={RouteName.VolunteeringAppHome} component={VolunteeringAppHome} />
      <VolunteeringAppStack.Screen name={RouteName.VolunteeringAppHomeOld} component={VolunteeringAppHome} />
      <VolunteeringAppStack.Screen name={RouteName.VolunteeringAppHomeDE} component={VolunteeringAppHome} />
      <VolunteeringAppStack.Screen
        name={RouteName.VolunteeringAppEngagmentDetail}
        component={VolunteeringEngagementDetail}
      />
      <VolunteeringAppStack.Screen
        name={RouteName.VolunteeringAppEngagmentDetailOld}
        component={VolunteeringEngagementDetail}
      />
      <VolunteeringAppStack.Screen
        name={RouteName.VolunteeringAppEngagmentDetailDE}
        component={VolunteeringEngagementDetail}
      />
    </VolunteeringAppStack.Navigator>
  )
}

export default VolunteeringAppNavigator

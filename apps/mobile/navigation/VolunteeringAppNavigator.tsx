import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useTheme } from '@holi/ui/styles/theme'

import VolunteeringAppHome from '@holi-apps/volunteering/screens/VolunteeringAppHome'
import VolunteeringEngagementDetail, {
  VolunteeringEngagementDetailParams,
} from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'
import { VolunteeringFilterParams } from '@holi-apps/volunteering/types'

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

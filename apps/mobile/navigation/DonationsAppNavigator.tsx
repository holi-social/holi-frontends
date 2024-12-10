import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RouteName } from '@holi/mobile/navigation/routeName'

import DonationsAppHome, { type DonationsAppHomeParams } from '@holi-apps/donations/screens/DonationsAppHome'
import DonationsAppProjectDetail, {
  type DonationsAppProjectDetailParams,
} from '@holi-apps/donations/screens/DonationsAppProjectDetail'

export type DonationsAppScreensList = {
  DonationsAppHome: DonationsAppHomeParams
  DonationsAppHomeOld: DonationsAppHomeParams
  DonationsAppHomeDE: DonationsAppHomeParams
  DonationsAppProjectDetail: DonationsAppProjectDetailParams
  DonationsAppProjectDetailOld: DonationsAppProjectDetailParams
  DonationsAppProjectDetailDE: DonationsAppProjectDetailParams
}

const DonationsAppStack = createNativeStackNavigator<DonationsAppScreensList>()

const DonationsAppNavigator = () => {
  return (
    <DonationsAppStack.Navigator
      initialRouteName={RouteName.DonationsAppHome}
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
      }}
    >
      <DonationsAppStack.Screen name={RouteName.DonationsAppHome} component={DonationsAppHome} />
      <DonationsAppStack.Screen name={RouteName.DonationsAppHomeOld} component={DonationsAppHome} />
      <DonationsAppStack.Screen name={RouteName.DonationsAppHomeDE} component={DonationsAppHome} />
      <DonationsAppStack.Screen name={RouteName.DonationsAppProjectDetail} component={DonationsAppProjectDetail} />
      <DonationsAppStack.Screen name={RouteName.DonationsAppProjectDetailOld} component={DonationsAppProjectDetail} />
      <DonationsAppStack.Screen name={RouteName.DonationsAppProjectDetailDE} component={DonationsAppProjectDetail} />
    </DonationsAppStack.Navigator>
  )
}

export default DonationsAppNavigator

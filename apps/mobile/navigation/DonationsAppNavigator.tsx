import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HeaderAnimated from '@holi/core/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'

import DonationsAppHome, { DonationsAppHomeParams } from '@holi-apps/donations/screens/DonationsAppHome'
import DonationsAppProjectDetail, {
  DonationsAppProjectDetailParams,
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
        header: HeaderAnimated,
        headerShown: true,
        headerTransparent: true,
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

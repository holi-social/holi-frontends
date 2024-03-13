import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

import DonationsAppHome, { DonationsAppHomeParams } from '@holi-apps/donations/screens/DonationsAppHome'
import DonationsAppProjectDetail, {
  DonationsAppProjectDetailParams,
} from '@holi-apps/donations/screens/DonationsAppProjectDetail'

export type DonationsAppScreensList = {
  DonationsAppHome: DonationsAppHomeParams
  DonationsAppProjectDetail: DonationsAppProjectDetailParams
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
        headerStyle: {
          backgroundColor: colors.background10,
        },
      }}
    >
      <DonationsAppStack.Screen name={RouteName.DonationsAppHome} component={DonationsAppHome} />
      <DonationsAppStack.Screen name={RouteName.DonationsAppProjectDetail} component={DonationsAppProjectDetail} />
    </DonationsAppStack.Navigator>
  )
}

export default DonationsAppNavigator

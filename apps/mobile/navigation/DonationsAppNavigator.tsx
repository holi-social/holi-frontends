import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HeaderAnimated from '@holi//mobile/navigation/HeaderAnimated'
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

const DonationsAppNavigator: React.VFC = () => {
  return (
    <DonationsAppStack.Navigator
      initialRouteName="DonationsAppHome"
      screenOptions={{
        header: HeaderAnimated,
        headerShown: true,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.backgroundColorWhite,
        },
      }}
    >
      <DonationsAppStack.Screen name="DonationsAppHome" component={DonationsAppHome} />
      <DonationsAppStack.Screen name="DonationsAppProjectDetail" component={DonationsAppProjectDetail} />
    </DonationsAppStack.Navigator>
  )
}

export default DonationsAppNavigator

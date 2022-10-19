import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import BackButton from '@holi/core/navigation/components/BackButton'
import { colors } from '@holi/ui/styles/globalVars'

import DonationsAppHome, { DonationsAppHomeParams } from '@holi-apps/donations/screens/DonationsAppHome'
import DonationsAppProjectDetail, {
  DonationsAppProjectDetailParams,
} from '@holi-apps/donations/screens/DonationsAppProjectDetail'

import { CenterElement } from './components'

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
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.backgroundColorWhite,
        },
        headerTitleAlign: 'center',
      }}
    >
      <DonationsAppStack.Screen
        name="DonationsAppHome"
        component={DonationsAppHome}
        options={{
          headerBackVisible: false,
          headerTitle: CenterElement,
        }}
      />
      <DonationsAppStack.Screen
        name="DonationsAppProjectDetail"
        component={DonationsAppProjectDetail}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: BackButton,
          headerTitle: CenterElement,
        }}
      />
    </DonationsAppStack.Navigator>
  )
}

export default DonationsAppNavigator

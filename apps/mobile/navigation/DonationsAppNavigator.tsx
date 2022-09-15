import React from 'react'
import { View } from 'react-native'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { colors } from '@holi/ui/styles/globalVars'

import DonationsAppHome from '@holi-apps/donations/screens/DonationsAppHome'

export type DonationsAppScreensList = {
  DonationsAppHome: undefined
}

const DonationsAppStack = createNativeStackNavigator<DonationsAppScreensList>()

const DonationsAppNavigator: React.VFC = () => {
  return (
    <View style={{ height: '100%' }}>
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
        <DonationsAppStack.Screen name="DonationsAppHome" component={DonationsAppHome} />
      </DonationsAppStack.Navigator>
    </View>
  )
}

export default DonationsAppNavigator

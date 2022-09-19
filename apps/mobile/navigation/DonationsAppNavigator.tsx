import React from 'react'
import { View } from 'react-native'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import BackButton from '@holi/core/navigation/components/BackButton'
import { colors } from '@holi/ui/styles/globalVars'

import DonationsAppHome from '@holi-apps/donations/screens/DonationsAppHome'
import DonationsAppProjectDetail from '@holi-apps/donations/screens/DonationsAppProjectDetail'

export type DonationsAppScreensList = {
  DonationsAppHome: undefined
  DonationsAppProjectDetail: undefined
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
        <DonationsAppStack.Screen
          name="DonationsAppProjectDetail"
          component={DonationsAppProjectDetail}
          options={{
            headerBackTitleVisible: false,
            headerBackVisible: false,
            headerLeft: BackButton,
          }}
        />
      </DonationsAppStack.Navigator>
    </View>
  )
}

export default DonationsAppNavigator

import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { RouteName } from '@holi/mobile/navigation/routeName'

import { ChallengesAppHome, ChallengesAppHomeParams } from '@holi-apps/challenges/screens/ChallengesAppHome'

export type ChallengesAppScreensList = {
  [RouteName.ChallengesAppHome]: ChallengesAppHomeParams
}

const ChallengesAppStack = createNativeStackNavigator<ChallengesAppScreensList>()

const ChallengesAppNavigator = () => {
  return (
    <ChallengesAppStack.Navigator
      initialRouteName={RouteName.ChallengesAppHome}
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
      }}
    >
      <ChallengesAppStack.Screen name={RouteName.ChallengesAppHome} component={ChallengesAppHome} />
    </ChallengesAppStack.Navigator>
  )
}

export default ChallengesAppNavigator

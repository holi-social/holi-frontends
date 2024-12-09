import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { RouteName } from '@holi/mobile/navigation/routeName'

import ChallengesAppHome from '@holi-apps/challenges/screens/ChallengesAppHome'
import type { ChallengesAppHomeParams } from '@holi-apps/challenges/screens/ChallengesAppHome.shared'

export type ChallengesAppScreensList = {
  [RouteName.ChallengesAppHome]: ChallengesAppHomeParams
}

const ChallengesAppStack = createNativeStackNavigator<ChallengesAppScreensList>()

const ChallengesAppNavigator = () => {
  return (
    <ChallengesAppStack.Navigator
      initialRouteName={RouteName.ChallengesAppHome}
      screenOptions={{ headerShown: false, headerShadowVisible: false }}
    >
      <ChallengesAppStack.Screen name={RouteName.ChallengesAppHome} component={ChallengesAppHome} />
    </ChallengesAppStack.Navigator>
  )
}

export default ChallengesAppNavigator

import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useTheme } from '@holi/ui/styles/theme'

import { ChallengesAppHome, ChallengesAppHomeParams } from '@holi-apps/challenges/screens/ChallengesAppHome'

export type ChallengesAppScreensList = {
  [RouteName.ChallengesAppHome]: ChallengesAppHomeParams
}

const ChallengesAppStack = createNativeStackNavigator<ChallengesAppScreensList>()

const ChallengesAppNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme

  return (
    <ChallengesAppStack.Navigator
      initialRouteName={RouteName.ChallengesAppHome}
      screenOptions={{
        header: HeaderAnimated,
        headerShown: true,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.background10,
        },
      }}
    >
      <ChallengesAppStack.Screen name={RouteName.ChallengesAppHome} component={ChallengesAppHome} />
    </ChallengesAppStack.Navigator>
  )
}

export default ChallengesAppNavigator

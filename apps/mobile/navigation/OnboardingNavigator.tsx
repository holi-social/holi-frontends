import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import OnboardingRegistration from '@holi/core/screens/onboarding/OnboardingRegistration'
import OnboardingWelcome from '@holi/core/screens/onboarding/OnboardingWelcome'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type OnboardingScreensList = {
  [RouteName.OnboardingWelcome]: undefined
  [RouteName.OnboardingRegistration]: undefined
}

const OnboardingStack = createNativeStackNavigator<OnboardingScreensList>()

const OnboardingNavigator = () => {
  return (
    <OnboardingStack.Navigator
      initialRouteName={RouteName.OnboardingWelcome}
      screenOptions={{
        headerShown: false,
      }}
    >
      <OnboardingStack.Screen name={RouteName.OnboardingWelcome} component={OnboardingWelcome} />
      <OnboardingStack.Screen name={RouteName.OnboardingRegistration} component={OnboardingRegistration} />
    </OnboardingStack.Navigator>
  )
}

export default OnboardingNavigator

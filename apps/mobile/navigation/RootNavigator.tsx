import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ForgotPassword from '@holi/core/auth/screens/ForgotPassword'
import Login from '@holi/core/auth/screens/Login'
import Notifications from '@holi/core/screens/notifications/Notifications'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import BottmTabsNavigator from '@holi/mobile/navigation/BottomTabsNavigator'
import ChatStackNavigator from '@holi/mobile/navigation/ChatNavigator'
import DonationsAppNavigator from '@holi/mobile/navigation/DonationsAppNavigator'
import GoodNewsAppNavigator from '@holi/mobile/navigation/GoodNewsAppNavigator'
import InsightsNavigator from '@holi/mobile/navigation/InsightsNavigator'
import SpacesNavigator from '@holi/mobile/navigation/SpacesNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/VolunteeringAppNavigator'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type RootStackScreens = {
  [RouteName.BottomTabs]: undefined
  [RouteName.Notifications]: undefined
  [RouteName.Spaces]: undefined
  [RouteName.Insights]: undefined
  [RouteName.ChatStack]: undefined

  [RouteName.Onboarding]: undefined
  [RouteName.Login]: undefined
  [RouteName.Registration]: undefined
  [RouteName.ForgotPassword]: undefined

  [RouteName.DonationsApp]: undefined
  [RouteName.GoodNewsApp]: undefined
  [RouteName.VolunteeringApp]: undefined
}

const RootStack = createNativeStackNavigator<RootStackScreens>()

const RootNavigator = () => {
  return (
    <RootStack.Navigator
      initialRouteName={RouteName.BottomTabs}
      screenOptions={{
        header: HeaderAnimated,
      }}
    >
      <RootStack.Screen name={RouteName.BottomTabs} component={BottmTabsNavigator} options={{ headerShown: false }} />

      {/* HomeFeed (InsightsHome) is in BottomTabs */}
      <RootStack.Screen name={RouteName.Insights} component={InsightsNavigator} options={{ headerShown: false }} />

      {/* SpacesHome is in BottomTabs */}
      <RootStack.Screen name={RouteName.Spaces} component={SpacesNavigator} options={{ headerShown: false }} />

      {/* ChatHome is in BottomTabs */}
      <RootStack.Screen name={RouteName.ChatStack} component={ChatStackNavigator} options={{ headerShown: false }} />

      {/* modal options: https://reactnavigation.org/docs/native-stack-navigator/#presentation */}
      <RootStack.Screen
        name={RouteName.Notifications}
        component={Notifications}
        options={{
          presentation: 'containedModal',
          animation: 'slide_from_bottom',
          headerShown: true,
        }}
      />
      <RootStack.Screen
        name={RouteName.Login}
        component={Login}
        options={{
          presentation: 'containedModal',
          animation: 'slide_from_bottom',
          headerShown: true,
        }}
      />
      <RootStack.Screen
        name={RouteName.ForgotPassword}
        component={ForgotPassword}
        options={{
          presentation: 'containedModal',
          animation: 'slide_from_bottom',
          headerShown: true,
        }}
      />
      <RootStack.Screen
        name={RouteName.DonationsApp}
        component={DonationsAppNavigator}
        options={{
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name={RouteName.GoodNewsApp}
        component={GoodNewsAppNavigator}
        options={{
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name={RouteName.VolunteeringApp}
        component={VolunteeringAppNavigator}
        options={{
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name={RouteName.Onboarding}
        component={Onboarding}
        options={{
          animation: 'slide_from_bottom',
          headerShown: false,
        }}
      />
    </RootStack.Navigator>
  )
}

export default RootNavigator

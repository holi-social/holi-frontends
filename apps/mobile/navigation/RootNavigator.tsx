import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ForgotPassword from '@holi/core/auth/screens/ForgotPassword'
import Login from '@holi/core/auth/screens/Login'
import AppsHub from '@holi/core/screens/appsHub/AppsHub'
import CreatePost from '@holi/core/screens/individualPosts/CreatePost'
import Notifications from '@holi/core/screens/notifications/Notifications'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import VideoCall from '@holi/core/screens/videoCall/VideoCall'
import { VideoCallParams } from '@holi/core/screens/videoCall/VideoCall.shared'
import BottmTabsNavigator from '@holi/mobile/navigation/BottomTabsNavigator'
import ChallengesAppNavigator from '@holi/mobile/navigation/ChallengesAppNavigator'
import ChatStackNavigator from '@holi/mobile/navigation/ChatNavigator'
import DonationsAppNavigator from '@holi/mobile/navigation/DonationsAppNavigator'
import GoodNewsAppNavigator from '@holi/mobile/navigation/GoodNewsAppNavigator'
import InsightsNavigator from '@holi/mobile/navigation/InsightsNavigator'
import SpacesNavigator from '@holi/mobile/navigation/SpacesNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/VolunteeringAppNavigator'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useTheme } from '@holi/ui/styles/theme'

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

  [RouteName.ChallengesApp]: undefined
  [RouteName.DonationsApp]: undefined
  [RouteName.GoodNewsApp]: undefined
  [RouteName.VolunteeringApp]: undefined

  [RouteName.VideoCall]: VideoCallParams

  [RouteName.AppsHub]: undefined

  [RouteName.NotFound]: undefined
  [RouteName.Favorites]: undefined

  [RouteName.CreatePost]: undefined
}

const RootStack = createNativeStackNavigator<RootStackScreens>()

const RootNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme
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

      <RootStack.Screen
        name={RouteName.VideoCall}
        component={VideoCall}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: colors.background10,
          },
        }}
      />

      <RootStack.Screen
        name={RouteName.AppsHub}
        component={AppsHub}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: colors.background10,
          },
        }}
      />
      <RootStack.Screen
        name={RouteName.Notifications}
        component={Notifications}
        options={{
          animation: 'slide_from_bottom',
          headerShown: true,
        }}
      />
      <RootStack.Screen
        name={RouteName.Login}
        component={Login}
        options={{
          animation: 'slide_from_bottom',
          headerShown: true,
          headerTransparent: true,
        }}
      />
      <RootStack.Screen
        name={RouteName.ForgotPassword}
        component={ForgotPassword}
        options={{
          presentation: 'containedModal',
          animation: 'slide_from_bottom',
          headerShown: true,
          headerTransparent: true,
        }}
      />
      <RootStack.Screen
        name={RouteName.ChallengesApp}
        component={ChallengesAppNavigator}
        options={{
          animation: 'slide_from_bottom',
          headerShown: false,
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
      <RootStack.Screen
        name={RouteName.CreatePost}
        component={CreatePost}
        options={{
          animation: 'slide_from_bottom',
          headerShown: true,
          headerTransparent: true,
          headerStyle: {
            backgroundColor: colors.background20,
          },
        }}
      />
    </RootStack.Navigator>
  )
}

export default RootNavigator

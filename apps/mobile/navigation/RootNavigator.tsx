import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ForgotPassword from '@holi/core/auth/screens/ForgotPassword'
import Login from '@holi/core/auth/screens/Login'
import CreatePost from '@holi/core/screens/individualPosts/CreatePost'
import EditPost from '@holi/core/screens/individualPosts/EditPost'
import Notifications from '@holi/core/screens/notifications/Notifications'
import CreateReport from '@holi/core/screens/report/CreateReport'
import CreateSpace from '@holi/core/screens/spaces/create/CreateSpace'
import VideoCall from '@holi/core/screens/videoCall/VideoCall'
import type { VideoCallParams } from '@holi/core/screens/videoCall/VideoCall.shared'
import ActNavigator from '@holi/mobile/navigation/ActNavigator'
import BottomTabsNavigator from '@holi/mobile/navigation/BottomTabsNavigator'
import ChallengesAppNavigator from '@holi/mobile/navigation/ChallengesAppNavigator'
import ChatStackNavigator from '@holi/mobile/navigation/ChatNavigator'
import DonationsAppNavigator from '@holi/mobile/navigation/DonationsAppNavigator'
import FeedPostsNavigator from '@holi/mobile/navigation/FeedPostsNavigator'
import GoodNewsAppNavigator from '@holi/mobile/navigation/GoodNewsAppNavigator'
import InsightsNavigator from '@holi/mobile/navigation/InsightsNavigator'
import SpacesNavigator from '@holi/mobile/navigation/SpacesNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/VolunteeringAppNavigator'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { useTheme } from '@holi/ui/styles/theme'
import LegalDocumentItem from '@holi/core/screens/userprofile/LegalDocumentItem'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { ArrowDownS } from '@holi/icons/src/generated'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'

export type RootStackScreens = {
  [RouteName.BottomTabs]: undefined
  [RouteName.Notifications]: undefined
  [RouteName.Spaces]: undefined
  [RouteName.Insights]: undefined
  [RouteName.ActHome]: undefined
  [RouteName.ChatStack]: undefined

  [RouteName.Onboarding]: undefined
  [RouteName.OnboardingLegalDocuments]: undefined

  [RouteName.Login]: undefined
  [RouteName.ForgotPassword]: undefined

  [RouteName.ChallengesApp]: undefined
  [RouteName.DonationsApp]: undefined
  [RouteName.GoodNewsApp]: undefined
  [RouteName.VolunteeringApp]: undefined

  [RouteName.VideoCall]: VideoCallParams

  [RouteName.NotFound]: undefined
  [RouteName.Favorites]: undefined

  [RouteName.CreatePost]: undefined
  [RouteName.EditPost]: undefined
  [RouteName.FeedPosts]: undefined

  [RouteName.CreateSpace]: undefined
  [RouteName.CreateReport]: undefined
}

const RootStack = createNativeStackNavigator<RootStackScreens>()

const RootNavigator = () => {
  const { theme } = useTheme()
  const { colors } = theme
  return (
    <RootStack.Navigator
      initialRouteName={RouteName.BottomTabs}
      screenOptions={{
        headerShadowVisible: false,
      }}
    >
      <RootStack.Screen name={RouteName.BottomTabs} component={BottomTabsNavigator} options={{ headerShown: false }} />

      {/* HomeFeed (InsightsHome) is in BottomTabs */}
      <RootStack.Screen name={RouteName.Insights} component={InsightsNavigator} options={{ headerShown: false }} />

      {/* SpacesHome is in BottomTabs */}
      <RootStack.Screen
        name={RouteName.Spaces}
        component={SpacesNavigator}
        options={{ headerShown: true, headerShadowVisible: false }}
      />

      {/* ActHome is in BottomTabs */}
      <RootStack.Screen name={RouteName.ActHome} component={ActNavigator} options={{ headerShown: false }} />

      {/* ChatHome is in BottomTabs */}
      <RootStack.Screen name={RouteName.ChatStack} component={ChatStackNavigator} options={{ headerShown: false }} />

      {/* FeedPosts */}
      <RootStack.Screen name={RouteName.FeedPosts} component={FeedPostsNavigator} options={{ headerShown: false }} />
      <RootStack.Screen
        name={RouteName.VideoCall}
        component={VideoCall}
        options={{
          headerShown: true,
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
        name={RouteName.CreateReport}
        component={CreateReport}
        options={{
          animation: 'slide_from_bottom',
          headerShown: true,
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
      {/* Onboarding */}
      <RootStack.Screen
        name={RouteName.Onboarding}
        component={Onboarding}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <RootStack.Screen
        name={RouteName.OnboardingLegalDocuments}
        component={LegalDocumentItem}
        options={{ presentation: 'modal', headerLeft: () => <HeaderBackButton icon={ArrowDownS} /> }}
      />
      <RootStack.Screen
        name={RouteName.CreatePost}
        component={CreatePost}
        options={{
          animation: 'slide_from_bottom',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background20,
          },
        }}
      />
      <RootStack.Screen
        name={RouteName.EditPost}
        component={EditPost}
        options={{
          animation: 'slide_from_bottom',
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background20,
          },
        }}
      />
      <RootStack.Screen
        name={RouteName.CreateSpace}
        component={CreateSpace}
        options={{
          animation: 'slide_from_bottom',
        }}
      />
    </RootStack.Navigator>
  )
}

export default RootNavigator

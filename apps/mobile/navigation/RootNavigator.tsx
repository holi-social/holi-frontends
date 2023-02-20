import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ForgotPassword from '@holi/core/auth/screens/ForgotPassword'
import Login from '@holi/core/auth/screens/Login'
import Registration from '@holi/core/auth/screens/Registration'
import InsightDetailPage, { InsightDetailPageParams } from '@holi/core/screens/insights/InsightDetailPage'
import Notifications from '@holi/core/screens/notifications/Notifications'
import CommentInputPage, { CommentInputPageParams } from '@holi/core/screens/posts/CommentInputPage'
import PostDetailPage, { PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import BottmTabsNavigator from '@holi/mobile/navigation/BottomTabsNavigator'
import DonationsAppNavigator from '@holi/mobile/navigation/DonationsAppNavigator'
import GoodNewsAppNavigator from '@holi/mobile/navigation/GoodNewsAppNavigator'
import SpacesNavigator from '@holi/mobile/navigation/SpacesNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/VolunteeringAppNavigator'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type RootStackScreens = {
  [RouteName.BottomTabs]: undefined
  [RouteName.Notifications]: undefined
  [RouteName.Spaces]: undefined

  [RouteName.InsightDetailPage]: InsightDetailPageParams
  [RouteName.InsightPostDetailPage]: PostDetailPageParams
  [RouteName.InsightPostCommentInputPage]: CommentInputPageParams
  [RouteName.PostDetailPage]: PostDetailPageParams
  [RouteName.PostCommentInputPage]: CommentInputPageParams

  [RouteName.DonationsApp]: undefined
  [RouteName.GoodNewsApp]: undefined
  [RouteName.VolunteeringApp]: undefined

  [RouteName.Login]: undefined
  [RouteName.Registration]: undefined
  [RouteName.ForgotPassword]: undefined
  [RouteName.Search]: undefined
}

const RootStack = createNativeStackNavigator<RootStackScreens>()

const RootNavigator: React.VFC = () => {
  return (
    <RootStack.Navigator
      initialRouteName={RouteName.BottomTabs}
      screenOptions={{
        headerShown: false,
        header: HeaderAnimated,
        headerShadowVisible: false,
      }}
    >
      <RootStack.Screen name={RouteName.BottomTabs} component={BottmTabsNavigator} />
      <RootStack.Screen
        name={RouteName.InsightDetailPage}
        component={InsightDetailPage}
        options={{
          headerShown: true,
        }}
      />
      <RootStack.Screen
        name={RouteName.InsightPostDetailPage}
        component={PostDetailPage}
        options={{
          headerShown: true,
        }}
      />
      <RootStack.Screen
        name={RouteName.PostDetailPage}
        component={PostDetailPage}
        options={{
          headerShown: true,
        }}
      />
      <RootStack.Screen
        name={RouteName.InsightPostCommentInputPage}
        component={CommentInputPage}
        options={{
          headerShown: true,
        }}
      />
      <RootStack.Screen
        name={RouteName.PostCommentInputPage}
        component={CommentInputPage}
        options={{
          headerShown: true,
        }}
      />

      {/* SpacesHome is in BottomTabs */}
      <RootStack.Screen name={RouteName.Spaces} component={SpacesNavigator} />

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
        name={RouteName.Registration}
        component={Registration}
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
    </RootStack.Navigator>
  )
}

export default RootNavigator

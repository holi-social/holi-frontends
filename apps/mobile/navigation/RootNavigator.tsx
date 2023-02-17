import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import ForgotPassword from '@holi/core/auth/screens/ForgotPassword'
import Login from '@holi/core/auth/screens/Login'
import Registration from '@holi/core/auth/screens/Registration'
import LoginProfileButton from '@holi/core/navigation/components/LoginProfileButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import InsightDetailPage, { InsightDetailPageParams } from '@holi/core/screens/insights/InsightDetailPage'
import Notifications from '@holi/core/screens/notifications/Notifications'
import CommentInputPage, { CommentInputPageParams } from '@holi/core/screens/posts/CommentInputPage'
import PostDetailPage, { PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import Spaces from '@holi/core/screens/spaces/Spaces'
import AuthStackNavigator from '@holi/mobile/navigation/AuthNavigator'
import ChatStackNavigator from '@holi/mobile/navigation/ChatNavigator'
import DonationsAppNavigator from '@holi/mobile/navigation/DonationsAppNavigator'
import FeedNavigator from '@holi/mobile/navigation/FeedNavigator'
import GoodNewsAppNavigator from '@holi/mobile/navigation/GoodNewsAppNavigator'
import HeaderAnimated from '@holi/mobile/navigation/HeaderAnimated'
import SpacesNavigator from '@holi/mobile/navigation/SpacesNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/VolunteeringAppNavigator'
import { RouteName } from '@holi/mobile/navigation/routeName'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'

export type RootStackScreens = {
  [RouteName.BottomTabs]: undefined
  [RouteName.Notifications]: undefined

  [RouteName.InsightDetailPage]: InsightDetailPageParams
  [RouteName.InsightPostDetailPage]: PostDetailPageParams
  [RouteName.InsightPostCommentInputPage]: CommentInputPageParams
  [RouteName.PostDetailPage]: PostDetailPageParams
  [RouteName.PostCommentInputPage]: CommentInputPageParams

  [RouteName.Spaces]: undefined

  [RouteName.DonationsApp]: undefined
  [RouteName.GoodNewsApp]: undefined
  [RouteName.VolunteeringApp]: undefined

  [RouteName.Login]: undefined
  [RouteName.Registration]: undefined
  [RouteName.ForgotPassword]: undefined
  [RouteName.Search]: undefined
}

export type BottomTabsScreens = {
  [RouteName.Home]: undefined
  [RouteName.SpacesHome]: undefined
  [RouteName.Chat]: undefined
  [RouteName.Auth]: undefined
}

const RootStack = createNativeStackNavigator<RootStackScreens>()
const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()

export const BottomTabsNavigator: React.VFC = () => {
  const { options } = useUnifiedNavigation()
  const iconColor = (isActive: boolean) => (isActive ? colors.foreground30 : colors.foreground20)
  const { t } = useTranslation()
  const { isLoggedIn } = useAuth()

  return (
    <BottomTabs.Navigator
      initialRouteName={RouteName.Home}
      screenOptions={() => {
        return {
          tabBarStyle: {
            backgroundColor: colors.background10,
            paddingHorizontal: 0,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: colors.foreground20,
            ...(options.navigationCustomOptions?.footerShown === false ? { display: 'none', maxHeight: 0 } : {}),
            tabBarShowLabel: true,
            tabBarLabelStyle: {
              color: 'black',
            },
          },
          tabBarActiveTintColor: colors.foreground30,
          tabBarInactiveTintColor: colors.foreground20,
        }
      }}
    >
      <BottomTabs.Screen
        name={RouteName.Home}
        component={FeedNavigator}
        options={{
          // tabBarLabel: t('navigation.home'),
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="home-smile-2" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
          tabBarTestID: 'btn-to-home-view',
        }}
      />
      <BottomTabs.Screen
        name={RouteName.SpacesHome}
        component={Spaces}
        options={{
          // TODO: FIXME: HeaderAnimated causes too much recursion here
          // header: HeaderAnimated,
          // headerShadowVisible: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="spaces" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
          tabBarTestID: 'btn-to-spaces',
        }}
      />
      <BottomTabs.Screen
        name={RouteName.Chat}
        component={ChatStackNavigator}
        options={{
          tabBarLabel: t('chat.title'),
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="chat-3" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
      <BottomTabs.Screen
        name={RouteName.Auth}
        component={AuthStackNavigator}
        options={{
          tabBarLabel: isLoggedIn ? t('profile.title') : t('auth.login'),
          headerShown: false,
          tabBarIcon: LoginProfileButton,
          tabBarTestID: 'btn-to-profile-view',
        }}
      />
    </BottomTabs.Navigator>
  )
}

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
      <RootStack.Screen name={RouteName.BottomTabs} component={BottomTabsNavigator} />
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

import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from '@holi/core/auth/screens/Login'
import Logout from '@holi/core/auth/screens/Logout'
import Registration from '@holi/core/auth/screens/Registration'
import Explore from '@holi/core/screens/Explore'
import Notifications from '@holi/core/screens/Notifications'
import Search from '@holi/core/screens/Search'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import Post, { PostParams } from '@holi/core/screens/topics/Post'
import Topic, { TopicParams } from '@holi/core/screens/topics/Topic'
import OwnProfile from '@holi/core/screens/userprofile/OwnProfile'
import UserProfile, { UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import ChatStackNavigator from '@holi/mobile/navigation/ChatNavigator'
import DonationsAppNavigator from '@holi/mobile/navigation/DonationsAppNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/VolunteeringAppNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'

import { BackButton, CenterElement, DownButton, LeftElement, RightElement } from './components'

export type HomeStackScreens = {
  HomeFeed: undefined
  Topic: TopicParams
  Post: PostParams
  OwnProfile: undefined
  UserProfile: UserProfileParams
  Notifications: undefined
}

export type BottomTabsScreens = {
  Home: undefined
  Chat: undefined
  Explore: undefined
  Search: undefined
}

export type RootStackScreens = {
  Core: undefined
  DonationsApp: undefined
  VolunteeringApp: undefined
  Login: undefined
  Logout: undefined
  Registration: undefined
}

const HomeStack = createNativeStackNavigator<HomeStackScreens>()
const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()
const RootStack = createNativeStackNavigator<RootStackScreens>()

export const HomeStackNavigator: React.VFC = () => {
  return (
    <HomeStack.Navigator
      initialRouteName="HomeFeed"
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.backgroundColorWhite,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <HomeStack.Screen
        name="HomeFeed"
        component={HomeFeed}
        options={{
          headerBackTitleVisible: true,
          headerBackVisible: true,
          headerTitle: CenterElement,
          headerLeft: LeftElement,
          headerRight: RightElement,
        }}
      />
      <HomeStack.Screen
        name="OwnProfile"
        component={OwnProfile}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: CenterElement,
          headerLeft: BackButton,
          headerRight: RightElement,
        }}
      />
      <HomeStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: CenterElement,
          headerLeft: BackButton,
          headerRight: RightElement,
        }}
      />
      <HomeStack.Screen
        name="Topic"
        component={Topic}
        options={{
          // headerBackTitleVisible: false,
          // headerBackVisible: false,
          // headerTitle: CenterElement,
          headerLeft: BackButton,
          headerTransparent: true,
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: 'transparent',
          },
          presentation: 'fullScreenModal',
        }}
      />
      <HomeStack.Screen
        name="Post"
        component={Post}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: CenterElement,
          headerLeft: BackButton,
        }}
      />
      <HomeStack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerTitle: CenterElement,
          headerLeft: BackButton,
          headerRight: RightElement,
        }}
      />
    </HomeStack.Navigator>
  )
}

export const BottomTabsNavigator: React.VFC = () => {
  const iconColor = (isActive: boolean) => (isActive ? colors.fontColorBlack : colors.fontColorGrey)

  return (
    <BottomTabs.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.backgroundColorWhite,
          paddingHorizontal: 0,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.fontColorGrey,
        },
      }}
    >
      <BottomTabs.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="home-smile-2" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
          tabBarTestID: 'nav-button-home',
        }}
      />
      <BottomTabs.Screen
        name="Chat"
        component={ChatStackNavigator}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="chat-3" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
          headerStyle: {
            borderBottomColor: 'transparent',
          },
        }}
      />
      <BottomTabs.Screen
        name="Explore"
        component={Explore}
        options={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          tabBarShowLabel: false,
          headerTitle: CenterElement,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="loader" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
      <BottomTabs.Screen
        name="Search"
        component={Search}
        options={{
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          tabBarShowLabel: false,
          headerTitle: CenterElement,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="search" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
    </BottomTabs.Navigator>
  )
}

const RootNavigator: React.VFC = () => {
  const { t } = useTranslation()

  return (
    <RootStack.Navigator
      initialRouteName="Core"
      screenOptions={{
        headerShown: false,
      }}
    >
      <RootStack.Screen name="Core" component={BottomTabsNavigator} />
      <RootStack.Screen
        name="DonationsApp"
        component={DonationsAppNavigator}
        options={{
          animation: 'slide_from_bottom',
          headerShown: false,
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerLeft: DownButton,
        }}
      />
      <RootStack.Screen name="VolunteeringApp" component={VolunteeringAppNavigator} />
      {/* modals are only correctly rendered on android when in root navigator */}
      <RootStack.Group
        screenOptions={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerShown: true,
          headerTitleAlign: 'center',
          headerBackVisible: false,
          headerBackTitleVisible: false,
          headerLeft: DownButton,
        }}
      >
        <RootStack.Screen
          name="Login"
          component={Login}
          options={{
            title: t('auth.login'),
            headerLeft: LeftElement,
            headerRight: RightElement,
          }}
        />
        <RootStack.Screen
          name="Logout"
          component={Logout}
          options={{
            title: t('auth.logout'),
            headerLeft: LeftElement,
            headerRight: RightElement,
          }}
        />
        <RootStack.Screen
          name="Registration"
          component={Registration}
          options={{
            title: t('auth.register'),
            headerLeft: LeftElement,
            headerRight: RightElement,
          }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default RootNavigator

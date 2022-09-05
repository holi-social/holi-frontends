import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from '@holi/core/auth/screens/Login'
import Logout from '@holi/core/auth/screens/Logout'
import Registration from '@holi/core/auth/screens/Registration'
import BackButton from '@holi/core/navigation/components/BackButton'
import HeaderLeft from '@holi/core/navigation/components/HeaderLeft'
import HeaderRight from '@holi/core/navigation/components/HeaderRight'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import Explore from '@holi/core/screens/Explore'
import Notifications from '@holi/core/screens/Notifications'
import Search from '@holi/core/screens/Search'
import HomeFeed from '@holi/core/screens/homeFeed/HomeFeed'
import Post, { PostParams } from '@holi/core/screens/topics/Post'
import Topic, { TopicParams } from '@holi/core/screens/topics/Topic'
import OwnProfile from '@holi/core/screens/userprofile/OwnProfile'
import UserProfile, { UserProfileParams } from '@holi/core/screens/userprofile/UserProfile'
import ChatStackNavigator from '@holi/mobile/navigation/ChatNavigator'
import VolunteeringAppNavigator from '@holi/mobile/navigation/VolunteeringAppNavigator'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'

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
  VolunteeringApp: undefined
  Login: undefined
  Logout: undefined
  Registration: undefined
}

const HomeStack = createNativeStackNavigator<HomeStackScreens>()
const BottomTabs = createBottomTabNavigator<BottomTabsScreens>()
const RootStack = createNativeStackNavigator<RootStackScreens>()

const DownButton = () => {
  const { t } = useTranslation()
  return <BackButton label={t('navigation.closeWindow')} icon="arrow-down-s" />
}

export const HomeStackNavigator: React.VFC = () => {
  const { t } = useTranslation()

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
          headerTitle: () => <HeaderTitle style={{ paddingTop: 5 }} />,
          headerLeft: () => <HeaderLeft style={{ paddingHorizontal: 0, marginLeft: 5 }} />,
          headerRight: () => (
            <HeaderRight
              style={{
                paddingHorizontal: 0,
                marginRight: 5,
              }}
            />
          ),
        }}
      />
      <HomeStack.Screen
        name="OwnProfile"
        component={OwnProfile}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: BackButton,
          headerRight: () => (
            <HeaderRight
              style={{
                paddingHorizontal: 0,
                marginRight: 5,
              }}
            />
          ),
          title: t('profile.title'),
        }}
      />
      <HomeStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: BackButton,
          headerRight: () => (
            <HeaderRight
              style={{
                paddingHorizontal: 0,
                marginRight: 5,
              }}
            />
          ),
          title: t('profile.title'),
        }}
      />
      <HomeStack.Screen
        name="Topic"
        component={Topic}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: BackButton,
        }}
      />
      <HomeStack.Screen
        name="Post"
        component={Post}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: BackButton,
        }}
      />
      <HomeStack.Screen
        name="Notifications"
        component={Notifications}
        options={{
          headerBackTitleVisible: false,
          headerBackVisible: false,
          headerLeft: BackButton,
          headerRight: () => (
            <HeaderRight
              style={{
                paddingHorizontal: 0,
                marginRight: 5,
              }}
            />
          ),
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
        }}
      />
      <BottomTabs.Screen
        name="Explore"
        component={Explore}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => {
            return <HoliIcon icon="loader" size={24} filled={focused} style={{ color: iconColor(focused) }} />
          },
        }}
      />
      <BottomTabs.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          tabBarShowLabel: false,
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
          }}
        />
        <RootStack.Screen
          name="Logout"
          component={Logout}
          options={{
            title: t('auth.logout'),
          }}
        />
        <RootStack.Screen
          name="Registration"
          component={Registration}
          options={{
            title: t('auth.register'),
          }}
        />
      </RootStack.Group>
    </RootStack.Navigator>
  )
}

export default RootNavigator

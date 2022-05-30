import React from 'react'
import { SafeAreaView, View } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Login } from '@holi/core/auth/screens/Login'
import { Logout } from '@holi/core/auth/screens/Logout'
import { Registration } from '@holi/core/auth/screens/Registration'
import { ChatHomeScreen } from '@holi/core/chat/ChatHomeScreen'
import { HomeFeedScreen } from '@holi/core/home/HomeFeedScreen'
import { NotificationsScreen } from '@holi/core/notifications/NotificationsScreen'
import { UserProfileScreen } from '@holi/core/profile/UserProfileScreen'
import { SearchScreen } from '@holi/core/search/SearchScreen'
import { TopicEditorsScreen, TopicEditorsScreenParams } from '@holi/core/topics/TopicEditorsScreen'
import { TopicScreenParams, TopicsScreen } from '@holi/core/topics/TopicsScreen'
import { PostScreen, PostScreenParams } from '@holi/core/topics/posts/PostScreen'
import HoliButton from '@holi/ui/components/HoliButton'
import Holicon from '@holi/ui/components/holicon'
import useRouting from '@holi/ui/components/navigation/useRouting'
import theme from '@holi/ui/styles/theme/theme'

import { VolunteeringAppHomeScreen } from '@holi-apps/volunteering/screens/VolunteeringAppHomeScreen'

export type ChatStackScreensList = {
  ChatHome: undefined
}

export type VolunteeringAppScreensList = {
  VolunteeringAppHome: undefined
}

export type CoreStackScreensList = {
  HomeFeed: undefined
  Topic: TopicScreenParams
  Post: PostScreenParams
  UserProfile: undefined
  Notifications: undefined
}

export type BottomTabsScreensList = {
  Home: undefined
  Chat: undefined
  Search: undefined
}

export type RootStackScreensList = {
  // the actual app
  Core: undefined
  // apps from the HOLI store
  VolunteeringApp: undefined
  // all modals
  Login: undefined
  Logout: undefined
  Registration: undefined
  TopicEditorsScreen: TopicEditorsScreenParams
}

const HomeStack = createNativeStackNavigator<CoreStackScreensList>()
const ChatStack = createNativeStackNavigator<ChatStackScreensList>()
const BottomTabs = createBottomTabNavigator<BottomTabsScreensList>()
const VolunteeringAppStack = createNativeStackNavigator<VolunteeringAppScreensList>()
const RootStack = createNativeStackNavigator<RootStackScreensList>()

export const ChatStackNavigator: React.VFC = () => (
  <ChatStack.Navigator
    initialRouteName="ChatHome"
    screenOptions={{
      headerShown: false,
    }}
  >
    <ChatStack.Screen name="ChatHome" component={ChatHomeScreen} />
  </ChatStack.Navigator>
)

export const HomeStackNavigator: React.VFC = () => (
  <HomeStack.Navigator
    initialRouteName="HomeFeed"
    screenOptions={{
      headerShown: true,
    }}
  >
    <HomeStack.Screen
      name="HomeFeed"
      component={HomeFeedScreen}
      options={{
        title: 'Good Morning',
        headerLeft: () => {
          const { navigate } = useRouting()
          return (
            <HoliButton label="Notifications" inline transparent onPress={() => navigate('/notifications')}>
              <Holicon icon="notification" size={20} color={theme.colors.fontColorBlack} />
            </HoliButton>
          )
        },
        headerRight: () => {
          const { navigate } = useRouting()
          return (
            <HoliButton label="Profile" inline transparent onPress={() => navigate('/profile/danbim')}>
              <Holicon icon="person" size={25} color={theme.colors.fontColorBlack} />
            </HoliButton>
          )
        },
      }}
    />
    <HomeStack.Screen
      name="UserProfile"
      component={UserProfileScreen}
      options={{
        title: 'Profile',
        headerBackTitle: '',
      }}
    />
    <HomeStack.Screen
      name="Topic"
      component={TopicsScreen}
      options={{
        title: 'Topic',
        headerBackTitle: '',
      }}
    />
    <HomeStack.Screen
      name="Post"
      component={PostScreen}
      options={{
        title: 'Post',
        headerBackTitle: '',
      }}
    />
    <HomeStack.Screen
      name="Notifications"
      component={NotificationsScreen}
      options={{
        title: 'Notifications',
        headerBackTitle: '',
        animation: 'slide_from_bottom',
      }}
    />
  </HomeStack.Navigator>
)

export const AppNavigation: React.FC = ({ children }) => {
  const { navigate } = useRouting()
  return (
    <SafeAreaView style={{ padding: 10, position: 'absolute', bottom: 10, right: 10 }}>
      <View style={{ flexDirection: 'row', padding: 20 }}>
        <HoliButton label="Home" inline transparent onPress={() => navigate('/')}>
          <Holicon icon="home" size={30} color={theme.colors.fontColorBlack} testID="nav-button-home" />
        </HoliButton>
        <HoliButton label="Search" inline transparent onPress={() => navigate('/search')}>
          <Holicon icon="search" size={30} color={theme.colors.fontColorBlack} />
        </HoliButton>
      </View>
      {children}
    </SafeAreaView>
  )
}

export const VolunteeringAppNavigator: React.VFC = () => (
  <SafeAreaView style={{ padding: 10, height: '100%' }}>
    <VolunteeringAppStack.Navigator initialRouteName="VolunteeringAppHome">
      <VolunteeringAppStack.Screen name="VolunteeringAppHome" component={VolunteeringAppHomeScreen} />
    </VolunteeringAppStack.Navigator>
    <AppNavigation />
  </SafeAreaView>
)

export const BottomTabsNavigator: React.VFC = () => (
  <BottomTabs.Navigator initialRouteName="Home">
    <BottomTabs.Screen
      name="Home"
      options={{
        headerShown: false, // don't show on root level as the content comes with a header
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Holicon icon="home" size={25} color={focused ? theme.colors.fontColorBlack : theme.colors.fontColorGrey} />
          )
        },
      }}
      component={HomeStackNavigator} // chat is complex, probably needs a navigator
    />
    <BottomTabs.Screen
      name="Chat"
      component={ChatStackNavigator} // chat is complex, probably needs a navigator
      options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Holicon
              icon="comment"
              size={25}
              color={focused ? theme.colors.fontColorBlack : theme.colors.fontColorGrey}
            />
          )
        },
      }}
    />
    <BottomTabs.Screen
      name="Search"
      component={SearchScreen} // a simple component should do
      options={{
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <Holicon
              icon="search"
              size={25}
              color={focused ? theme.colors.fontColorBlack : theme.colors.fontColorGrey}
            />
          )
        },
      }}
    />
  </BottomTabs.Navigator>
)

export const RootNavigator: React.VFC = () => (
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
        headerShown: true,
      }}
    >
      <RootStack.Screen name="Login" component={Login} />
      <RootStack.Screen name="Logout" component={Logout} />
      <RootStack.Screen name="Registration" component={Registration} />
      <RootStack.Screen
        name="TopicEditorsScreen"
        component={TopicEditorsScreen}
        options={{
          title: 'Topic Editors',
        }}
      />
    </RootStack.Group>
  </RootStack.Navigator>
)

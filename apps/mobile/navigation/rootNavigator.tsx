import React from 'react'
import { SafeAreaView, View } from 'react-native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Login } from '@holi/core/auth/screens/Login'
import { Logout } from '@holi/core/auth/screens/Logout'
import { ChatHomeScreen } from '@holi/core/chat/ChatHomeScreen'
import { ExploreScreen } from '@holi/core/explore/ExploreScreen'
import { HomeFeedScreen } from '@holi/core/home/HomeFeedScreen'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { NotificationsScreen } from '@holi/core/notifications/NotificationsScreen'
import { UserProfileScreen } from '@holi/core/profile/UserProfileScreen'
import { SearchScreen } from '@holi/core/search/SearchScreen'
import { TopicEditorsScreen, TopicEditorsScreenParams } from '@holi/core/topics/TopicEditorsScreen'
import { TopicScreenParams, TopicsScreen } from '@holi/core/topics/TopicsScreen'
import { PostScreen, PostScreenParams } from '@holi/core/topics/posts/PostScreen'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliIcon from '@holi/ui/components/HoliIcon'
import Holicon from '@holi/ui/components/holicon'
import { useTheme } from '@holi/ui/styles/theme/theme'

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
  Explore: undefined
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
        headerLeft: ({ canGoBack, tintColor }) => {
          const { navigate } = useRouting()
          return (
            <HoliButton
              label="Notifications"
              inline
              transparent
              onPress={() => navigate('/notifications')}
              style={{ paddingHorizontal: 0 }}
            >
              {/* TODO: notification icon */}
              <HoliIcon icon="chat" size={20} />
            </HoliButton>
          )
        },
        headerRight: ({ canGoBack, tintColor }) => {
          const { navigate, pathname } = useRouting()
          // TODO: differs, when logged in
          return (
            <HoliButton label="Profile" inline transparent onPress={() => navigate('/profile/danbim')}>
              <HoliIcon icon="user-circled" size={20} />
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
  const { theme } = useTheme()
  const { navigate } = useRouting()
  return (
    <SafeAreaView style={{ padding: 10, position: 'absolute', bottom: 10, right: 10 }}>
      <View style={{ flexDirection: 'row', padding: 20 }}>
        <HoliButton label="Home" inline transparent onPress={() => navigate('/')} testID="nav-button-home">
          <Holicon icon="home" size={30} color={theme.colors.fontColorBlack} />
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

export const BottomTabsNavigator: React.VFC = () => {
  const { theme } = useTheme()
  return (
    <BottomTabs.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.colors.backgroundColorWhite,
          paddingHorizontal: 5,
          borderTopWidth: 1,
          borderTopColor: theme.colors.backgroundColorWhite,
        },
      }}
    >
      <BottomTabs.Screen
        name="Home"
        options={{
          headerShown: false, // don't show on root level as the content comes with a header
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            return <HoliIcon icon="home" size={20} filled={focused} />
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
            return <HoliIcon icon="chat" size={20} filled={focused} />
          },
        }}
      />
      <BottomTabs.Screen
        name="Explore"
        component={ExploreScreen} // a simple component should do
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            return <HoliIcon icon="explore" size={20} filled={focused} />
          },
        }}
      />
      <BottomTabs.Screen
        name="Search"
        component={SearchScreen} // a simple component should do
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            return <HoliIcon icon="search" size={20} filled={focused} />
          },
        }}
      />
    </BottomTabs.Navigator>
  )
}

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
        animation: 'slide_from_bottom',
        headerShown: true,
      }}
    >
      <RootStack.Screen
        name="Login"
        component={Login}
        options={{
          title: 'Login',
        }}
      />
      <RootStack.Screen
        name="Logout"
        component={Logout}
        options={{
          title: 'Logout',
        }}
      />
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

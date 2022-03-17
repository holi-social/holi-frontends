import React from 'react'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import { AppsHomeScreen } from '../../components/screens/AppsHomeScreen'
import { SettingsScreen } from '../../components/screens/SettingsScreen'

import { CommunityApp } from '../../features/community/app'
import { FeedDetailScreen } from '../../features/community/details'

import { DrawerContent, DrawerHeader } from '../drawer'

const Drawer = createDrawerNavigator()

export type RootStackScreensList = {
  Drawer: undefined
  AppsHome: undefined
  Community: undefined
  CommunityFeedDetail: {
    feedId: string
  }
}

const DrawerNav: React.VoidFunctionComponent<NativeStackScreenProps<RootStackScreensList, 'Drawer'>> = () => {
  const navigation = useNavigation()
  return (
    <Drawer.Navigator
      initialRouteName="AppsHome"
      // We need to build a custom drawer for web anyway, so we can build it in a shared maner and pass it into the Drawer Navigator
      drawerContent={DrawerContent}
      screenOptions={{
        header: () => <DrawerHeader toggleDrawer={() => navigation.dispatch(DrawerActions.toggleDrawer())} />,
      }}
    >
      <Drawer.Screen name="AppsHome" component={AppsHomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  )
}

const RootStack = createNativeStackNavigator<RootStackScreensList>()

export const NativeNavigation: React.ComponentType = () => (
  <RootStack.Navigator
    initialRouteName="Drawer"
    screenOptions={{
      headerShown: false,
    }}
  >
    <RootStack.Screen name="Drawer" component={DrawerNav} />
    <RootStack.Screen
      name="Community"
      component={CommunityApp}
      options={{
        animation: 'slide_from_bottom',
        gestureEnabled: false,
      }}
    />
    <RootStack.Group screenOptions={{ presentation: 'modal', headerShown: true }}>
      {/* mondals are only correctly rendered on android when in root navigator */}
      <RootStack.Screen name="CommunityFeedDetail" component={FeedDetailScreen} />
    </RootStack.Group>
  </RootStack.Navigator>
)

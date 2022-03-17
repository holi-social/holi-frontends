import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { DrawerActions, useNavigation } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { AppsHomeScreen } from '../../components/screens/AppsHomeScreen'
import { CommunityScreen } from '../../components/screens/CommunityScreen'
import { SettingsScreen } from '../../components/screens/SettingsScreen'

import { useTheme } from '../../styles/theme'
import Button from '../../components/ui/Button'
import Holicon from '../../components/ui/holicon'
import { DrawerContent, DrawerHeader } from '../drawer'
import useRouting from '../useRouting'

type CustomHeaderIconProps = {
  onPress: () => void
}

const CustomHeaderIconButton: React.VoidFunctionComponent<CustomHeaderIconProps> = ({ onPress, ...props }) => {
  const { theme } = useTheme()
  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Pressable onPress={onPress} {...props} style={{ marginLeft: 12 }}>
        <Holicon icon="dashboard" size={20} color={theme.colors.text} />
      </Pressable>
    </View>
  )
}

const Drawer = createDrawerNavigator()

type RootStackScreensList = {
  Drawer: undefined
  AppsHome: undefined
  Community: undefined
  CommunityFeedDetail: {
    feedId: string
  }
}

const FeedDetailScreen: React.VoidFunctionComponent<
  NativeStackScreenProps<RootStackScreensList, 'CommunityFeedDetail'>
> = (props) => (
  <View>
    <Text>Detail {props.route.params.feedId}</Text>
    <Button onPress={() => props.navigation.navigate('Community')}>back</Button>
  </View>
)

const BoardScreen: React.VoidFunctionComponent = () => (
  <View>
    <Text>Board</Text>
  </View>
)

const CommunityBottomNav = createBottomTabNavigator()

type CommunityAppProps = NativeStackScreenProps<RootStackScreensList, 'Community'>

const CommunityApp: React.VoidFunctionComponent<CommunityAppProps> = () => {
  const { navigate } = useRouting()
  return (
    <CommunityBottomNav.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerLeft: () => <CustomHeaderIconButton onPress={() => navigate('/')} />,
      }}
    >
      <CommunityBottomNav.Screen
        name="Home"
        options={{
          tabBarBadge: 3,
        }}
        component={CommunityScreen}
      />
      <CommunityBottomNav.Screen name="Board" component={BoardScreen} />
    </CommunityBottomNav.Navigator>
  )
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
      <RootStack.Screen name="CommunityFeedDetail" component={FeedDetailScreen} />
    </RootStack.Group>
  </RootStack.Navigator>
)

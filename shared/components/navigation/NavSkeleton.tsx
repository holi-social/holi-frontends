import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Button from '../ui/Button'
import Holicon from '../ui/holicon'
import { useTheme } from '../../styles/theme'

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
}

type DrawerScreensList = {
  AppsHome: undefined
  Settings: undefined
}

type AppsHomeScreenProps = NativeStackScreenProps<RootStackScreensList, 'AppsHome'>

const AppsHomeScreen: React.VoidFunctionComponent<AppsHomeScreenProps> = ({ navigation }) => {
  return (
    <View>
      <Text style={{ alignSelf: 'center', marginTop: 16 }}>Hallo Anna</Text>
      <Button style={{ margin: 16 }} onPress={() => navigation.navigate('Community')}>
        Community
      </Button>
    </View>
  )
}

const CommunityBottomNav = createBottomTabNavigator()

const CommunityScreen = () => (
  <View>
    <Text>Community Home</Text>
  </View>
)

const BoardScreen: React.VoidFunctionComponent = () => (
  <View>
    <Text>Board</Text>
  </View>
)

type CommunityAppProps = NativeStackScreenProps<RootStackScreensList, 'Community'>

const CommunityApp: React.VoidFunctionComponent<CommunityAppProps> = ({ navigation }) => {
  return (
    <CommunityBottomNav.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        headerLeft: () => <CustomHeaderIconButton onPress={() => navigation.navigate('Drawer')} />,
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

const SettingsScreen: React.VoidFunctionComponent<DrawerScreenProps<DrawerScreensList, 'Settings'>> = () => (
  <View>
    <Text>Settings</Text>
  </View>
)

const DrawerNav: React.VoidFunctionComponent<NativeStackScreenProps<RootStackScreensList, 'Drawer'>> = () => (
  <Drawer.Navigator initialRouteName="AppsHome" screenOptions={{}}>
    <Drawer.Screen name="AppsHome" component={AppsHomeScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
)

const Profile = () => {
  return (
    <Pressable
      style={{ width: 32, height: 32, backgroundColor: 'red', borderRadius: 24, marginRight: 8 }}
      onPress={() => console.log('should toggle drawer')}
    />
  )
}

const RootStack = createNativeStackNavigator<RootStackScreensList>()

export const SkeletonNav: React.ComponentType = () => (
  <RootStack.Navigator
    initialRouteName="AppsHome"
    screenOptions={{
      headerShown: false,
      headerLeft: Profile,
    }}
  >
    <RootStack.Screen name="Drawer" component={DrawerNav} />
    <RootStack.Screen name="Community" component={CommunityApp} />
  </RootStack.Navigator>
)

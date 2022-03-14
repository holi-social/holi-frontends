import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer'
import { DrawerActions, useNavigation } from '@react-navigation/native'
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

type CommunityStackList = {
  Feed: undefined
  Details: {
    feedId: string
  }
}

const CommunityStack = createNativeStackNavigator<CommunityStackList>()

const FeedScreen: React.VoidFunctionComponent<NativeStackScreenProps<CommunityStackList, 'Feed'>> = ({
  navigation,
}) => (
  <View>
    <Text>Feed</Text>
    <Button onPress={() => navigation.navigate('Details', { feedId: 'abc' })}>feed item 1</Button>
    <Button onPress={() => navigation.navigate('Details', { feedId: 'bcd' })}>feed item 2</Button>
    <Button onPress={() => navigation.navigate('Details', { feedId: 'asd' })}>feed item 3</Button>
    <Button onPress={() => navigation.navigate('Details', { feedId: 'flaka' })}>feed item 4</Button>
  </View>
)

const FeedDetailScreen: React.VoidFunctionComponent<NativeStackScreenProps<CommunityStackList, 'Details'>> = (
  props
) => (
  <View>
    <Text>Detail {props.route.params.feedId}</Text>
    <Button onPress={() => props.navigation.navigate('Feed')}>back</Button>
  </View>
)

const CommunityScreen = () => (
  <CommunityStack.Navigator>
    <CommunityStack.Screen name="Feed" options={{ headerShown: false }} component={FeedScreen} />
    <CommunityStack.Screen
      name="Details"
      options={{
        presentation: 'modal',
      }}
      component={FeedDetailScreen}
    />
  </CommunityStack.Navigator>
)

const BoardScreen: React.VoidFunctionComponent = () => (
  <View>
    <Text>Board</Text>
  </View>
)

const CommunityBottomNav = createBottomTabNavigator()

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
  <Drawer.Navigator
    initialRouteName="AppsHome"
    screenOptions={{
      headerLeft: Profile,
    }}
  >
    <Drawer.Screen name="AppsHome" component={AppsHomeScreen} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
)

const Profile = () => {
  const navigation = useNavigation()
  return (
    <Pressable
      style={{ width: 32, height: 32, backgroundColor: 'red', borderRadius: 24, marginLeft: 12 }}
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    />
  )
}

const RootStack = createNativeStackNavigator<RootStackScreensList>()

export const SkeletonNav: React.ComponentType = () => (
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
        presentation: 'fullScreenModal',
        animation: 'slide_from_bottom',
        gestureEnabled: false,
      }}
    />
  </RootStack.Navigator>
)

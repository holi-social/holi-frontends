import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import { createDrawerNavigator, DrawerScreenProps } from '@react-navigation/drawer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import Button from '../ui/Button'
import Holicon from '../ui/holicon'

type CustomHeaderIconProps = {}

// navigates back to AppsHome
const CustomHeaderIcon: React.VoidFunctionComponent<CustomHeaderIconProps> = ({ ...props }) => {
  const nav = useNavigation()

  const currentRouteName = nav.getState().routeNames[nav.getState().index]
  // console.log('🚀 ~ file: NavSkeleton.tsx ~ line 22 ~ currentRouteName', currentRouteName, props)

  // nav.setOptions({
  //   headerShown: currentRouteName === 'Apps',
  // })

  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Pressable onPress={() => nav.goBack()} {...props} style={{ marginLeft: 12 }}>
        <Holicon icon="dashboard" size={20} />
      </Pressable>
    </View>
  )
}

const Drawer = createDrawerNavigator()

type AppsStackScreensList = {
  AppsHome: undefined
  Community: undefined
}

type DrawerScreensList = {
  Apps: undefined
  Settings: undefined
}

const AppsStack = createNativeStackNavigator<AppsStackScreensList>()

type AppsHomeScreenProps = NativeStackScreenProps<AppsStackScreensList, 'AppsHome'>

const AppsHomeScreen: React.VoidFunctionComponent<AppsHomeScreenProps> = ({ navigation }) => {
  React.useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerLeft: () => <Text>hi</Text>,
    })
  }, [])
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

const BoardScreen = () => (
  <View>
    <Text>Board</Text>
  </View>
)

type CommunityAppProps = NativeStackScreenProps<AppsStackScreensList, 'Community'>

const CommunityApp: React.VoidFunctionComponent<CommunityAppProps> = () => {
  return (
    <CommunityBottomNav.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
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
type AppsNavigatorProps = DrawerScreenProps<DrawerScreensList, 'Apps'>

const AppsNavigator: React.VoidFunctionComponent<AppsNavigatorProps> = ({ navigation }) => {
  return (
    <AppsStack.Navigator
      initialRouteName="AppsHome"
      screenOptions={{
        headerShown: true,
        headerLeft: () => {
          return <CustomHeaderIcon />
        },
      }}
    >
      <AppsStack.Screen name="AppsHome" component={AppsHomeScreen} />
      <AppsStack.Screen
        name="Community"
        component={CommunityApp}
        listeners={{
          blur: () =>
            navigation.getParent()?.setOptions({
              headerShown: true,
            }),
          focus: () =>
            navigation.getParent()?.setOptions({
              headerShown: false,
            }),
        }}
        options={{
          animation: 'slide_from_bottom',
          gestureEnabled: false,
        }}
      />
    </AppsStack.Navigator>
  )
}

const SettingsScreen = () => (
  <View>
    <Text>Settings</Text>
  </View>
)

const DrawerNav = () => (
  <Drawer.Navigator initialRouteName="Settings" screenOptions={{}}>
    {/* <Drawer.Screen name="Apps" component={AppsNavigator} /> */}
    <RootStack.Screen name="Home" component={AppsNavigator} />
    <Drawer.Screen name="Settings" component={SettingsScreen} />
  </Drawer.Navigator>
)

const RootStack = createNativeStackNavigator()

export const SkeletonNav: React.ComponentType = () => (
  <RootStack.Navigator
    initialRouteName="Apps"
    screenOptions={{
      headerShown: false,
    }}
  >
    {/* having the drawer here and on top of other components makes it available through other components */}
    {/* I think Drawer and App need to be next to each other. So Community App needs to be in RootStack */}
    <RootStack.Screen name="Drawer" component={DrawerNav} />
    {/* <RootStack.Screen name="Root.AppsNavigator" component={AppsNavigator} /> */}
  </RootStack.Navigator>
)

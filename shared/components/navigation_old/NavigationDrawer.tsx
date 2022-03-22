// import React from 'react'
// import { Text, Pressable, View } from 'react-native'
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
// import type { DrawerContentComponentProps } from '@react-navigation/drawer'

// import FeedSubNavigationStack from './FeedSubNavigationStack'
// import HomeScreen from 'shared/screens/SpaceHome'
// import AppStoreScreen from 'shared/screens/AppStore'
// import ComponentsScreen from 'shared/components/screens/Components'
// import UsersScreen from 'shared/components/screens/Users'

// import { styleVars } from 'shared/styles/globalVars'
// import Holicon from 'shared/components/ui/holicon'

// // see https://reactnavigation.org/docs/typescript/#type-checking-screens
// export type NavigationStackScreensList = {
//   Home: undefined
//   AppStore: undefined
//   Components: undefined
//   Users: undefined
//   Feed: undefined
//   FeedItemDetail: { postId: string }
// }

// const Drawer = createDrawerNavigator()

// type CustomHeaderProps = {
//   navigation: any // eslint-disable-line
//   tintColor?: string
//   pressColor?: string
//   pressOpacity?: number
//   labelVisible?: boolean
// }

// const CustomHeaderIcon: React.VoidFunctionComponent<CustomHeaderProps> = (props) => {
//   const currentRouteName = props.navigation.getState().routeNames[props.navigation.getState().index]

//   return (
//     <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
//       <Pressable onPress={() => props.navigation.toggleDrawer()} {...props} style={{ marginLeft: 13 }}>
//         <Holicon icon="dashboard" size={20} color={styleVars.fontColor} />
//       </Pressable>
//       {currentRouteName !== 'Home' && (
//         // <Pressable onPress={() => props.navigation.navigate('Home')} {...props} style={{marginLeft: 20}} >
//         <Pressable onPress={() => props.navigation.goBack()} {...props} style={{ marginLeft: 20 }}>
//           <Holicon icon="arrow-back" size={30} color={styleVars.fontColor} />
//         </Pressable>
//       )}
//     </View>
//   )
// }

// const CustomDrawerContent: React.VoidFunctionComponent<DrawerContentComponentProps> = (props) => {
//   return (
//     <View style={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
//       <Text
//         style={{
//           fontSize: 20,
//           marginLeft: 13,
//           paddingTop: 50,
//           marginBottom: 20,
//         }}
//       >
//         Some Text above
//       </Text>

//       <DrawerContentScrollView {...props}>
//         {/* <DrawerItemList {...props} /> */}
//         <DrawerItem label="MySpace" onPress={() => props.navigation.navigate('Home')} />
//         <DrawerItem label="Components" onPress={() => props.navigation.navigate('Components')} />
//         <DrawerItem label="Feed" onPress={() => props.navigation.navigate('Feed')} />

//         {/* Add any further menu items */}
//         <DrawerItem label="Click me!" onPress={() => alert('Uuuuuh - an alert!')} />
//       </DrawerContentScrollView>

//       <View style={{ backgroundColor: 'lightblue' }}>
//         <Text
//           style={{
//             fontSize: 20,
//             marginLeft: 13,
//             marginTop: 20,
//             marginBottom: 20,
//           }}
//         >
//           Fixed bottom
//         </Text>
//       </View>
//     </View>
//   )
// }

// const LeftDrawer: React.VoidFunctionComponent = () => {
//   return (
//     <Drawer.Navigator
//       drawerContent={CustomDrawerContent}
//       screenOptions={({ navigation }) => ({
//         drawerStyle: {
//           backgroundColor: styleVars.backgroundColor,
//           width: 240,
//           borderRightColor: styleVars.borderColor,
//           borderRightStyle: 'solid',
//           borderRightWidth: 1,
//         },
//         overlayColor: 'rgba(0,0,0,0.2)',
//         headerTransparent: true,
//         headerTitle: '',
//         headerLeft: (props) => <CustomHeaderIcon {...props} navigation={navigation} />,
//       })}
//     >
//       <Drawer.Screen name="Home" component={HomeScreen} />
//       <Drawer.Screen name="AppStore" component={AppStoreScreen} />
//       <Drawer.Screen name="Components" component={ComponentsScreen} />
//       <Drawer.Screen name="Users" component={UsersScreen} />
//       <Drawer.Screen name="Feed" component={FeedSubNavigationStack} />
//     </Drawer.Navigator>
//   )
// }

// export default LeftDrawer

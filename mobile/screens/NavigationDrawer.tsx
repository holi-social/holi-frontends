import { Text, Pressable, View } from 'react-native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'
import type { DrawerContentComponentProps } from '@react-navigation/drawer'
import HomeScreen from "./Home"
import ComponentsScreen from "./Components"
import UsersScreen from "./Users"
import FeedScreen from "./Feed"
import Holicon from 'shared/components/ui/holicon'



const Drawer = createDrawerNavigator();



function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <View style={{flex: 1, display: 'flex', justifyContent: 'space-between'}}>

      <Text style={{fontSize: 20, marginLeft: 13, paddingTop: 50, marginBottom: 20}}>Some Text above</Text>

      <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#fdfdfd' }}>
        <DrawerItemList {...props} />
        {/* Add any further menu items */}
        <DrawerItem label="Click me!" onPress={() => alert('Uuuuuh - an alert!')} />
      </DrawerContentScrollView>

      <View style={{backgroundColor: 'lightblue'}}>
        <Text style={{fontSize: 20, marginLeft: 13, marginTop: 20, marginBottom: 20}}>Fixed bottom</Text>
      </View>
    </View>
  );
}

type CustomHeaderProps = {
  onPress?: null | (() => any),
  tintColor?: string | undefined;
  pressColor?: string | undefined;
  pressOpacity?: number | undefined;
  labelVisible?: boolean | undefined;
}
function CustomHeaderIcon(props: CustomHeaderProps) {
  return (
    <Pressable {...props} style={{marginLeft: 13}} >
      <Holicon icon="dashboard" size={20} color="#000" />
    </Pressable>
  )
}

export default function LeftDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          backgroundColor: '#fff',
          width: 240,
          borderRightColor: '#efefef',
          borderRightStyle: 'solid',
          borderRightWidth: 1,
        },
        overlayColor: 'rgba(0,0,0,0.7)',
        headerLeft: (props) => (
          <CustomHeaderIcon onPress={() => navigation.toggleDrawer()} {...props} />
        ),
      })}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation }) => ({
          // drawerLabel: Home page, // only menu item text
          title: 'Home page', // this changes menu item and header text
          // is shown in the header, but only when screen is active
          // headerLeft: () => (
          //     <CustomHeaderIcon onPress={() => navigation.toggleDrawer()} />
          // ),
        })}
      />
      <Drawer.Screen name="Component" component={ComponentsScreen} />
      <Drawer.Screen name="User" component={UsersScreen} />
      <Drawer.Screen name="Feed" component={FeedScreen} />
    </Drawer.Navigator>
  );
}
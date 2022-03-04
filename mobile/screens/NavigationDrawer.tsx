import { Text, Pressable, View } from 'react-native'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer'
import type { DrawerContentComponentProps } from '@react-navigation/drawer'
import { useNavigation } from '@react-navigation/native';
import HomeScreen from "./Home"
import ComponentsScreen from "./Components"
import UsersScreen from "./Users"
import FeedScreen from "./Feed"
import Holicon from 'shared/components/ui/holicon'



const Drawer = createDrawerNavigator()



type CustomHeaderProps = {
  navigation: any;
  tintColor?: string | undefined;
  pressColor?: string | undefined;
  pressOpacity?: number | undefined;
  labelVisible?: boolean | undefined;
}
function CustomHeaderIcon(props: CustomHeaderProps) {

  const currentRouteName = props.navigation.getState().routeNames[props.navigation.getState().index]

  return (
    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <Pressable onPress={() => props.navigation.toggleDrawer()} {...props} style={{marginLeft: 13}} >
        <Holicon icon="dashboard" size={20} color="#000" />
      </Pressable>
      { currentRouteName !== 'Home' &&
        <Pressable onPress={() => props.navigation.navigate('Home')} {...props} style={{marginLeft: 20}} >
          <Holicon icon="arrow-back" size={30} color="#000" />
        </Pressable>
      }
    </View>
  )
}

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

export default function LeftDrawer() {

  const navigation = useNavigation()

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
          <CustomHeaderIcon {...props} navigation={navigation} />
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
      <Drawer.Screen name="Components" component={ComponentsScreen} />
      <Drawer.Screen name="Users" component={UsersScreen} />
      <Drawer.Screen name="Feed" component={FeedScreen} />
    </Drawer.Navigator>
  )
}
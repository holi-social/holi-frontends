import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { DrawerContent } from 'shared/features/spaces/navigation/drawer'
import CustomHeaderIcon from 'shared/features/spaces/navigation/customHeaderIcon'
import HomeScreen from 'shared/features/spaces/screens/privateSpace'
import AppStoreScreen from 'shared/features/spaces/screens/appStore'
import { SettingsScreen } from 'shared/features/spaces/screens/settings'

import type { RootStackScreensList } from 'mobile/navigation/rootNavigator'

const SpacesDrawer = createDrawerNavigator()

const SpacesNavigator: React.VoidFunctionComponent<NativeStackScreenProps<RootStackScreensList, 'Spaces'>> = () => {
  const navigation = useNavigation()
  return (
    <SpacesDrawer.Navigator
      initialRouteName="PrivateSpace"
      // We need to build a custom drawer for web anyway, so we can build it in a shared maner and pass it into the Drawer Navigator
      drawerContent={DrawerContent}
      screenOptions={{
        overlayColor: 'rgba(0,0,0,0.2)',
        headerTransparent: true,
        headerTitle: '',
        headerLeft: (props) => <CustomHeaderIcon {...props} navigation={navigation} />,
        // TODO: header should be transparent !!!
        // header: () => <DrawerHeader toggleDrawer={() => navigation.dispatch(DrawerActions.toggleDrawer())} />,
      }}
    >
      <SpacesDrawer.Screen name="PrivateSpace" component={HomeScreen} />
      <SpacesDrawer.Screen name="AppStore" component={AppStoreScreen} />
      <SpacesDrawer.Screen name="Settings" component={SettingsScreen} />
    </SpacesDrawer.Navigator>
  )
}

export default SpacesNavigator

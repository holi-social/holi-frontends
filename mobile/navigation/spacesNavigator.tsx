import React from 'react'
import { useNavigation, DrawerActions } from '@react-navigation/native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'

import { DrawerContent } from 'shared/features/spaces/navigation/drawer'
import { DrawerHeader } from 'shared/features/spaces/navigation/header'
import { PrivateSpaceScreen } from 'shared/features/spaces/screens'
import { AppStoreScreen } from 'shared/features/spaces/screens'
import { SettingsScreen } from 'shared/features/spaces/screens'

import type { RootStackScreensList } from 'mobile/navigation/rootNavigator'

const SpacesDrawer = createDrawerNavigator()

const SpacesNavigator: React.VoidFunctionComponent<NativeStackScreenProps<RootStackScreensList, 'Spaces'>> = () => {
  const navigation = useNavigation()
  return (
    <SpacesDrawer.Navigator
      initialRouteName="PrivateSpace"
      // We need to build a custom drawer for web anyway, so we can build it in a shared maner and pass it into the Drawer Navigator
      drawerContent={() => <DrawerContent closeDrawer={() => navigation.dispatch(DrawerActions.closeDrawer())} />}
      screenOptions={{
        overlayColor: 'rgba(0,0,0,0.2)',
        header: () => <DrawerHeader toggleDrawer={() => navigation.dispatch(DrawerActions.toggleDrawer())} />,
      }}
    >
      <SpacesDrawer.Screen name="PrivateSpace" component={PrivateSpaceScreen} />
      <SpacesDrawer.Screen name="AppStore" component={AppStoreScreen} />
      <SpacesDrawer.Screen name="Settings" component={SettingsScreen} />
    </SpacesDrawer.Navigator>
  )
}

export default SpacesNavigator

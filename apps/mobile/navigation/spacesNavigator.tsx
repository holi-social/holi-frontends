import React from 'react'

import { createDrawerNavigator } from '@react-navigation/drawer'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { NavigationDrawer } from '@holi/core/spaces/components/navigationDrawer'
import { AppStoreScreen } from '@holi/core/spaces/screens/appStore'
import { PrivateSpaceScreen } from '@holi/core/spaces/screens/privateSpace'
import { SettingsScreen } from '@holi/core/spaces/screens/settings'
import type { RootStackScreensList } from '@holi/mobile/navigation/rootNavigator'

const SpacesDrawer = createDrawerNavigator()

const SpacesNavigator: React.VoidFunctionComponent<NativeStackScreenProps<RootStackScreensList, 'Spaces'>> = () => {
  return (
    <SpacesDrawer.Navigator
      initialRouteName="PrivateSpace"
      // We need to build a custom drawer for web anyway, so we can build it in a shared maner and pass it into the Drawer Navigator
      drawerContent={() => <NavigationDrawer />}
      screenOptions={{
        overlayColor: 'rgba(0,0,0,0.2)',
        headerShown: false,
      }}
    >
      <SpacesDrawer.Screen name="PrivateSpace" component={PrivateSpaceScreen} />
      <SpacesDrawer.Screen name="AppStore" component={AppStoreScreen} />
      <SpacesDrawer.Screen name="Settings" component={SettingsScreen} />
    </SpacesDrawer.Navigator>
  )
}

export default SpacesNavigator

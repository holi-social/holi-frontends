import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import AddDigitalTool, { AddDigitalToolParams } from '@holi/core/screens/spaces/AddDigitalTool'
import CreateSpace from '@holi/core/screens/spaces/CreateSpace'
import EditSpace, { EditSpaceParams } from '@holi/core/screens/spaces/EditSpace'
import SpaceCollaboratorArea, { SpaceCollaboratorAreaParams } from '@holi/core/screens/spaces/SpaceCollaboratorArea'
import SpaceDetails, { SpaceDetailsParams } from '@holi/core/screens/spaces/SpaceDetails'
import SpaceStorage, { SpaceStorageParams } from '@holi/core/screens/spaces/SpaceStorage'
import ToolKit, { ToolKitParams } from '@holi/core/screens/spaces/ToolKit'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesScreens = {
  [RouteName.SpaceDetails]: SpaceDetailsParams
  [RouteName.CreateSpace]: undefined
  [RouteName.EditSpace]: EditSpaceParams
  [RouteName.CollaboratorArea]: SpaceCollaboratorAreaParams
  [RouteName.AddDigitalTool]: AddDigitalToolParams
  [RouteName.SpaceStorage]: SpaceStorageParams
  [RouteName.ToolKit]: ToolKitParams
}

const SpacesStack = createNativeStackNavigator<SpacesScreens>()

const SpacesNavigator: React.VFC = () => {
  return (
    <SpacesStack.Navigator
      initialRouteName={RouteName.SpaceDetails}
      screenOptions={{
        header: HeaderAnimated,
        headerShadowVisible: false,
        headerTransparent: true,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background10,
        },
      }}
    >
      <SpacesStack.Screen name={RouteName.SpaceDetails} component={SpaceDetails} />
      <SpacesStack.Screen name={RouteName.CreateSpace} component={CreateSpace} />
      <SpacesStack.Screen name={RouteName.EditSpace} component={EditSpace} />
      <SpacesStack.Screen name={RouteName.CollaboratorArea} component={SpaceCollaboratorArea} />
      <SpacesStack.Screen name={RouteName.AddDigitalTool} component={AddDigitalTool} />
      <SpacesStack.Screen name={RouteName.SpaceStorage} component={SpaceStorage} />
      <SpacesStack.Screen name={RouteName.ToolKit} component={ToolKit} />
    </SpacesStack.Navigator>
  )
}

export default SpacesNavigator

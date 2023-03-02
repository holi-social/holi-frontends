import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import CreateSpace from '@holi/core/screens/spaces/CreateSpace'
import EditSpace, { EditSpaceParams } from '@holi/core/screens/spaces/EditSpace'
import SpaceCloud, { SpaceCloudParams } from '@holi/core/screens/spaces/SpaceCloud'
import SpaceCollaboratorArea, { SpaceCollaboratorAreaParams } from '@holi/core/screens/spaces/SpaceCollaboratorArea'
import SpaceDetails, { SpaceDetailsParams } from '@holi/core/screens/spaces/SpaceDetails'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesScreens = {
  [RouteName.SpaceDetails]: SpaceDetailsParams
  [RouteName.CreateSpace]: undefined
  [RouteName.SpaceCloud]: SpaceCloudParams
  [RouteName.EditSpace]: EditSpaceParams
  [RouteName.CollaboratorArea]: SpaceCollaboratorAreaParams
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
      <SpacesStack.Screen name={RouteName.SpaceCloud} component={SpaceCloud} />
      <SpacesStack.Screen name={RouteName.CollaboratorArea} component={SpaceCollaboratorArea} />
    </SpacesStack.Navigator>
  )
}

export default SpacesNavigator

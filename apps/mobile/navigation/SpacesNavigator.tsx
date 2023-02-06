import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import CreateSpace from '@holi/core/screens/spaces/CreateSpace/CreateSpace'
import EditSpace, { EditSpaceParams } from '@holi/core/screens/spaces/EditSpace'
import FilteredSpaces from '@holi/core/screens/spaces/FilteredSpaces'
import SpaceDetails, { SpaceDetailsParams } from '@holi/core/screens/spaces/SpaceDetails'
import Spaces from '@holi/core/screens/spaces/Spaces'
import HeaderAnimated from '@holi/mobile/navigation/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesStackScreensList = {
  SpacesHome: undefined
  SpaceDetails: SpaceDetailsParams
  FilteredSpaces: undefined
  CreateSpace: undefined
  EditSpace: EditSpaceParams
}

const SpacesStack = createNativeStackNavigator<SpacesStackScreensList>()

const SpacesStackNavigator: React.VFC = () => {
  return (
    <SpacesStack.Navigator
      initialRouteName={RouteName.SpacesHome}
      screenOptions={{
        header: HeaderAnimated,
        headerTransparent: true,
        headerStyle: {
          backgroundColor: colors.backgroundColorWhite,
        },
      }}
    >
      <SpacesStack.Screen name={RouteName.SpacesHome} component={Spaces} />
      <SpacesStack.Screen name={RouteName.SpaceDetails} component={SpaceDetails} />
      <SpacesStack.Screen name={RouteName.FilteredSpaces} component={FilteredSpaces} />
      <SpacesStack.Screen name={RouteName.CreateSpace} component={CreateSpace} />
      <SpacesStack.Screen name={RouteName.EditSpace} component={EditSpace} />
    </SpacesStack.Navigator>
  )
}

export default SpacesStackNavigator

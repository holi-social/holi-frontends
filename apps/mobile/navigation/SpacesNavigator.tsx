import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import CommentInputPage, { CommentInputPageParams } from '@holi/core/screens/posts/CommentInputPage'
import PostDetailPage, { PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import AddDigitalTool, { AddDigitalToolParams } from '@holi/core/screens/spaces/AddDigitalTool'
import CreateSpace from '@holi/core/screens/spaces/CreateSpace'
import CreateTask, { CreateTaskParams } from '@holi/core/screens/spaces/CreateTask'
import CreateUpdate from '@holi/core/screens/spaces/CreateUpdate'
import EditDigitalTool, { EditDigitalToolParams } from '@holi/core/screens/spaces/EditDigitalTool'
import EditSpace, { EditSpaceParams } from '@holi/core/screens/spaces/EditSpace'
import EditTask, { EditTaskParams } from '@holi/core/screens/spaces/EditTask'
import LinkHub, { LinkHubParams } from '@holi/core/screens/spaces/LinkHub'
import SpaceDetails, { SpaceDetailsParams } from '@holi/core/screens/spaces/SpaceDetails'
import SpaceStorage, { SpaceStorageParams } from '@holi/core/screens/spaces/SpaceStorage'
import TaskDetails, { TaskDetailsParams } from '@holi/core/screens/spaces/TaskDetails'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesScreens = {
  [RouteName.SpaceDetails]: SpaceDetailsParams
  [RouteName.CreateSpace]: undefined
  [RouteName.EditSpace]: EditSpaceParams
  [RouteName.AddDigitalTool]: AddDigitalToolParams
  [RouteName.CreateTask]: CreateTaskParams
  [RouteName.EditTask]: EditTaskParams
  [RouteName.TaskDetails]: TaskDetailsParams
  [RouteName.SpaceUpdateDetailPage]: PostDetailPageParams
  [RouteName.SpaceUpdateCommentInputPage]: CommentInputPageParams
  [RouteName.SpaceStorage]: SpaceStorageParams
  [RouteName.LinkHub]: LinkHubParams
  [RouteName.EditDigitalTool]: EditDigitalToolParams
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
      <SpacesStack.Screen name={RouteName.AddDigitalTool} component={AddDigitalTool} />
      <SpacesStack.Screen name={RouteName.SpaceStorage} component={SpaceStorage} />
      <SpacesStack.Screen name={RouteName.LinkHub} component={LinkHub} />
      <SpacesStack.Screen name={RouteName.EditDigitalTool} component={EditDigitalTool} />
      <SpacesStack.Screen name={RouteName.CreateTask} component={CreateTask} />
      <SpacesStack.Screen name={RouteName.EditTask} component={EditTask} />
      <SpacesStack.Screen name={RouteName.TaskDetails} component={TaskDetails} />
      <SpacesStack.Screen name={RouteName.CreateUpdate} component={CreateUpdate} />
      <SpacesStack.Screen name={RouteName.SpaceUpdateDetailPage} component={PostDetailPage} />
      <SpacesStack.Screen name={RouteName.SpaceUpdateCommentInputPage} component={CommentInputPage} />
    </SpacesStack.Navigator>
  )
}

export default SpacesNavigator

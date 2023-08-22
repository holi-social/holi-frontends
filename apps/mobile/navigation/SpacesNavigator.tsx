import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import CommentInputPage, { CommentInputPageParams } from '@holi/core/screens/posts/CommentInputPage'
import PostDetailPage, { PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import SpaceStorage, { SpaceStorageParams } from '@holi/core/screens/spaces/SpaceStorage'
import CreateSpace from '@holi/core/screens/spaces/create/CreateSpace'
import SpaceDetails, { SpaceDetailsParams } from '@holi/core/screens/spaces/details/SpaceDetails'
import SpaceCollaboratorsManage, {
  SpaceCollaboratorsManageParams,
} from '@holi/core/screens/spaces/details/components/SpaceCollaboratorsManage'
import SpaceInvitePage, { SpaceInvitePageParams } from '@holi/core/screens/spaces/details/components/SpaceInvitePage'
import SpaceRolesPermissions, {
  SpaceRolesPermissionsParams,
} from '@holi/core/screens/spaces/details/components/SpaceRolesPermissions'
import EditSpace, { EditSpaceParams } from '@holi/core/screens/spaces/edit/EditSpace'
import EditSpaceCollaborators, {
  EditSpaceCollaboratorsParams,
} from '@holi/core/screens/spaces/edit/components/EditSpaceCollaborators'
import CreateDigitalTool, { CreateDigitalToolParams } from '@holi/core/screens/spaces/linkHub/CreateDigitalTool'
import EditDigitalTool, { EditDigitalToolParams } from '@holi/core/screens/spaces/linkHub/EditDigitalTool'
import LinkHub, { LinkHubParams } from '@holi/core/screens/spaces/linkHub/LinkHub'
import SpaceOnboarding, { SpaceOnboardingParams } from '@holi/core/screens/spaces/onboarding/SpaceOnboarding'
import SpaceOnboardingSteps, {
  SpaceOnboardingStepsParams,
} from '@holi/core/screens/spaces/onboarding/components/SpaceOnboardingSteps'
import CreateTask, { CreateTaskParams } from '@holi/core/screens/spaces/tasks/CreateTask'
import EditTask, { EditTaskParams } from '@holi/core/screens/spaces/tasks/EditTask'
import SpaceTasks, { SpaceTasksParams } from '@holi/core/screens/spaces/tasks/SpaceTasks'
import TaskDetails, { TaskDetailsParams } from '@holi/core/screens/spaces/tasks/TaskDetails'
import CreateSpaceUpdate, { CreateUpdateParams } from '@holi/core/screens/spaces/updates/CreateUpdate'
import SpaceVideoCallList, { SpaceVideoCallListParams } from '@holi/core/screens/spaces/videoCall/SpaceVideoCallList'
import HeaderAnimated from '@holi/mobile/navigation/components/HeaderAnimated'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { colors } from '@holi/ui/styles/globalVars'

export type SpacesScreens = {
  [RouteName.SpaceDetails]: SpaceDetailsParams
  [RouteName.CreateSpace]: undefined
  [RouteName.EditSpace]: EditSpaceParams
  [RouteName.CreateDigitalTool]: CreateDigitalToolParams
  [RouteName.CreateTask]: CreateTaskParams
  [RouteName.EditTask]: EditTaskParams
  [RouteName.TaskDetails]: TaskDetailsParams
  [RouteName.CreateUpdate]: CreateUpdateParams
  [RouteName.EditUpdate]: CreateUpdateParams
  [RouteName.SpaceUpdateDetailPage]: PostDetailPageParams
  [RouteName.SpaceUpdateCommentInputPage]: CommentInputPageParams
  [RouteName.SpaceStorage]: SpaceStorageParams
  [RouteName.SpaceVideoCallList]: SpaceVideoCallListParams
  [RouteName.LinkHub]: LinkHubParams
  [RouteName.EditDigitalTool]: EditDigitalToolParams
  [RouteName.SpaceInvitePage]: SpaceInvitePageParams
  [RouteName.Collaborators]: SpaceCollaboratorsManageParams
  [RouteName.EditCollaborators]: EditSpaceCollaboratorsParams
  [RouteName.SpaceRolesPermissions]: SpaceRolesPermissionsParams
  [RouteName.SpaceOnboarding]: SpaceOnboardingParams
  [RouteName.SpaceOnboardingSteps]: SpaceOnboardingStepsParams
  [RouteName.SpaceTasks]: SpaceTasksParams
}

const SpacesStack = createNativeStackNavigator<SpacesScreens>()

const SpacesNavigator = () => {
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
      <SpacesStack.Screen name={RouteName.CreateDigitalTool} component={CreateDigitalTool} />
      <SpacesStack.Screen name={RouteName.SpaceStorage} component={SpaceStorage} />
      <SpacesStack.Screen name={RouteName.SpaceVideoCallList} component={SpaceVideoCallList} />
      <SpacesStack.Screen name={RouteName.LinkHub} component={LinkHub} />
      <SpacesStack.Screen name={RouteName.EditDigitalTool} component={EditDigitalTool} />
      <SpacesStack.Screen name={RouteName.CreateTask} component={CreateTask} />
      <SpacesStack.Screen name={RouteName.EditTask} component={EditTask} />
      <SpacesStack.Screen name={RouteName.TaskDetails} component={TaskDetails} />
      <SpacesStack.Screen name={RouteName.CreateUpdate} component={CreateSpaceUpdate} />
      <SpacesStack.Screen name={RouteName.EditUpdate} component={CreateSpaceUpdate} />
      <SpacesStack.Screen name={RouteName.SpaceUpdateDetailPage} component={PostDetailPage} />
      <SpacesStack.Screen name={RouteName.SpaceUpdateCommentInputPage} component={CommentInputPage} />
      <SpacesStack.Screen name={RouteName.SpaceInvitePage} component={SpaceInvitePage} />
      <SpacesStack.Screen name={RouteName.Collaborators} component={SpaceCollaboratorsManage} />
      <SpacesStack.Screen name={RouteName.EditCollaborators} component={EditSpaceCollaborators} />
      <SpacesStack.Screen name={RouteName.SpaceRolesPermissions} component={SpaceRolesPermissions} />
      <SpacesStack.Screen name={RouteName.SpaceOnboarding} component={SpaceOnboarding} />
      <SpacesStack.Screen name={RouteName.SpaceOnboardingSteps} component={SpaceOnboardingSteps} />
      <SpacesStack.Screen name={RouteName.SpaceTasks} component={SpaceTasks} />
    </SpacesStack.Navigator>
  )
}

export default SpacesNavigator

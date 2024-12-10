import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

import CommentInputPage, { type CommentInputPageParams } from '@holi/core/screens/posts/CommentInputPage'
import PostDetailPage, { type PostDetailPageParams } from '@holi/core/screens/posts/PostDetailPage'
import SpaceStorage, { type SpaceStorageParams } from '@holi/core/screens/spaces/SpaceStorage'
import AboutSpaces from '@holi/core/screens/spaces/about/AboutSpaces'
import AppointmentDetails, {
  type AppointmentDetailsParams,
} from '@holi/core/screens/spaces/appointments/AppointmentDetails'
import CreateAppointment, {
  type CreateAppointmentParams,
} from '@holi/core/screens/spaces/appointments/CreateAppointment'
import EditAppointment, { type EditAppointmentParams } from '@holi/core/screens/spaces/appointments/EditAppointment'
import SpaceAppointments, {
  type SpaceAppointmentsParams,
} from '@holi/core/screens/spaces/appointments/SpaceAppointments'
import CreateSpace from '@holi/core/screens/spaces/create/CreateSpace'
import SpaceDetails, { type SpaceDetailsParams } from '@holi/core/screens/spaces/details/SpaceDetails'
import SpaceCollaboratorsManage, {
  type SpaceCollaboratorsManageParams,
} from '@holi/core/screens/spaces/details/components/SpaceCollaboratorsManage'
import SpaceInvitePage, {
  type SpaceInviteViewParams,
} from '@holi/core/screens/spaces/details/components/SpaceInvitePage'
import SpaceRolesPermissions, {
  type SpaceRolesPermissionsParams,
} from '@holi/core/screens/spaces/details/components/SpaceRolesPermissions'
import EditSpace, { type EditSpaceParams } from '@holi/core/screens/spaces/edit/EditSpace'
import EditSpaceCollaborators, {
  type EditSpaceCollaboratorsParams,
} from '@holi/core/screens/spaces/edit/components/EditSpaceCollaborators'
import CreateDigitalTool, { type CreateDigitalToolParams } from '@holi/core/screens/spaces/linkHub/CreateDigitalTool'
import EditDigitalTool, { type EditDigitalToolParams } from '@holi/core/screens/spaces/linkHub/EditDigitalTool'
import LinkHub, { type LinkHubParams } from '@holi/core/screens/spaces/linkHub/LinkHub'
import SpaceOnboarding, { type SpaceOnboardingParams } from '@holi/core/screens/spaces/onboarding/SpaceOnboarding'
import SpaceOnboardingSteps, {
  type SpaceOnboardingStepsParams,
} from '@holi/core/screens/spaces/onboarding/components/SpaceOnboardingSteps'
import RelatedSpaces, { type SpaceRelatedSpacesParams } from '@holi/core/screens/spaces/relatedSpaces/RelatedSpaces'
import CreateTask, { type CreateTaskParams } from '@holi/core/screens/spaces/tasks/CreateTask'
import EditTask, { type EditTaskParams } from '@holi/core/screens/spaces/tasks/EditTask'
import SpaceTasks, { type SpaceTasksParams } from '@holi/core/screens/spaces/tasks/SpaceTasks'
import TaskDetails, { type TaskDetailsParams } from '@holi/core/screens/spaces/tasks/TaskDetails'
import CreateSpaceUpdate, { type CreateUpdateParams } from '@holi/core/screens/spaces/updates/CreateUpdate'
import SpaceVideoCallList, {
  type SpaceVideoCallListParams,
} from '@holi/core/screens/spaces/videoCall/SpaceVideoCallList'
import { RouteName } from '@holi/mobile/navigation/routeName'

export type SpacesScreens = {
  [RouteName.SpaceDetails]: SpaceDetailsParams
  [RouteName.SpaceRelatedSpaces]: SpaceRelatedSpacesParams
  [RouteName.CreateSpace]: undefined
  [RouteName.EditSpace]: EditSpaceParams
  [RouteName.CreateDigitalTool]: CreateDigitalToolParams
  [RouteName.CreateTask]: CreateTaskParams
  [RouteName.EditTask]: EditTaskParams
  [RouteName.TaskDetails]: TaskDetailsParams
  [RouteName.CreateTaskDE]: CreateTaskParams
  [RouteName.EditTaskDE]: EditTaskParams
  [RouteName.TaskDetailsDE]: TaskDetailsParams
  [RouteName.CreateUpdate]: CreateUpdateParams
  [RouteName.EditUpdate]: CreateUpdateParams
  [RouteName.SpaceUpdateDetailPage]: PostDetailPageParams
  [RouteName.SpaceUpdateCommentInputPage]: CommentInputPageParams
  [RouteName.SpaceStorage]: SpaceStorageParams
  [RouteName.SpaceVideoCallList]: SpaceVideoCallListParams
  [RouteName.LinkHub]: LinkHubParams
  [RouteName.EditDigitalTool]: EditDigitalToolParams
  [RouteName.SpaceInvitePage]: SpaceInviteViewParams
  [RouteName.Collaborators]: SpaceCollaboratorsManageParams
  [RouteName.EditCollaborators]: EditSpaceCollaboratorsParams
  [RouteName.SpaceRolesPermissions]: SpaceRolesPermissionsParams
  [RouteName.SpaceOnboarding]: SpaceOnboardingParams
  [RouteName.SpaceOnboardingSteps]: SpaceOnboardingStepsParams
  [RouteName.SpaceTasks]: SpaceTasksParams
  [RouteName.SpaceTasksDE]: SpaceTasksParams
  [RouteName.AboutSpaces]: undefined
  [RouteName.SpaceAppointments]: SpaceAppointmentsParams
  [RouteName.CreateAppointment]: CreateAppointmentParams
  [RouteName.EditAppointment]: EditAppointmentParams
  [RouteName.AppointmentDetails]: AppointmentDetailsParams
}

const SpacesStack = createNativeStackNavigator<SpacesScreens>()

const SpacesNavigator = () => {
  return (
    <SpacesStack.Navigator
      initialRouteName={RouteName.SpaceDetails}
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
      }}
    >
      <SpacesStack.Screen name={RouteName.SpaceDetails} component={SpaceDetails} />
      <SpacesStack.Screen name={RouteName.SpaceRelatedSpaces} component={RelatedSpaces} />
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
      <SpacesStack.Screen name={RouteName.CreateTaskDE} component={CreateTask} />
      <SpacesStack.Screen name={RouteName.EditTaskDE} component={EditTask} />
      <SpacesStack.Screen name={RouteName.TaskDetailsDE} component={TaskDetails} />
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
      <SpacesStack.Screen name={RouteName.SpaceTasksDE} component={SpaceTasks} />
      <SpacesStack.Screen name={RouteName.AboutSpaces} component={AboutSpaces} />
      <SpacesStack.Screen name={RouteName.SpaceAppointments} component={SpaceAppointments} />
      <SpacesStack.Screen name={RouteName.CreateAppointment} component={CreateAppointment} />
      <SpacesStack.Screen name={RouteName.EditAppointment} component={EditAppointment} />
      <SpacesStack.Screen name={RouteName.AppointmentDetails} component={AppointmentDetails} />
    </SpacesStack.Navigator>
  )
}

export default SpacesNavigator

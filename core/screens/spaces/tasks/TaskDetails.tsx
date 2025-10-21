import React, { memo, useCallback } from 'react'
import { Platform } from 'react-native'
import { Screen } from '@holi/core/components/Screen'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { TaskDrawer } from '@holi/core/screens/spaces/tasks/components/TaskDrawer'
import { TaskDetailsCTA } from '@holi/core/screens/spaces/tasks/components/TaskDetailsCTA'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'
import { TaskProgressCard } from '@holi/core/screens/spaces/tasks/components/TaskProgressCard'
import { VolunteeringSimilarRecos } from '@holi-apps/volunteering/components/VolunteeringSimilarRecos'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { white } from 'holi-bricks/foundations'

import {
  useUpdateVolunteeringOpportunityStatusMutation,
  useVolunteeringOpportunityStatusQuery,
  VolunteeringOpportunityStatusValue,
} from '@holi/api/graphql/graphql-codegen'

import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import { useSpaceAdminUsers } from '@holi/core/screens/spaces/hooks/useSpaceAdminUsers'
import { useLoginState } from '@holi/core/auth/loginState'
import { useStartChat } from '@holi/core/screens/spaces/hooks/useStartChat'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { getPlaceholderImage } from 'holi-bricks/components/image/helpers'
import { TrackingEvent } from '@holi/core/tracking/events'
import useTrackOnce from '@holi/core/tracking/hooks/useTrackOnce'

const isIos = Platform.OS === 'ios'

export type TaskDetailsParams = {
  taskId: string
}

const TaskDetails = () => {
  const { data, isOwner, spaceName, id, refetch, spaceId, spaceTitle, interactionType, taskDuration, taskRegularity } =
    useTaskDetailsData()

  const loginState = useLoginState()
  const { adminUsers } = useSpaceAdminUsers(spaceName)
  const [rewardsPhaseTwoEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_2)
  const chatRoomContent = {
    taskName: data?.title,
    taskId: id || '',
    spaceName: spaceTitle || '',
    holiSpaceId: spaceId || '',
  }
  const { startChat, isLoading } = useStartChat(chatRoomContent, adminUsers || [])
  const displayCta = useFeatureFlag(FeatureFlagKey.TASK_CONTACT_CTA)

  // Task status management
  const [updateVolunteeringOpportunityStatus] = useUpdateVolunteeringOpportunityStatusMutation()
  const { refetch: refetchStatus, data: statusData } = useVolunteeringOpportunityStatusQuery({
    variables: { volunteeringOpportunityId: id || '' },
    skip: !loginState.isLoggedIn,
  })
  const taskStatus = statusData?.volunteeringOpportunityStatus

  const onVolunteeringStatusChange = async (status: VolunteeringOpportunityStatusValue) => {
    if (!id) return
    await updateVolunteeringOpportunityStatus({
      variables: { volunteeringOpportunityId: id, newStatus: status },
    })
    await refetchStatus()
  }

  // Render top-right task drawer (edit/settings)
  const renderActionDrawer = useCallback(
    (tintColor?: string) =>
      id && (
        <HoliTransition.FadeRight visible>
          <TaskDrawer tintColor={tintColor} isOwner={isOwner} spaceName={spaceName} taskId={id} />
        </HoliTransition.FadeRight>
      ),
    [id, isOwner, spaceName]
  )

  const taskProps = {
    taskId: id ?? '',
    taskName: data?.title,
    regularity: taskRegularity,
    duration: taskDuration,
    interactionType,
  }

  useTrackOnce(id ? TrackingEvent.Task.detailPage.visited(taskProps) : undefined)

  return (
    <Screen
      onRefresh={refetch}
      preset="auto"
      headerOptions={{
        animation: 'slide_from_left',
        headerBackVisible: false,
        headerTitleAlign: 'center',
        ...Platform.select({
          native: {
            headerTintColor: white,
            title: '',
            headerTransparent: true,
          },
        }),
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        headerRight: ({ tintColor }) => renderActionDrawer(tintColor),
        navigationCustomOptions: { footerShown: false },
      }}
      statusBarProps={{ translucent: true, barStyle: isIos ? 'light-content' : 'dark-content', animated: true }}
      StickyBottomComponent={
        displayCta && (
          <TaskDetailsCTA
            spaceIdOrName={spaceName}
            isFavorite={data?.isFavorite}
            refetchFavorite={refetch}
            isLoading={isLoading}
            onModalDismiss={() => {
              if (!rewardsPhaseTwoEnabled) return
              // Update status to "TO_DO" only once when initially the status is null
              if (taskStatus === null) onVolunteeringStatusChange(VolunteeringOpportunityStatusValue.ToDo)
            }}
            startChat={startChat}
            status={taskStatus?.status}
          />
        )
      }
    >
      <DetailsScreen
        {...data}
        _footer={<VolunteeringSimilarRecos documentId={`task_${id}`} />}
        placeholderImage={id ? getPlaceholderImage(`task_${id}`) : undefined}
        progressCard={
          rewardsPhaseTwoEnabled &&
          !!taskStatus?.status &&
          [
            VolunteeringOpportunityStatusValue.ToDo,
            VolunteeringOpportunityStatusValue.Contacted,
            VolunteeringOpportunityStatusValue.Doing,
          ].includes(taskStatus.status) ? (
            <HoliTransition.FadeDown visible>
              <TaskProgressCard
                status={taskStatus.status}
                onStatusChange={onVolunteeringStatusChange}
                startChat={startChat}
                taskProps={taskProps}
              />
            </HoliTransition.FadeDown>
          ) : null
        }
      />
    </Screen>
  )
}

export default memo(TaskDetails)

import React, { memo, useCallback } from 'react'
import { Screen } from '@holi/core/components/Screen'

import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { TaskDrawer } from '@holi/core/screens/spaces/tasks/components/TaskDrawer'
import { Platform } from 'react-native'
import { white } from 'holi-bricks/foundations'
import { TaskDetailsCTA } from '@holi/core/screens/spaces/tasks/components/TaskDetailsCTA'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'
import { VolunteeringSimilarRecos } from '@holi-apps/volunteering/components/VolunteeringSimilarRecos'
import { TrackingEvent } from '@holi/core/tracking/events'
import useTrackOnce from '@holi/core/tracking/hooks/useTrackOnce'
import { getPlaceholderImage } from 'holi-bricks/components/image/helpers'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import {
  useUpdateVolunteeringOpportunityStatusMutation,
  useVolunteeringOpportunityStatusQuery,
  VolunteeringOpportunityStatusValue,
} from '@holi/api/graphql/graphql-codegen'
import { TaskProgressCard } from '@holi/core/screens/spaces/tasks/components/TaskProgressCard'
import { useSpaceAdminUsers } from '@holi/core/screens/spaces/hooks/useSpaceAdminUsers'
import { useLoginState } from '@holi/core/auth/loginState'
import { useStartChat } from '@holi/core/screens/spaces/hooks/useStartChat'

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

  const [updateVolunteeringOpportunityStatus] = useUpdateVolunteeringOpportunityStatusMutation()
  const { refetch: refetchStatus, data: statusData } = useVolunteeringOpportunityStatusQuery({
    variables: {
      volunteeringOpportunityId: id || '',
    },
    skip: !loginState.isLoggedIn,
  })
  const taskStatus = statusData?.volunteeringOpportunityStatus
  // const externalId = statusData?.volunteeringOpportunityStatus?.externalVolunteeringOpportunityId
  // console.log('statusData', statusData)

  const onVolunteeringStatusChange = async (status: VolunteeringOpportunityStatusValue) => {
    await updateVolunteeringOpportunityStatus({
      variables: {
        volunteeringOpportunityId: id!,
        newStatus: status,
      },
    })
    await refetchStatus()
    // console.log('refetchStatus', status)
  }

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
    <>
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
          navigationCustomOptions: {
            footerShown: false,
          },
        }}
        statusBarProps={{ translucent: true, barStyle: isIos ? 'light-content' : 'dark-content', animated: true }}
        StickyBottomComponent={
          <TaskDetailsCTA
            spaceIdOrName={spaceName}
            taskId={id}
            interactionType={interactionType}
            isFavorite={data?.isFavorite}
            refetchFavorite={refetch}
            isLoading={isLoading}
            onModalDismiss={() => {
              if (!rewardsPhaseTwoEnabled) return
              // Update status to "TO_DO" only once when initially the status is null
              if (taskStatus === null) onVolunteeringStatusChange(VolunteeringOpportunityStatusValue.ToDo)
            }}
            startChat={startChat}
          />
        }
      >
        <DetailsScreen
          {...data}
          _footer={<VolunteeringSimilarRecos documentId={`task_${id}`} />}
          placeholderImage={id ? getPlaceholderImage(`task_${id}`) : undefined}
          progressCard={
            rewardsPhaseTwoEnabled ? (
              <HoliTransition.FadeDown
                visible={
                  !!taskStatus?.status &&
                  [
                    VolunteeringOpportunityStatusValue.ToDo,
                    VolunteeringOpportunityStatusValue.Contacted,
                    VolunteeringOpportunityStatusValue.Doing,
                  ].includes(taskStatus.status)
                }
              >
                <TaskProgressCard
                  status={taskStatus?.status}
                  onStatusChange={onVolunteeringStatusChange}
                  startChat={startChat}
                />
              </HoliTransition.FadeDown>
            ) : null
          }
        />
      </Screen>
    </>
  )
}

export default memo(TaskDetails)

import React, { memo, useCallback } from 'react'
import { Screen } from '@holi/core/components/Screen'

import { Stack } from 'holi-bricks/components/stack'
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

const isIos = Platform.OS === 'ios'

export type TaskDetailsParams = {
  taskId: string
}

const TaskDetailsContainer = () => {
  const {
    data,
    isOwner,
    spaceName,
    id,
    refetch,
    spaceId,
    spaceTitle,
    interactionSignupLink,
    interactionType,
    taskDuration,
    taskRegularity,
  } = useTaskDetailsData()
  const displayCta = useFeatureFlag(FeatureFlagKey.TASK_CONTACT_CTA)

  const renderActionDrawer = useCallback(
    (tintColor?: string) => <TaskDrawer tintColor={tintColor} isOwner={isOwner} spaceName={spaceName} taskId={id} />,
    [id, isOwner, spaceName]
  )

  useTrackOnce(
    id
      ? TrackingEvent.Task.detailPage.visited({
          taskId: id,
          taskName: data?.title,
          regularity: taskRegularity,
          duration: taskDuration,
        })
      : undefined
  )

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
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      statusBarProps={{ translucent: true, barStyle: isIos ? 'light-content' : 'dark-content', animated: true }}
      StickyBottomComponent={
        <Stack
          padding={{ left: 'md', right: 'md', bottom: 'lg' }}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="100%"
        >
          {displayCta && (
            <TaskDetailsCTA
              spaceIdOrName={spaceName}
              taskName={data?.title}
              taskId={id}
              spaceTitle={spaceTitle}
              spaceId={spaceId}
              interactionType={interactionType}
              interactionSignupLink={interactionSignupLink}
              taskDuration={taskDuration}
              taskRegularity={taskRegularity}
            />
          )}
        </Stack>
      }
    >
      <DetailsScreen
        {...data}
        _footer={<VolunteeringSimilarRecos documentId={`task_${id}`} />}
        placeholderImage={id ? getPlaceholderImage(`task_${id}`) : undefined}
      />
    </Screen>
  )
}

export default memo(TaskDetailsContainer)

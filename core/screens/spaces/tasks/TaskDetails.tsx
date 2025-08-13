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
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { FavoritableType } from '@holi/api/graphql/graphql-codegen'
import { SaveForLaterButton } from '@holi/core/components/SaveForLaterButton'
import { useErrorHandling } from '@holi/core/errors/hooks'

export type TaskDetailsParams = {
  taskId: string
}

const TaskDetails = () => {
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
  const { displayError } = useErrorHandling()

  const renderActionDrawer = useCallback(
    (tintColor?: string) =>
      id && (
        <HoliTransition.FadeRight visible>
          <TaskDrawer tintColor={tintColor} isOwner={isOwner} spaceName={spaceName} taskId={id} />
        </HoliTransition.FadeRight>
      ),
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
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} shadow="dark" />,
        headerRight: ({ tintColor }) => renderActionDrawer(tintColor),
        navigationCustomOptions: {
          footerShown: false,
        },
        statusBarStyle: 'light',
      }}
      StickyBottomComponent={
        <Stack
          padding={{ left: 'md', right: 'md', bottom: 'lg' }}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="100%"
          gap="xxs"
        >
          {displayCta && (
            <Stack width="100%">
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
            </Stack>
          )}
          {id && (
            <SaveForLaterButton
              favoritableType={FavoritableType.Task}
              favoritableId={id}
              __typename={'Task'}
              isFavorite={data?.isFavorite}
              onError={(error: Error) =>
                displayError(
                  error,
                  data?.isFavorite ? 'Failed to add the task to favorites' : 'Failed to remove the task from favorites',
                  {
                    location: 'TaskDetails.saveForLaterTask',
                    favoritableId: id,
                  }
                )
              }
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

export default memo(TaskDetails)

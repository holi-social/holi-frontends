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
import { Button } from 'holi-bricks/components/button'
import { useTranslation } from 'react-i18next'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { DoItLaterModal, DoItLater } from '@holi/core/screens/spaces/tasks/DoItLater'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'

const isIos = Platform.OS === 'ios'

export type TaskDetailsParams = {
  taskId: string
}

const TaskDetails = () => {
  const { props: doItLaterModalProps, show: showDoItLater } = useModalState()
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()

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
    isGoodDeed,
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
            {id &&
              (isGoodDeed && !isLoggedIn ? (
                <Button label={t('volunteering.progress.button.favorites.toSave')} onPress={showDoItLater} />
              ) : (
                <SaveForLaterButton
                  favoritableType={FavoritableType.Task}
                  favoritableId={id}
                  __typename={'Task'}
                  isFavorite={data?.isFavorite}
                  onError={(error: Error) =>
                    displayError(
                      error,
                      data?.isFavorite
                        ? 'Failed to add the task to favorites'
                        : 'Failed to remove the task from favorites',
                      {
                        location: 'TaskDetails.saveForLaterTask',
                        favoritableId: id,
                      }
                    )
                  }
                />
              ))}
          </Stack>
        }
      >
        <DetailsScreen
          {...data}
          _footer={<VolunteeringSimilarRecos documentId={`task_${id}`} />}
          placeholderImage={id ? getPlaceholderImage(`task_${id}`) : undefined}
        />
      </Screen>
      <DoItLaterModal {...doItLaterModalProps}>
        <DoItLater title={data.title} imageSrc={data.coverImage?.uri} />
      </DoItLaterModal>
    </>
  )
}

export default memo(TaskDetails)

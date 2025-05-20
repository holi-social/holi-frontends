import React, { memo, useCallback } from 'react'
import { Screen } from '@holi/core/components/Screen'

import { Stack } from 'holi-bricks/components/stack'
import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { TaskDrawer } from '@holi/core/screens/spaces/tasks/components/TaskDrawer'
import { Platform } from 'react-native'
import { white } from 'holi-bricks/foundations'
import { ContactOrganization } from '@holi/core/screens/spaces/tasks/components/ContactOrganization'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'
import { VolunteeringSimilarRecosTypesense } from '@holi-apps/volunteering/components/VolunteeringSimilarRecosTypesense'
import { useTranslation } from 'react-i18next'
import { TrackingEvent } from '@holi/core/tracking/events'
import useTrackOnce from '@holi/core/tracking/hooks/useTrackOnce'

const isIos = Platform.OS === 'ios'

export type TaskDetailsParams = {
  taskId: string
}

const TaskDetailsContainer = () => {
  const { t } = useTranslation()
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
  const [useTypesense] = useFeatureFlag(FeatureFlagKey.TYPESENSE_RECOS)

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
      statusBarProps={{ translucent: true, barStyle: isIos ? 'light-content' : 'dark-content' }}
      StickyBottomComponent={
        <Stack
          padding={{ left: 'md', right: 'md', bottom: 'lg' }}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
          width="100%"
        >
          {displayCta && (
            <ContactOrganization
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
        descriptionTitle={t('spaces.tasks.description.title')}
        _footer={useTypesense && <VolunteeringSimilarRecosTypesense documentId={`task_${id}`} />}
      />
    </Screen>
  )
}

export default memo(TaskDetailsContainer)

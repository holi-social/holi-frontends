import React, { memo, useCallback } from 'react'
import { Screen } from '@holi/core/components/Screen'

import { Stack } from 'holi-bricks/components/stack'
import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { TaskDrawer } from '@holi/core/screens/spaces/tasks/components/TaskDrawer'
import { Platform } from 'react-native'
import { white } from 'holi-bricks/tokens'
import { ContactOrganization } from '@holi/core/screens/spaces/tasks/components/ContactOrganization'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'

const isIos = Platform.OS === 'ios'

export type TaskDetailsParams = {
  taskId: string
}

const TaskDetailsContainer = () => {
  const { data, isOwner, spaceName, id, refetch, spaceId, spaceTitle } = useTaskDetailsData()
  const displayCta = useFeatureFlag(FeatureFlagKey.TASK_CONTACT_CTA)

  const renderActionDrawer = useCallback(
    (tintColor?: string) => <TaskDrawer tintColor={tintColor} isOwner={isOwner} spaceName={spaceName} taskId={id} />,
    [id, isOwner, spaceName]
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
            />
          )}
        </Stack>
      }
    >
      <DetailsScreen {...data} />
    </Screen>
  )
}

export default memo(TaskDetailsContainer)

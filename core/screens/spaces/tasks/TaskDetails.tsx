import React, { memo, useCallback } from 'react'
import { Screen } from '@holi/core/components/Screen'

import { Stack } from 'holi-bricks/components/stack'
import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData/useTaskDetailsData'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { TaskDrawer } from '@holi/core/screens/spaces/tasks/components/TaskDrawer'
import { Platform, StyleSheet, View } from 'react-native'
import { BorderRadius, Spacing, white } from 'holi-bricks/foundations'
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
import { useTranslation } from 'react-i18next'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { DoItLaterModal, DoItLater } from '@holi/core/screens/spaces/tasks/DoItLater'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { BookmarkLine } from '@holi/icons/src/generated'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
    totalCompletions,
    isGoodDeed,
  } = useTaskDetailsData()
  const displayCta = useFeatureFlag(FeatureFlagKey.TASK_CONTACT_CTA)
  const { displayError } = useErrorHandling()
  const { theme } = useTheme()
  const styles = getStyles(theme)

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
          <View style={styles.stickyBottomComponent}>
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
                <ButtonTracked
                  variant="secondary"
                  label={t('volunteering.progress.button.favorites.toSave')}
                  onPress={showDoItLater}
                  icon={BookmarkLine}
                  trackingEvent={TrackingEvent.Task.CTAButton.saveForLater({
                    step: 'save',
                    ...taskProps,
                  })}
                />
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
          </View>
        }
      >
        <DetailsScreen
          {...data}
          _footer={<VolunteeringSimilarRecos documentId={`task_${id}`} />}
          placeholderImage={id ? getPlaceholderImage(`task_${id}`) : undefined}
        />
      </Screen>
      {id && (
        <DoItLaterModal {...doItLaterModalProps}>
          <DoItLater
            id={id}
            title={data.title}
            imageSrc={data.coverImage?.uri}
            completedCount={totalCompletions || 0}
            trackingProps={taskProps}
          />
        </DoItLaterModal>
      )}
    </>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    stickyBottomComponent: {
      backgroundColor: theme.colors.background10,
      paddingHorizontal: Spacing.xs,
      paddingTop: Spacing.xs,
      paddingBottom: Spacing.md,
      borderTopRightRadius: BorderRadius.xxl,
      borderTopLeftRadius: BorderRadius.xxl,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      width: '100%',
      gap: Spacing['3xs'],
    },
  })

export default memo(TaskDetails)

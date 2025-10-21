import React, { useCallback, useState } from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import Animated, { FadeInUp, runOnJS } from 'react-native-reanimated'

import { Text } from 'holi-bricks/components/text'
import { Snackbar } from 'holi-bricks/components/snackbar/Snackbar'
import { Stack } from 'holi-bricks/components/stack'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { BookmarkLine, CheckboxCircleFilled, HeartHandshake } from '@holi/icons/src/generated'

import { FavoritableType, InteractionType, VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { useLottieContainerSize } from '@holi-apps/volunteering/hooks/useLottieContainerSize'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useCompleteTask } from '@holi/core/screens/spaces/tasks/useCompleteTask'

import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { SaveForLaterButton } from '@holi/core/components/SaveForLaterButton'
import { VolunteeringProgressStepper } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringProgressStepper'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { DoItLater, DoItLaterModal } from '@holi/core/screens/spaces/tasks/DoItLater'
import { useTaskDetailsData } from '@holi/core/screens/spaces/tasks/useTaskDetailsData'

const ANIMATION_DELAY = 500
const LOTTIE_ASPECT_RATIO = 342 / 130
const LOTTIE_MAX_HEIGHT = 160

interface Props {
  spaceIdOrName?: string
  isFavorite?: boolean
  refetchFavorite?: () => void
  isLoading?: boolean
  onModalDismiss?: () => void
  startChat: () => void
  status?: VolunteeringOpportunityStatusValue
}

export const TaskDetailsCTA = ({
  spaceIdOrName,
  isFavorite,
  refetchFavorite,
  isLoading,
  onModalDismiss,
  startChat,
  status,
}: Props) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  const { user: loggedInUser } = useLoggedInUser()
  const { displayError } = useErrorHandling()
  const { navigate } = useRouting()
  const { bottom } = useSafeAreaInsets()
  const { requireLogin } = useSignupModal()
  const [rewardsPhaseTwoEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_2)
  const { isLoggedIn } = useLoggedInUser()

  const { completeTask, loading: completeTaskLoading } = useCompleteTask()
  const { show: showContact, props: contactModalProps } = useModalState({ onDismiss: onModalDismiss })
  const { show: showDoItLater, props: doItLaterModalProps } = useModalState()

  // Lottie animation sizing
  const {
    onLayout: onLayoutLottieContainer,
    height: lottieHeight,
    width: lottieWidth,
  } = useLottieContainerSize({ aspectRatio: LOTTIE_ASPECT_RATIO, maxHeight: LOTTIE_MAX_HEIGHT })

  const [showSnackbar, setShowSnackbar] = useState(false)
  const [progressStatus, setProgressStatus] = useState<VolunteeringOpportunityStatusValue>(
    VolunteeringOpportunityStatusValue.WontDo
  )

  const { data, id, interactionType, taskDuration, taskRegularity, totalCompletions, isGoodDeed } = useTaskDetailsData()

  const taskProps = {
    taskId: id ?? '',
    taskName: data?.title,
    regularity: taskRegularity,
    duration: taskDuration,
    interactionType,
  }

  const handleCompleteTask = useCallback(async () => {
    if (!loggedInUser) return navigate(`/spaces/${spaceIdOrName}/tasks/${id}/complete`)

    try {
      await completeTask(id as string)
      navigate(`/spaces/${spaceIdOrName}/tasks/${id}/completed`)
    } catch (error) {
      displayError(error, 'Failed to complete task', {
        location: 'TaskDetailsCTA.handleCompleteTask',
      })
    }
  }, [completeTask, navigate, spaceIdOrName, id, loggedInUser, displayError])

  return (
    <Stack padding={{ left: 'md', right: 'md', bottom: 'lg' }} alignItems="center" width="100%" gap="xxs">
      {/* Primary action: Chat or Contact */}
      {interactionType === InteractionType.Chat && status === undefined && (
        <ButtonTracked
          label={t('volunteering.engagementDetail.getInTouchDrawer')}
          onPress={() => requireLogin(showContact)}
          testID="task-engagement-get-in-touch-btn"
          trackingEvent={TrackingEvent.Task.CTAButton.getInTouch(id || '')}
        />
      )}

      {(interactionType === InteractionType.Link || interactionType === InteractionType.Ready) && (
        <ButtonTracked
          testID="contact-organization-drawer"
          onPress={handleCompleteTask}
          icon={HeartHandshake}
          loading={completeTaskLoading}
          label={t('spaces.tasks.contactOrganization.cta.ready')}
          trackingEvent={TrackingEvent.Task.CTAButton.illDoIt({
            ...taskProps,
            step: 'started',
            authState: loggedInUser ? 'registered' : 'unregistered',
          })}
        />
      )}

      {isGoodDeed && !isLoggedIn ? (
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
          favoritableId={id || ''}
          favoritableType={FavoritableType.Task}
          __typename="Task"
          isFavorite={isFavorite}
          onCompleted={refetchFavorite}
          onError={(error) =>
            displayError(error, `Failed to ${isFavorite ? 'remove' : 'add'} favorite`, {
              location: 'TaskDetailsCTA.saveForLaterTask',
              favoritableId: id,
            })
          }
        />
      )}

      {/* Snackbar feedback */}
      <Snackbar
        label={t('spaces.tasks.contactOrganization.snackbar')}
        icon={CheckboxCircleFilled}
        dismissible
        onDismiss={() => setShowSnackbar(false)}
        visible={showSnackbar}
      />

      {id && (
        <DoItLaterModal {...doItLaterModalProps}>
          <DoItLater
            id={id}
            title={taskProps.taskName}
            imageSrc={data.coverImage?.uri}
            completedCount={totalCompletions || 0}
            trackingProps={taskProps}
            onJoin={doItLaterModalProps.onDismiss}
          />
        </DoItLaterModal>
      )}

      {/* Contact / Chat modal */}
      <HoliModal
        label="modal"
        animationType="slide"
        shown={contactModalProps.shown}
        onDismiss={contactModalProps.onDismiss}
        autoHeight
        testID="task-contact-modal"
        backgroundColor={styles.modal.backgroundColor}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: bottom }}>
          <HoliContainer>
            <Stack gap="md">
              {rewardsPhaseTwoEnabled && (
                <Stack width="100%" onLayout={onLayoutLottieContainer} alignItems="center">
                  <Stack width={lottieWidth} height={lottieHeight}>
                    <HoliLottie animType="rocket" loop style={{ aspectRatio: LOTTIE_ASPECT_RATIO }} />
                  </Stack>
                </Stack>
              )}

              {/* Modal content */}
              <Animated.View
                entering={
                  rewardsPhaseTwoEnabled
                    ? FadeInUp.delay(ANIMATION_DELAY).withCallback((finished) => {
                        if (finished) runOnJS(setProgressStatus)(VolunteeringOpportunityStatusValue.ToDo)
                      })
                    : undefined
                }
              >
                <Stack gap="md">
                  <Stack gap="3xs">
                    {rewardsPhaseTwoEnabled && (
                      <Stack padding={{ bottom: 'sm', left: 'md', right: 'md' }}>
                        <VolunteeringProgressStepper status={progressStatus} />
                      </Stack>
                    )}

                    <Text size="3xl" headingLevel="1">
                      {t('volunteer.progress.initiate.modal.title')}
                    </Text>
                    <Text>{t('volunteer.progress.initiate.modal.text')}</Text>
                  </Stack>

                  <Stack gap="4xs" margin={{ bottom: 'lg' }}>
                    <ButtonTracked
                      trackingEvent={TrackingEvent.Task.CTAButton.startedConversation(taskProps)}
                      loading={isLoading}
                      disabled={isLoading}
                      onPress={() => {
                        requireLogin(startChat)
                        contactModalProps.onDismiss?.()
                      }}
                      size="lg"
                      label={t('spaces.tasks.contactOrganization.cta.chat.open')}
                    />
                  </Stack>
                </Stack>
              </Animated.View>
            </Stack>
          </HoliContainer>
        </ScrollView>
      </HoliModal>
    </Stack>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  modal: {
    backgroundColor: theme.colors.bg.main,
  },
}))

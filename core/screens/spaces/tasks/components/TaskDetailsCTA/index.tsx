import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import React, { useCallback, useState } from 'react'
import { ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'

import { CheckboxCircleFilled, HeartHandshake } from '@holi/icons/src/generated'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { Stack } from 'holi-bricks/components/stack'
import { FavoritableType, InteractionType, VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { Snackbar } from 'holi-bricks/components/snackbar/Snackbar'
import { useCompleteTask } from '@holi/core/screens/spaces/tasks/useCompleteTask'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useLottieContainerSize } from '@holi-apps/volunteering/hooks/useLottieContainerSize'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { SaveForLaterButton } from '@holi/core/components/SaveForLaterButton'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import Animated, { FadeInUp, runOnJS } from 'react-native-reanimated'
import { VolunteeringProgressStepper } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringProgressStepper'

const ANIMATION_DELAY = 500
const LOTTIE_ASPECT_RATIO = 342 / 130
const LOTTIE_MAX_HEIGHT = 160

interface Props {
  spaceIdOrName?: string
  taskId?: string
  interactionType?: InteractionType
  isFavorite?: boolean
  refetchFavorite?: () => void
  isLoading?: boolean
  onModalDismiss?: () => void
  startChat: () => void
}

export const TaskDetailsCTA = ({
  spaceIdOrName,
  taskId,
  interactionType,
  isFavorite,
  refetchFavorite,
  isLoading,
  onModalDismiss,
  startChat,
}: Props) => {
  const { t } = useTranslation()
  const { user: loggedInUser } = useLoggedInUser()
  const { displayError } = useErrorHandling()
  const { navigate } = useRouting()
  const { bottom } = useSafeAreaInsets()
  const { requireLogin } = useSignupModal()
  const { styles } = useStyles(stylesheet)

  const [rewardsPhaseTwoEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_2)

  const { completeTask, loading: completeTaskLoading } = useCompleteTask()
  const { show: showContact, props: contactModalProps } = useModalState({
    onDismiss: onModalDismiss,
  })
  const {
    onLayout: onLayoutLottieContainer,
    height: lottieHeight,
    width: lottieWidth,
  } = useLottieContainerSize({
    aspectRatio: LOTTIE_ASPECT_RATIO,
    maxHeight: LOTTIE_MAX_HEIGHT,
  })

  const [showSnackbar, setShowSnackbar] = useState(false)
  const [progressStatus, setProgressStatus] = useState<VolunteeringOpportunityStatusValue>(
    VolunteeringOpportunityStatusValue.WontDo
  )

  const handleCompleteTask = useCallback(async () => {
    if (!loggedInUser) return navigate('/spaces/' + spaceIdOrName + '/tasks/' + taskId + '/complete')

    try {
      await completeTask(taskId as string)
      navigate(`/spaces/${spaceIdOrName}/tasks/${taskId}/completed`)
    } catch (error) {
      displayError(error, 'Failed to complete task', {
        location: 'TaskDetailsCTA.handleCompleteTask',
      })
    }
  }, [completeTask, navigate, spaceIdOrName, taskId, loggedInUser, displayError])

  return (
    <Stack
      padding={{ left: 'md', right: 'md', bottom: 'lg' }}
      alignItems="center"
      justifyContent="center"
      alignSelf="center"
      width="100%"
      gap="xxs"
    >
      {interactionType === InteractionType.Chat ? (
        <Button
          label={t('volunteering.engagementDetail.getInTouchDrawer')}
          onPress={() => requireLogin(() => showContact())}
          testID="task-engagement-get-in-touch-btn"
        />
      ) : (
        <Button
          testID="contact-organization-drawer"
          onPress={handleCompleteTask}
          icon={HeartHandshake}
          loading={completeTaskLoading}
          label={t('spaces.tasks.contactOrganization.cta.ready')}
          // trackingEvent={TrackingEvent.Task.CTAButton.illDoIt({
          //   ...taskProps,
          //   step: 'started',
          //   authState: loggedInUser ? 'registered' : 'unregistered',
          // })}
        />
      )}

      <SaveForLaterButton
        favoritableId={taskId || ''} // todo
        favoritableType={FavoritableType.Task}
        __typename={'Task'}
        isFavorite={isFavorite}
        onCompleted={refetchFavorite}
        onError={(error: Error) =>
          displayError(
            error,
            isFavorite ? 'Failed to add the task to favorites' : 'Failed to remove the task from favorites',
            {
              location: 'TaskDetailsCTA.saveForLaterTask',
              favoritableId: taskId,
            }
          )
        }
      />

      <Snackbar
        label={t('spaces.tasks.contactOrganization.snackbar')}
        icon={CheckboxCircleFilled}
        dismissible
        onDismiss={() => setShowSnackbar(false)}
        visible={showSnackbar}
      />

      <HoliModal
        label="modal"
        animationType="slide"
        shown={contactModalProps.shown}
        onDismiss={contactModalProps.onDismiss}
        autoHeight={true}
        testID="task-contact-modal"
        backgroundColor={styles.modal.backgroundColor}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: bottom }}>
          <HoliContainer>
            <Stack gap="md">
              {rewardsPhaseTwoEnabled && (
                <Stack width="100%" onLayout={onLayoutLottieContainer} alignItems="center">
                  <Stack width={lottieWidth} height={lottieHeight}>
                    <HoliLottie
                      animType="rocket"
                      loop
                      style={{
                        aspectRatio: LOTTIE_ASPECT_RATIO,
                        position: 'relative',
                      }}
                    />
                  </Stack>
                </Stack>
              )}

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

                    <Text size="3xl">{t('volunteer.progress.initiate.modal.title')}</Text>
                    <Text>{t('volunteer.progress.initiate.modal.text')}</Text>
                  </Stack>

                  <Stack gap="4xs" margin={{ bottom: 'lg' }}>
                    <Button
                      // trackingEvent={TrackingEvent.Task.CTAButton.startedConversation(taskProps)}
                      loading={isLoading}
                      disabled={isLoading}
                      onPress={() => requireLogin(() => startChat())}
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

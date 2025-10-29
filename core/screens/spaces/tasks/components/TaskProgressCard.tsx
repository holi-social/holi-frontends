import React, { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Stack } from 'holi-bricks/components/stack'
import { Chat3, Check } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { VolunteeringProgressStepper } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringProgressStepper'
import { VolunteeringConnectedStatusModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringConnectedStatusModal'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { VolunteeringFinishedModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringFinishedModal'
import { type Duration, type Regularity, VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useEarnedBadgesModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesGlobalModal'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { BadgesDocument } from '@holi/api/graphql/graphql-codegen'
import { useRoomById } from '@holi/chat/src/store'
import { ButtonTracked } from '@holi/core/components/Trackable'

interface ProgressCardProps {
  onStatusChange: (status: VolunteeringOpportunityStatusValue) => void
  status?: VolunteeringOpportunityStatusValue
  startChat: (supressNavigation?: boolean) => Promise<string | undefined>
  taskProps: {
    taskId: string
    taskName: string
    duration?: Duration
    regularity?: Regularity
  }
}

const hasShownConnectedModalMap: Record<string, boolean> = {}

export const TaskProgressCard = ({
  onStatusChange,
  status = VolunteeringOpportunityStatusValue.ToDo,
  startChat,
  taskProps,
}: ProgressCardProps) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const { track } = useTracking()
  const checkNewBadges = useEarnedBadgesModal()
  const [badgesEnabled] = useFeatureFlag(FeatureFlagKey.BADGES)
  const client = useApolloClient()
  const [roomId, setRoomId] = useState('')

  const [, messages] = useRoomById(roomId || '')

  const { show: showConnectedStatusModal, props: connectedStatusModalProps } = useModalState({
    onDismiss: () => onStatusChange(VolunteeringOpportunityStatusValue.Contacted),
  })

  useEffect(() => {
    const initRoomId = async () => {
      const initialRoomId = await startChat(true)
      setRoomId(initialRoomId || '')
    }
    initRoomId()

    if (!roomId || !messages) return

    const textMessages = messages?.filter((msg) => msg.type === 'message') || []

    if (textMessages.length > 0 && !hasShownConnectedModalMap[roomId]) {
      hasShownConnectedModalMap[roomId] = true
      showConnectedStatusModal()
    }
  }, [roomId, messages, showConnectedStatusModal, startChat])

  const { show: showFinishedModal, props: finishedModalProps } = useModalState({
    onDismiss: async () => {
      track(TrackingEvent.Rewards.goodDeedClaimed('volunteer'))
      onStatusChange(VolunteeringOpportunityStatusValue.Doing)

      await client.refetchQueries({
        include: [BadgesDocument],
      })

      if (badgesEnabled) {
        await checkNewBadges()
      }
    },
  })

  return (
    <>
      <Stack
        padding={{ left: 'xs', right: 'xs', bottom: 'xxs', top: 'xxs' }}
        gap="xs"
        backgroundColor="purpleLight"
        borderColor="main"
        borderRadius="md"
        borderStyle="solid"
        borderWidth="sm"
      >
        <HoliTransition.Fade visible>
          <VolunteeringProgressStepper status={status} />
        </HoliTransition.Fade>

        <HoliTransition.FadeSwitch animKey={status}>
          {status === VolunteeringOpportunityStatusValue.ToDo && (
            <Stack gap="xs">
              <Stack gap="3xs">
                <Text size="lg">{t('volunteer.progress.progressCard.connect.title')}</Text>
                <Text>{t('volunteer.progress.progressCard.connect.text')}</Text>
              </Stack>

              <ButtonTracked
                label={t('chatTask.progress.button.openChat')}
                icon={Chat3}
                onPress={() => {
                  startChat()
                }}
                trackingEvent={TrackingEvent.Task.CTAButton.startedConversation(taskProps)}
              />
            </Stack>
          )}

          {status === VolunteeringOpportunityStatusValue.Contacted && (
            <>
              <Stack gap="xs">
                <Stack gap="3xs">
                  <Text size="lg">{t('volunteer.progress.progressCard.act.title')}</Text>
                  <Text>{t('volunteer.progress.progressCard.act.text')}</Text>
                </Stack>

                <Stack gap="3xs">
                  <ButtonTracked
                    label={t('chatTask.progress.button.openChat')}
                    variant="secondary"
                    icon={Chat3}
                    onPress={() => {
                      startChat()
                    }}
                    trackingEvent={TrackingEvent.Task.CTAButton.reopenChat()}
                  />
                  <ButtonTracked
                    label={t('volunteering.progress.button.act')}
                    icon={Check}
                    onPress={() => {
                      showFinishedModal()
                    }}
                    trackingEvent={TrackingEvent.Task.CTAButton.imOnIt()}
                    aria-label={t('volunteering.progress.button.act.buttonLabel')}
                  />
                </Stack>
              </Stack>
            </>
          )}

          {status === VolunteeringOpportunityStatusValue.Doing && (
            <>
              <Stack direction="row" gap="xs" alignItems="center">
                <Stack
                  backgroundColor="greenLight"
                  borderColor="main"
                  borderRadius={'md'}
                  borderStyle="solid"
                  borderWidth={'sm'}
                  height={158}
                  width={110}
                  alignItems="center"
                  justifyContent="center"
                >
                  <HoliLottie animType="highFive" loop={false} />
                </Stack>

                <Stack flexShrink={1} gap="xs" justifyContent="space-between">
                  <Stack gap="3xs">
                    <Text size="lg">{t('volunteer.progress.progressCard.helping.title')}</Text>
                    <Text>{t('volunteer.progress.progressCard.helping.text')}</Text>
                  </Stack>

                  <Stack alignItems="flex-start">
                    <View>
                      <Button
                        label={t('volunteering.progress.button.nextAction')}
                        onPress={() => navigate('/act')}
                        inline
                      />
                    </View>
                  </Stack>
                </Stack>
              </Stack>
            </>
          )}
        </HoliTransition.FadeSwitch>
      </Stack>

      <VolunteeringConnectedStatusModal {...connectedStatusModalProps} label="Connected status" />
      <VolunteeringFinishedModal {...finishedModalProps} label="Finished status" />
    </>
  )
}

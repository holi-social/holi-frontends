import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Stack } from 'holi-bricks/components/stack'
import { Check } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'

import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { VolunteeringContactItem } from '@holi-apps/volunteering/components/VolunteeringContactItem'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import {
  VolunteeringProgressStepper,
  type VolunteeringProgressStepperProps,
} from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringProgressStepper'
import { VolunteeringConnectedStatusModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringConnectedStatusModal'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { VolunteeringFinishedModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringFinishedModal'
import { Typesense_DocumentContactType, VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { ButtonTracked } from '@holi/core/components/Trackable'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { EarnedBadgesModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesModal'
import { type Badge, useBadges } from '@holi/core/screens/userprofile/hooks/useBadges'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

interface ProgressCardProps extends VolunteeringProgressStepperProps {
  onStatusChange: (status: VolunteeringOpportunityStatusValue) => void
  document: VolunteeringDetailsScreenData
  engagementId: string
}

export const VolunteeringProgressCard = ({
  document,
  engagementId,
  status = VolunteeringOpportunityStatusValue.ToDo,
  onStatusChange,
}: ProgressCardProps) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const { track } = useTracking()
  const [unlockedBadges, setUnlockedBadges] = useState<Badge[]>([])
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0)
  const { refetchBadges } = useBadges()
  const [rewardsPhaseThreeEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_3)

  const { show: showConnectedStatusModal, props: connectedStatusModalProps } = useModalState({
    onDismiss: () => onStatusChange(VolunteeringOpportunityStatusValue.Contacted),
  })

  const { show: showFinishedModal, props: finishedModalProps } = useModalState({
    onDismiss: async () => {
      track(TrackingEvent.Rewards.goodDeedClaimed('volunteer'))
      onStatusChange(VolunteeringOpportunityStatusValue.Doing)

      if (rewardsPhaseThreeEnabled) {
        const unlockedBadges = await newBadgeUnlocked()
        if (unlockedBadges.length > 0) {
          showBadgesModal()
        }
      }
    },
  })

  const { show: showBadgesModal, props: badgesModalProps } = useModalState({
    onDismiss: () => {
      const nextIndex = currentBadgeIndex + 1

      if (nextIndex < unlockedBadges.length) {
        setCurrentBadgeIndex(nextIndex) // Show the next unlocked but unseen badge
      }
    },
  })

  const newBadgeUnlocked = async () => {
    const updatedBadges = await refetchBadges()
    const newlyUnlockedBadges = updatedBadges.filter((badge) => badge.unlockedAt && !badge.seenAt) ?? []
    setUnlockedBadges(newlyUnlockedBadges)
    return newlyUnlockedBadges
  }

  const contactInfoDisplayed = document.contact?.map((contact) => contact.type)

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
        <HoliTransition.Fade visible={status !== VolunteeringOpportunityStatusValue.Doing}>
          <VolunteeringProgressStepper status={status} />
        </HoliTransition.Fade>

        <HoliTransition.FadeSwitch animKey={status}>
          {status === VolunteeringOpportunityStatusValue.ToDo && (
            <>
              <Stack gap="3xs">
                <Text size="lg">{t('volunteer.progress.progressCard.connect.title')}</Text>
                <Text size="md">{t('volunteer.progress.progressCard.connect.text')}</Text>

                <Stack padding={{ top: '3xs', bottom: 'md' }} gap="3xs">
                  {document.contact?.length ? (
                    document.contact?.map((contact, index) => (
                      <VolunteeringContactItem
                        key={contact.value + index}
                        contact={contact}
                        trackingEvent={TrackingEvent.Volunteering.contacted(engagementId, {
                          commitmentType: document.commitmentType,
                          source: document.source,
                          contact_info_displayed: contactInfoDisplayed,
                          contact_method_selected: contact.type,
                        })}
                      />
                    ))
                  ) : (
                    <VolunteeringContactItem
                      contact={
                        document.contact?.find((contact) => contact.type === Typesense_DocumentContactType.Website) ?? {
                          type: Typesense_DocumentContactType.Website,
                          value: document.externalUrl ?? '',
                        }
                      }
                      trackingEvent={TrackingEvent.Volunteering.contacted(engagementId, {
                        commitmentType: document.commitmentType,
                        source: document.source,
                        contact_info_displayed: contactInfoDisplayed,
                        contact_method_selected: Typesense_DocumentContactType.Website,
                      })}
                    />
                  )}
                </Stack>
              </Stack>

              <ButtonTracked
                label={t('volunteering.progress.button.reachedOut')}
                icon={Check}
                onPress={showConnectedStatusModal}
                trackingEvent={TrackingEvent.Volunteering.selfReportingFlow.contacted(engagementId)}
              />
            </>
          )}

          {status === VolunteeringOpportunityStatusValue.Contacted && (
            <>
              <Stack gap="xs">
                <Stack gap="3xs">
                  <Text size="lg">{t('volunteer.progress.progressCard.act.title')}</Text>
                  <Text size="md">{t('volunteer.progress.progressCard.act.text')}</Text>
                </Stack>

                <ButtonTracked
                  label={t('volunteering.progress.button.act')}
                  icon={Check}
                  onPress={showFinishedModal}
                  trackingEvent={TrackingEvent.Volunteering.selfReportingFlow.doing(engagementId)}
                />
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
                    <Text size="md">{t('volunteer.progress.progressCard.helping.text')}</Text>
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
      <EarnedBadgesModal {...badgesModalProps} label="Earned a badge" badge={unlockedBadges[currentBadgeIndex]} />
    </>
  )
}

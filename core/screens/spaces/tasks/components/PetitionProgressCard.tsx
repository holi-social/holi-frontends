import React from 'react'
import { useApolloClient } from '@apollo/client/react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'

import { Stack } from 'holi-bricks/components/stack'
import { Check, ExternalLink } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { VolunteeringFinishedModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringFinishedModal'
import { useEarnedBadgesModal } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesGlobalModal'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { BadgesDocument } from '@holi/api/graphql/graphql-codegen'
import { ProgressStepper, type ProgressStepperStep } from 'holi-bricks/components/progressStepper/ProgressStepper'
import { PetitionsStatusValue } from '@holi/core/screens/act/petitions/status'

interface PetitionProgressCardProps {
  onStatusChange: (status: PetitionsStatusValue) => void
  status?: PetitionsStatusValue
  externalLink: string
}

export const PetitionProgressCard = ({
  onStatusChange,
  status = PetitionsStatusValue.ToSign,
  externalLink,
}: PetitionProgressCardProps) => {
  const { navigate } = useRouting()
  const { t } = useTranslation()
  const checkNewBadges = useEarnedBadgesModal()
  const [badgesEnabled] = useFeatureFlag(FeatureFlagKey.BADGES)
  const client = useApolloClient()

  const { show: showFinishedModal, props: finishedModalProps } = useModalState({
    onDismiss: async () => {
      // track(TrackingEvent.Rewards.goodDeedClaimed('petition'))
      onStatusChange(PetitionsStatusValue.Completed)

      await client.refetchQueries({
        include: [BadgesDocument],
      })

      if (badgesEnabled) {
        await checkNewBadges()
      }
    },
  })

  const petitionProgressSteps: ProgressStepperStep<PetitionsStatusValue>[] = [
    {
      key: PetitionsStatusValue.ToSign,
      label: t('petition.progress.progressBar.sign'),
    },
    {
      key: PetitionsStatusValue.Completed,
      label: t('petition.progress.progressBar.done'),
    },
  ]

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
          <Stack direction="row" alignSelf="center" width="70%">
            <ProgressStepper steps={petitionProgressSteps} activeStepKey={status} />
          </Stack>
        </HoliTransition.Fade>

        <HoliTransition.FadeSwitch animKey={status}>
          {status === PetitionsStatusValue.ToSign && (
            <Stack gap="xs">
              <Stack gap="3xs">
                <Text size="lg">{t('petition.progress.progressCard.done.title')}</Text>
                <Text>{t('petition.progress.progressCard.done.text')}</Text>
              </Stack>

              <Button
                label={t('petition.progress.buttonSecondary.act')}
                icon={ExternalLink}
                variant="secondary"
                onPress={() => {
                  Linking.openURL(externalLink)
                }}
              />
              <Button
                label={t('petition.progress.button.act')}
                icon={Check}
                onPress={() => {
                  showFinishedModal()
                }}
              />
            </Stack>
          )}

          {status === PetitionsStatusValue.Completed && (
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

      <VolunteeringFinishedModal {...finishedModalProps} label="Finished status" />
    </>
  )
}

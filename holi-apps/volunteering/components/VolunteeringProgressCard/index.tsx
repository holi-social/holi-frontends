import React from 'react'

import { Stack } from 'holi-bricks/components/stack'
import { Check, Close } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'

import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { VolunteeringContactItem } from '@holi-apps/volunteering/components/VolunteeringContactItem'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import {
  VolunteeringProgressStepper,
  type VolunteeringProgressStepperProps,
} from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringProgressStepper'

export type VolunteeringProgressStatus = 'plan' | 'contact' | 'do' | 'finished'

interface ProgressCardProps extends VolunteeringProgressStepperProps {
  onStatusChange: (status: VolunteeringProgressStatus | undefined) => void
  document: VolunteeringDetailsScreenData
  engagementId: string
}

export const VolunteeringProgressSteps: { key: VolunteeringProgressStatus; label: string }[] = [
  {
    key: 'plan',
    label: 'Plan',
  },
  {
    key: 'contact',
    label: 'Contact',
  },
  {
    key: 'do',
    label: 'Do',
  },
]

export const VolunteeringProgressCard = ({
  document,
  engagementId,
  status = 'plan',
  onStatusChange,
}: ProgressCardProps) => {
  const { navigate } = useRouting()
  const contactInfoDisplayed = document.contact?.map((contact) => contact.type)

  const { visible, show: showConfirmation, hide: hideConfirmation } = useModalState()

  return (
    <Stack
      padding={{ left: 'xs', right: 'xs', bottom: 'xxs', top: 'xxs' }}
      gap="xs"
      backgroundColor="purpleLight"
      borderColor="main"
      borderRadius="md"
      borderStyle="solid"
      borderWidth="sm"
    >
      <HoliTransition.Fade visible={status !== 'finished'}>
        <VolunteeringProgressStepper status={status} />
      </HoliTransition.Fade>

      <HoliTransition.FadeSwitch animKey={status}>
        {status === 'contact' && (
          <>
            <Stack gap="3xs">
              <Text size="lg">Contact indicator</Text>
              <Text size="md">Reach out to exchange on how you can support.</Text>

              <Stack padding={{ top: '3xs', bottom: 'md' }} gap="3xs">
                {document.contact?.map((contact, index) => (
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
                ))}
              </Stack>
            </Stack>

            <Button label="I reached out" icon={Check} onPress={() => onStatusChange('do')} />
          </>
        )}

        {status === 'do' && (
          <>
            <Stack gap="3xs">
              <Text size="lg">Carry out</Text>
              <Text size="md">Let us know if you committed to take this engagement on.</Text>
            </Stack>

            <Stack gap="3xs">
              <Button label="I’m on it" icon={Check} onPress={() => onStatusChange('finished')} />
              <Button label="I don’t do it" variant="secondary" icon={Close} onPress={showConfirmation} />
            </Stack>

            <HoliConfirmation
              show={visible}
              label={'End the process'}
              title={'Do you want to end the process?'}
              description={'If you won’t do this, your progress will be lost and you won’t receive the good deed.'}
              secondaryText={'Keep'}
              primaryText={'End process'}
              onPrimary={() => {
                onStatusChange(undefined)
                hideConfirmation()
              }}
              onDismiss={hideConfirmation}
            />
          </>
        )}

        {status === 'finished' && (
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
                  <Text size="lg">Great that you did this!</Text>
                  <Text size="md">You made the world a little better. Do you think about what to do next?</Text>
                </Stack>

                <Button label="Find more good deeds" onPress={() => navigate('/act')} />
              </Stack>
            </Stack>
          </>
        )}
      </HoliTransition.FadeSwitch>
    </Stack>
  )
}

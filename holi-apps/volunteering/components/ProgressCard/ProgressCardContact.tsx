import React from 'react'

import { Stack } from 'holi-bricks/components/stack'
import { Check } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { ProgressStepper, type StepStatus } from 'holi-bricks/components/progressStepper/ProgressStepper'

import { FieldEmail } from './components/FieldEmail'
import { FieldPhoneNumber } from './components/FieldPhoneNumber'
import { FieldWebsite } from './components/FieldWebsite'
import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { TrackingEvent } from '@holi/core/tracking'

interface Step {
  label: string
  status: StepStatus
}

interface ProgressCardProps {
  steps: Step[]
  email: string
  phoneNumber: string
  engagementId: string
  document?: VolunteeringDetailsScreenData
  onReachOut?: () => void
}

export const ProgressCardContact = ({
  steps,
  email,
  phoneNumber,
  engagementId,
  document,
  onReachOut,
}: ProgressCardProps) => {
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
      <Stack direction="row" alignSelf="center">
        {steps.map((step, index) => (
          <ProgressStepper
            key={index}
            step={index + 1}
            label={step.label}
            status={step.status as StepStatus}
            hasNextStep={index < steps.length - 1}
          />
        ))}
      </Stack>
      <Stack gap="3xs">
        <Text size="lg">Contact indicator</Text>
        <Text size="md">Reach out to exchange on how you can support.</Text>
        <Stack padding={{ top: '3xs', bottom: '3xs' }} gap="3xs">
          {email && <FieldEmail email={email} />}

          {phoneNumber && <FieldPhoneNumber phoneNumber={phoneNumber} />}

          {document?.externalUrl && (
            <FieldWebsite
              externalUrl={document.externalUrl}
              trackingEvent={TrackingEvent.Volunteering.pressed(engagementId, {
                commitmentType: document.commitmentType,
                locationType: document.locationType,
                source: document.source,
              })}
            />
          )}
        </Stack>
      </Stack>

      <Button label="I reached out" icon={Check} onPress={onReachOut} />
    </Stack>
  )
}

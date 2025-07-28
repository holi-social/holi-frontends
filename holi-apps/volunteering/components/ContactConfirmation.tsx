import React from 'react'

import { Stack } from 'holi-bricks/components/stack'
import { ButtonTracked } from '@holi/core/components/Trackable'
import type { TrackingEvent } from '@holi/core/tracking'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { Image } from 'holi-bricks/components/image'
import { ProgressStepper, type StepStatus } from 'holi-bricks/components/progressStepper/ProgressStepper'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import type { VolunteeringProgressStep } from '@holi-apps/volunteering/components/types'

interface ContactConfirmationProps {
  steps: VolunteeringProgressStep[]
  onCommit?: () => void
  onCancel?: () => void
  trackingEvent: TrackingEvent
}

export const ContactConfirmation = ({ steps, onCommit, onCancel, trackingEvent }: ContactConfirmationProps) => {
  return (
    <HoliContainer>
      <Stack padding="md" gap="md">
        <Stack alignItems="center">
          {/* todo: animate rocket using lottie */}
          <Image
            source={require('@holi/ui/assets/img/volunteering/rocket animation.gif')}
            width={0}
            height={0}
            alt={'illustration'}
          />
        </Stack>

        <Stack direction="row" alignSelf="center">
          {steps.map((step, index) => (
            <ProgressStepper
              key={index}
              step={index + 1}
              status={step.status as StepStatus}
              hasNextStep={index < steps.length - 1}
            />
          ))}
        </Stack>

        <Stack gap="3xs">
          <Text size="3xl">Did you reach out?</Text>
          <Text size="md">Let us know if you contacted the initiator to get more details.</Text>
        </Stack>

        <Stack gap="xxs">
          <ButtonTracked
            trackingEvent={trackingEvent}
            size="lg"
            label={'Yes, I reached out'} // todo: localazy
            onPress={onCommit}
            testID="volunteering-engagement-get-in-touch-btn"
          />

          <Button label="No, not yet" variant="secondary" size="lg" onPress={onCancel} />
        </Stack>
      </Stack>
    </HoliContainer>
  )
}

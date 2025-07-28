import React from 'react'

import { Stack } from 'holi-bricks/components/stack'
import { Check, Close } from '@holi/icons/src/generated'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { ProgressStepper, type StepStatus } from 'holi-bricks/components/progressStepper/ProgressStepper'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import type { VolunteeringProgressStep } from '@holi-apps/volunteering/components/types'

interface ProgressCardDoingProps {
  steps: VolunteeringProgressStep[]
  onCommit?: () => void
  onCancel?: () => void
}

export const ProgressCardDoing = ({ steps, onCommit, onCancel }: ProgressCardDoingProps) => {
  const { visible, show: showConfirmation, hide: hideConfirmation } = useModalState()

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
          <Text size="lg">Carry out</Text>
          <Text size="md">Let us know if you committed to take this engagement on.</Text>
        </Stack>

        <Stack gap="3xs">
          <Button label="I’m on it" icon={Check} onPress={onCommit} />
          <Button label="I don’t do it" variant="secondary" icon={Close} onPress={showConfirmation} />
        </Stack>
      </Stack>

      <HoliConfirmation
        show={visible}
        label={'End the process'}
        title={'Do you want to end the process?'}
        description={'If you won’t do this, your progress will be lost and you won’t receive the good deed.'}
        secondaryText={'Keep'}
        primaryText={'End process'}
        onPrimary={() => {
          onCancel?.()
          hideConfirmation()
        }}
        onDismiss={hideConfirmation}
      />
    </>
  )
}

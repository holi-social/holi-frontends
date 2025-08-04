import React from 'react'

import { Stack } from 'holi-bricks/components/stack'
import { ProgressStepper } from 'holi-bricks/components/progressStepper/ProgressStepper'

export type VolunteeringProgressStatus = 'plan' | 'contact' | 'do' | 'finished'

export interface VolunteeringProgressStepperProps {
  status?: VolunteeringProgressStatus
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

export const VolunteeringProgressStepper = ({ status = 'plan' }: VolunteeringProgressStepperProps) => (
  <Stack direction="row" alignSelf="center" width="100%">
    <ProgressStepper steps={VolunteeringProgressSteps} activeStepKey={status !== 'finished' ? status : 'do'} />
  </Stack>
)

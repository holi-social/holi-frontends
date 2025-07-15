import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ProgressStepper, type StepStatus } from 'holi-bricks/components/progressStepper/ProgressStepper'
import { Stack } from 'holi-bricks/components/stack'

const meta: Meta<typeof ProgressStepper> = {
  title: 'Components/ProgressStepper',
  component: ProgressStepper,
}

type Story = StoryObj<typeof ProgressStepper>

export const Default: Story = {
  render: function Render() {
    const steps = [
      { label: 'Step One', status: 'upcoming' },
      { label: 'Step Two', status: 'active' },
      { label: 'Step Three', status: 'done' },
    ]
    return (
      <Stack direction="row">
        {steps.map((step, index) => (
          <ProgressStepper
            key={index}
            step={index + 1}
            label={step.label}
            status={step.status as StepStatus}
            isLast={index === steps.length - 1}
            isFirst={index === 0}
          />
        ))}
      </Stack>
    )
  },
}

export default meta

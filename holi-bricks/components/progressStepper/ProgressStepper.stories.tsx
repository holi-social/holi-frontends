import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-native'
import { ProgressStepper } from 'holi-bricks/components/progressStepper/ProgressStepper'
import { Stack } from 'holi-bricks/components/stack'
import { GoodDeedsIcon, GoodDeedsIconFilled } from '@holi/icons/src/generated'

const meta: Meta<typeof ProgressStepper> = {
  title: 'Components/ProgressStepper',
  component: ProgressStepper,
  argTypes: {
    activeStepKey: {
      options: ['step-one', 'step-two', 'step-three'],
      control: { type: 'radio' },
    },
  },
  args: {
    activeStepKey: 'step-two',
  },
}

type Story = StoryObj<typeof ProgressStepper>

export const Default: Story = {
  render: function Render({ activeStepKey }) {
    const steps = [
      { key: 'step-one', label: 'Step One' },
      { key: 'step-two', label: 'Step Two' },
      { key: 'step-three', label: 'Step Three', icon: { active: GoodDeedsIconFilled, inactive: GoodDeedsIcon } },
    ]

    return (
      <Stack direction="row" width="100%">
        <ProgressStepper steps={steps} activeStepKey={activeStepKey} />
      </Stack>
    )
  },
}

export default meta

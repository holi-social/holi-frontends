import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { HoliProgressBar, HoliProgressBarProps, useProgressBar } from '@holi/ui/components/molecules/HoliProgressBar'

export default {
  title: 'Molecules/HoliProgressBar',
  component: HoliProgressBar,
  parameters: {
    docs: {
      description: {
        component: 'Primary UI component for progress bar.',
      },
    },
  },
} as ComponentMeta<typeof HoliProgressBar>

const Template: ComponentStory<typeof HoliProgressBar> = ({ ...args }) => {
  return <HoliProgressBar {...args} />
}

export const BasicExample: ComponentStory<typeof HoliProgressBar> = Template.bind({})

BasicExample.argTypes = {
  width: { description: 'Progress bar width (px)', required: true, control: { type: 'number' } },
  size: {
    description: 'Progress bar size',
    required: false,
    control: { type: 'select', options: ['small', 'medium'] },
  },
}

BasicExample.args = {
  width: 150,
}

export const AnimatedExample: ComponentStory<React.FC<HoliProgressBarProps & { progress: number }>> = ({
  progress,
  ...args
}) => {
  const { progressWidth } = useProgressBar(progress)

  return <HoliProgressBar {...args} width={progressWidth} />
}

AnimatedExample.argTypes = {
  progress: { description: 'Progress (%)', required: true, control: { type: 'range', min: 0, max: 100, step: 0.1 } },
}

AnimatedExample.args = {
  progress: 10,
}

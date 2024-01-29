import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import {
  HoliProgressBar,
  HoliProgressBarProps,
  useProgressBarAnimation,
} from '@holi/ui/components/molecules/HoliProgressBar'

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
  percentage: { description: 'Progress (%)', required: true, control: { type: 'range', min: 0, max: 100, step: 0.1 } },
  size: {
    description: 'Progress bar size',
    required: false,
    control: { type: 'select' },
    options: ['small', 'medium'],
  },
}

BasicExample.args = {
  percentage: 25,
}

export const AnimatedExample: ComponentStory<
  React.FC<Omit<HoliProgressBarProps, 'percentage'> & { progress: number }>
> = ({ progress, ...args }) => {
  const { percentage } = useProgressBarAnimation(progress)

  return <HoliProgressBar {...args} percentage={percentage} />
}

AnimatedExample.argTypes = {
  progress: { description: 'Progress (%)', required: true, control: { type: 'range', min: 0, max: 100, step: 0.1 } },
}

AnimatedExample.args = {
  progress: 10,
}

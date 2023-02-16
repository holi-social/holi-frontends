import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliProgressBar from '@holi/ui/components/molecules/HoliProgressBar'

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
  progress: { description: 'Progress', required: true, control: { type: 'number' } },
}

BasicExample.args = {
  progress: 10,
}

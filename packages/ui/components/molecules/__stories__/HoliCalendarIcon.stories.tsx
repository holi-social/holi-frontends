import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliCalendarIcon, { HoliCalendarIconSizes } from '@holi/ui/components/molecules/HoliCalendarIcon'

export default {
  title: 'Molecules/HoliCalendarIcon',
  parameters: {
    docs: {
      description: {
        component: 'UI component to display appointment/event dates.',
      },
    },
  },
} as ComponentMeta<typeof HoliCalendarIcon>

const Template: ComponentStory<typeof HoliCalendarIcon> = ({ ...args }) => {
  return <HoliCalendarIcon {...args} />
}

export const Primary: ComponentStory<typeof HoliCalendarIcon> = Template.bind({})
Primary.argTypes = {
  size: {
    options: HoliCalendarIconSizes,
    control: { type: 'select' },
    description: 'small or medium (default)',
  },
  disabled: { description: 'Disabled gray state' },
  day: { description: 'Day of the month as number', required: true, control: { type: 'number', min: 1, max: 12 } },
  month: { description: 'Month of the year as number', required: true, control: { type: 'number', min: 1, max: 31 } },
}

Primary.args = {
  size: 'medium',
  disabled: false,
  day: 13,
  month: 10,
}

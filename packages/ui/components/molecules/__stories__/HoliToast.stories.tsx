import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliToast, { HoliToastType } from '@holi/ui/components/molecules/HoliToast'

export default {
  title: 'Molecules/HoliToast',
  component: HoliToast,
} as ComponentMeta<typeof HoliToast>

const Template: ComponentStory<typeof HoliToast> = ({ ...args }) => {
  return <HoliToast {...args} />
}

export const Primary: ComponentStory<typeof HoliToast> = Template.bind({})

Primary.argTypes = {
  type: {
    options: [HoliToastType.ERROR, HoliToastType.SUCCESS],
    control: { type: 'select' },
    description: 'Toast type',
  },

  text: {
    description: 'Toast text',
    type: 'string',
    control: { type: 'text' },
  },
}

Primary.args = {
  type: HoliToastType.SUCCESS,
  text: 'My HoliToast',
  id: 'test',
}

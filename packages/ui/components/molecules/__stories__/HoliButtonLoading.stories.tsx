import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { Loader } from '@holi/icons/src/generated'
import HoliButtonLoading from '@holi/ui/components/molecules/HoliButtonLoading'

export default {
  title: 'Molecules/HoliButtonLoading',
  parameters: {
    docs: {
      description: {
        component: 'Button with a loading state.',
      },
    },
  },
} as ComponentMeta<typeof HoliButtonLoading>

const Template: ComponentStory<typeof HoliButtonLoading> = ({ ...args }) => {
  return (
    <>
      <h3>New SVG Icon Components</h3>
      <HoliButtonLoading icon={Loader} {...args} label={'Action'} />
    </>
  )
}

export const Primary: ComponentStory<typeof HoliButtonLoading> = Template.bind({})
Primary.argTypes = {
  iconSpinning: { control: { type: 'boolean' } },
}

Primary.args = {
  iconSpinning: true,
}

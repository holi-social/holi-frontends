import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'

export default {
  title: 'Molecules/HoliTabButton',
  parameters: {
    docs: {
      description: {
        component: 'UI component for tab selection to be used e.g. in HoliTabs.',
      },
    },
  },
} as ComponentMeta<typeof HoliTabButton>

const Template: ComponentStory<typeof HoliTabButton> = ({ ...args }) => {
  return <HoliTabButton {...args} />
}

export const Primary: ComponentStory<typeof HoliTabButton> = Template.bind({})
Primary.argTypes = {
  children: { description: 'Text / React elements' },
  label: { description: 'Accessibility Label', required: true, control: { type: 'text' } },
  disabled: { description: 'Disables interaction' },
  disableFocusability: { description: 'disallows focusing the tab via tabbing' },
}

Primary.args = {
  children: 'Tab',
  label: 'Label',
  disabled: false,
  disableFocusability: false,
}

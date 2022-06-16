import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliButton from '@holi/ui/components/HoliButton'

export default {
  title: 'Components/HoliButton',
  parameters: {
    docs: {
      description: {
        component: 'Primary UI component for user interaction.',
      },
    },
  },
} as ComponentMeta<typeof HoliButton>

const Template: ComponentStory<typeof HoliButton> = ({ ...args }) => {
  return <HoliButton {...args} />
}

export const Primary: ComponentStory<typeof HoliButton> = Template.bind({})
Primary.argTypes = {
  children: { description: 'Text / React elements' },
  label: { description: 'Accessibility Label', required: true, control: { type: 'text' } },
  disabled: { description: 'Disables interaction' },
  inline: { description: 'Inline / Full-width' },
}
Primary.args = {
  children: 'Button',
  label: 'Label',
  inline: true,
  disabled: false,
}

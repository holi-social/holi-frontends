import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliButton, { HoliButtonTypes, HoliButtonVariants } from '@holi/ui/components/molecules/HoliButton'

export default {
  title: 'Molecules/HoliButton',
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
  type: {
    options: HoliButtonTypes,
    control: { type: 'select' },
    description: 'primary (default) or secondary',
  },
  variant: {
    options: HoliButtonVariants,
    control: { type: 'select' },
    description: 'default, small or transparent',
  },
  disabled: { description: 'Disables interaction' },
  inline: { description: 'Inline / Full-width' },
  disableFocusability: { description: 'disallows focusing the button via tabbing' },
}

Primary.args = {
  children: 'Button',
  label: 'Label',
  type: 'primary',
  variant: 'default',
  transparent: false,
  disabled: false,
  inline: true,
  disableFocusability: false,
}

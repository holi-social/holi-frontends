import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliButton from '@holi/ui/components/HoliButton'
import { HoliButtonType, HoliButtonVariant } from '@holi/ui/components/HoliButton/HoliButton.types'
import { enumOptions } from './helpers'

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
  type: { ...enumOptions(HoliButtonType), description: 'primary (default) or secondary' },
  variant: { ...enumOptions(HoliButtonVariant), description: 'default, small or transparent' },
}
Primary.args = {
  children: 'Button',
  label: 'Label',
  disabled: false,
  inline: true,
  type: HoliButtonType.primary,
  variant: HoliButtonVariant.default,
}

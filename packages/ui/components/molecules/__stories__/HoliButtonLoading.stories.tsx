import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { Loader, Loader2, Loader3, Loader4, Loader5, Refresh, Settings3 } from '@holi/icons/src/generated'
import { HoliButtonTypes, HoliButtonVariants } from '@holi/ui/components/molecules/HoliButton'
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
  let icon
  switch (args.icon) {
    // @ts-ignore
    case 'Loader':
      icon = Loader
      break
    // @ts-ignore
    case 'Loader2':
      icon = Loader2
      break
    // @ts-ignore
    case 'Loader3':
      icon = Loader3
      break
    // @ts-ignore
    case 'Loader4':
      icon = Loader4
      break
    // @ts-ignore
    case 'Loader5':
      icon = Loader5
      break
    // @ts-ignore
    case 'Settings3':
      icon = Settings3
      break
    // @ts-ignore
    case 'Refresh':
      icon = Refresh
      break
    default:
      icon = Loader
  }
  return <HoliButtonLoading {...args} icon={icon} />
}

export const Primary: ComponentStory<typeof HoliButtonLoading> = Template.bind({})
Primary.argTypes = {
  iconSpinning: { control: { type: 'boolean' } },
  icon: {
    options: ['Loader', 'Loader2', 'Loader3', 'Loader4', 'Loader5', 'Settings3', 'Refresh'],
    control: { type: 'select' },
    description: 'Loader or Loader4',
  },
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
}

Primary.args = {
  iconSpinning: true,
  icon: Loader,
  label: 'Label',
  type: 'primary',
  variant: 'default',
  disabled: false,
}

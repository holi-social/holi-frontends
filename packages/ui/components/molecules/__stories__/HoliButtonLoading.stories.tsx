import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import { Loader, Refresh } from '@holi/icons/src/generated'
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

const icons = {
  Loader: Loader,
  Refresh: Refresh,
}

const Template: ComponentStory<typeof HoliButtonLoading> = ({ ...args }) => {
  if (typeof args.icon === 'function') {
    return <HoliButtonLoading {...args} icon={Loader} />
  }
  const icon = icons[args.icon || 'Loader']
  return <HoliButtonLoading {...args} icon={icon} />
}

export const Primary: ComponentStory<typeof HoliButtonLoading> = Template.bind({})
Primary.argTypes = {
  loading: { control: { type: 'boolean' } },
  icon: {
    options: Object.keys(icons),
    control: { type: 'select' },
    description: 'The (spinning) icon to display inside the button.',
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
  loading: true,
  icon: Loader,
  label: 'Click me',
  type: 'primary',
  variant: 'default',
  disabled: false,
}

import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from 'holi-bricks/components/avatar/Avatar'

import { Chat3 } from '@holi/icons/src/generated'
import { controlWithLabel } from 'holi-bricks/storybook/icons-to-story'

const availableSizes = ['xs', 'sm', 'md', 'lg'] as const
const disabledProps = [
  'testID',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-disabled',
  'imgPlaceholder',
  'accessible',
  'id',
  'role',
  'tabIndex',
]

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar/Avatar',
  component: Avatar,
  argTypes: {
    label: { description: 'Button text', required: false },
    source: { table: { disable: true } },
    icon: { ...controlWithLabel },
    ...Object.fromEntries(disabledProps.map((prop) => [prop, { table: { disable: true } }])),
  },
  args: {
    label: 'Label',
    initials: 'LN',
    size: 'md',
  },
}

type Story = StoryObj<typeof Avatar>

export const AvatarWithInitials: Story = {
  name: 'Avatar with Initials',
  argTypes: {
    label: { description: 'Label', required: false },
    size: { control: 'select', options: availableSizes },
  },
  args: {
    label: 'Label',
    size: 'md',
    initials: 'NL',
    border: 'strong',
    shape: 'circle',
  },
}

export const AvatarWithIcon: Story = {
  name: 'Avatar with Icon',
  argTypes: {
    label: { description: 'Label', required: false },
    size: { control: 'select', options: availableSizes },
  },
  args: {
    label: 'Label',
    size: 'md',
    icon: Chat3,
  },
}

export const AvatarWithImage: Story = {
  name: 'Avatar with Image',
  argTypes: {
    label: { description: 'Label', required: false },
    size: { control: 'select', options: availableSizes },
  },
  args: {
    label: 'Label',
    size: 'md',
    source: 'https://picsum.photos/id/64/100/100',
  },
}

export default meta

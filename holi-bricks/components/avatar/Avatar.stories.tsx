import type { Meta, StoryObj } from '@storybook/react'
import { Avatar } from 'holi-bricks/components/avatar/Avatar'
import React from 'react'

import { Chat3 } from '@holi/icons/src/generated'

const availableSizes = ['xs', 'sm', 'md', 'lg'] as const

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  argTypes: {
    label: { description: 'Button text', required: false },
    imgSrc: { table: { disable: true } },
    icon: { table: { disable: true } },
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
  render: function Render(args) {
    return <Avatar {...args} />
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
  render: function Render(args) {
    return <Avatar {...args} />
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
    imgSrc: 'https://picsum.photos/id/64/100/100',
  },
  render: function Render(args) {
    return <Avatar {...args} />
  },
}

export default meta

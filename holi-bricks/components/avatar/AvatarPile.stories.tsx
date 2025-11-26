import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { HandHeartThinFilledRaised } from '@holi/icons/src/generated'
import AvatarPile from 'holi-bricks/components/avatar/AvatarPile'
import { Stack } from 'holi-bricks/components/stack'

const availableShapes = ['circle', 'square'] as const
const availableBorders = ['strong', 'light'] as const

const meta: Meta<typeof AvatarPile> = {
  title: 'Components/Avatar/AvatarPile',
  component: AvatarPile,
  args: {
    avatars: [
      {
        label: 'User One',
        source: 'https://picsum.photos/id/64/100/100',
        initials: 'U1',
      },
      {
        label: 'User Two',
        initials: 'U2',
      },
      {
        label: 'User Three',
        initials: 'U3',
      },
    ],
    size: 'md',
    testID: 'holi-user-avatar-pile',
    border: 'light',
    shape: 'circle',
  },
  argTypes: {
    testID: {
      table: { disable: true },
    },
  },
}

type Story = StoryObj<typeof AvatarPile>

export const Default: Story = {
  argTypes: {},
  args: {
    avatars: [
      {
        label: 'User One',
        source: 'https://picsum.photos/id/64/100/100',
        initials: 'U1',
      },
      {
        label: 'User Two',
        initials: 'U2',
      },
      {
        label: 'User Three',
        initials: 'U3',
      },
    ],
    size: 'md',
    testID: 'holi-user-avatar-pile',
    border: 'strong',
    shape: 'circle',
  },
}

export const ByShape: Story = {
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        {availableShapes.map((shape) => (
          <AvatarPile key={shape} {...args} shape={shape} />
        ))}
      </Stack>
    )
  },
}

export const ByBorder: Story = {
  render: function Render(args) {
    return (
      <Stack direction="row" gap="xxs">
        {availableBorders.map((border) => (
          <AvatarPile key={border} {...args} border={border} />
        ))}
      </Stack>
    )
  },
}

export const WithIcon: Story = {
  render: function Render(args) {
    return <AvatarPile {...args} icon={HandHeartThinFilledRaised} />
  },
}

export default meta

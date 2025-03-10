import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { HandHeartThinFilledRaised } from '@holi/icons/src/generated'
import AvatarPile from 'holi-bricks/components/avatar/AvatarPile'
import { View } from 'react-native'

const availableShapes = ['circle', 'square'] as const
const availableBorders = ['strong', 'light'] as const

const meta: Meta<typeof AvatarPile> = {
  title: 'Components/Avatar/AvatarPile',
  component: AvatarPile,
  args: {
    users: [
      {
        id: '1',
        identity: 'user one',
        avatarDefaultColor: 'blue',
        fullName: 'User One',
        avatar: 'https://picsum.photos/id/64/100/100',
        avatarLabel: 'User One',
      },
      {
        id: '2',
        identity: 'user two',
        avatarDefaultColor: 'red',
        fullName: 'User Two',
        avatarLabel: 'User Two',
      },
      {
        id: '3',
        identity: 'user three',
        avatarDefaultColor: 'green',
        fullName: 'User Three',
        avatarLabel: 'User Three',
      },
    ],
    size: 'md',
    testID: 'holi-user-avatar-pile',
    border: 'light',
    shape: 'circle',
  },
}

type Story = StoryObj<typeof AvatarPile>

export const Default: Story = {
  argTypes: {},
  args: {
    users: [
      {
        id: '1',
        identity: 'user one',
        avatarDefaultColor: 'blue',
        fullName: 'User One',
        avatar: 'https://picsum.photos/id/64/100/100',
        avatarLabel: 'User One',
      },
      {
        id: '2',
        identity: 'user two',
        avatarDefaultColor: 'red',
        fullName: 'User Two',
        avatarLabel: 'User Two',
      },
      {
        id: '3',
        identity: 'user three',
        avatarDefaultColor: 'green',
        fullName: 'User Three',
        avatarLabel: 'User Three',
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
      <>
        {availableShapes.map((shape) => (
          <View key={shape} style={{ margin: 6 }}>
            <AvatarPile {...args} shape={shape} />
          </View>
        ))}
      </>
    )
  },
}

export const ByBorder: Story = {
  render: function Render(args) {
    return (
      <>
        {availableBorders.map((border) => (
          <View key={border} style={{ margin: 6 }}>
            <AvatarPile {...args} border={border} />
          </View>
        ))}
      </>
    )
  },
}

export const WithIcon: Story = {
  render: function Render(args) {
    return <AvatarPile {...args} icon={HandHeartThinFilledRaised} />
  },
}

export default meta

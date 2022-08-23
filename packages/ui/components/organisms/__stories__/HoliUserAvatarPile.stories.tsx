import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'

const users = fakeTopics.get('abc').editors

export default {
  title: 'Organisms/HoliUserAvatarPile',
  component: HoliUserAvatarPile,
} as ComponentMeta<typeof HoliUserAvatarPile>

const Template: ComponentStory<typeof HoliUserAvatarPile> = ({ ...args }) => <HoliUserAvatarPile {...args} />

export const Example: ComponentStory<typeof HoliUserAvatarPile> = Template.bind({})

Example.argTypes = {
  users: { description: 'Array of users', required: true, control: { type: 'Array' } },
  usersToShow: {
    description: 'Maximum amount of user avatars to be shown',
    type: 'number',
    control: { type: 'number' },
  },
  size: { description: 'Size description of an avatar' },
  collapse: { description: 'Should the avatars be collapsed', type: 'boolean', control: { type: 'boolean' } },
  counter: {
    description: 'Should a text with the count of users be shown after avatar pile',
    type: 'boolean',
    control: { type: 'boolean' },
  },
}

Example.args = {
  users,
  usersToShow: 5,
  size: 'micro',
  collapse: true,
  counter: false,
}

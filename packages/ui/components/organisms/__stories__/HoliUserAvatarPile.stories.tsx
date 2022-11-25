import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'

import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'

const users = Array.from(' '.repeat(6), (_, idx) => getRandomUser(!(idx % 2)))

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

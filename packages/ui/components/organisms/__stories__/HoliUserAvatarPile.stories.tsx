import { Meta, StoryFn } from '@storybook/react'
import React, { PropsWithChildren } from 'react'
import { View } from 'react-native'

import HoliUserAvatarPile, { type HoliUserAvatarPileProps } from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'
import { colors } from '@holi/ui/styles/globalVars'

const users = Array.from(' '.repeat(6), (_, idx) => getRandomUser(!(idx % 2)))

export default {
  title: 'Organisms/HoliUserAvatarPile',
  component: HoliUserAvatarPile,
} as Meta<typeof HoliUserAvatarPile>

const Template: StoryFn<typeof HoliUserAvatarPile> = ({ ...args }) => (
  <View style={{ backgroundColor: colors.background20, padding: 40 }}>
    <HoliUserAvatarPile {...args} />
  </View>
)

export const Default: StoryFn<typeof HoliUserAvatarPile> = Template.bind({})
export const WithPile: StoryFn<typeof HoliUserAvatarPile> = Template.bind({})

const defaultTypes = {
  users: { description: 'Array of users', required: true, control: { type: 'Array' } },
}

const defaultArgs: Partial<PropsWithChildren<HoliUserAvatarPileProps>> = {
  users,
  usersToShow: 5,
  size: 'micro',
  collapse: true,
}

Default.argTypes = {
  ...defaultTypes,
  usersToShow: {
    description: 'Maximum amount of user avatars to be shown',
    type: 'number',
    control: { type: 'number' },
  },
  size: { description: 'Size description of an avatar' },
  collapse: { description: 'Should the avatars be collapsed', type: 'boolean', control: { type: 'boolean' } },
}

Default.args = { ...defaultArgs }
WithPile.argTypes = {
  ...defaultTypes,
  hasBackground: { description: 'Should the avatars be collapsed', type: 'boolean', control: { type: 'boolean' } },
  collapse: { description: 'Should the avatars be collapsed', type: 'boolean', control: { type: 'boolean' } },
  counter: {
    description: 'Should a text with the count of users be shown after avatar pile',
    type: 'boolean',
    control: { type: 'boolean' },
  },
}
WithPile.args = { ...defaultArgs, hasBackground: true, counter: true }

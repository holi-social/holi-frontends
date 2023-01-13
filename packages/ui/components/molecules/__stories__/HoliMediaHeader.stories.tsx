import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMediaHeader from '@holi/ui/components/molecules/HoliMediaHeader'
import { getRandomUser } from '@holi/ui/helper/fakeUsers'

export default {
  title: 'Molecules/HoliMediaHeader',
  component: HoliMediaHeader,
} as ComponentMeta<typeof HoliMediaHeader>

const Template: ComponentStory<typeof HoliMediaHeader> = ({ ...args }) => {
  return (
    <View style={{ maxWidth: '80%' }}>
      <HoliMediaHeader {...args} />
    </View>
  )
}

export const Primary: ComponentStory<typeof HoliMediaHeader> = Template.bind({})

Primary.argTypes = {
  title: { description: 'Title', type: 'string', control: { type: 'Some title' } },
  boldTitle: { description: 'Title is bold', type: 'boolean' },
}

Primary.args = {
  title: 'Saving the foxes',
  author: getRandomUser(),
  date: '2022-11-18T09:54:31.607520+00:00',
  boldTitle: false,
  children: <HoliText style={{ backgroundColor: 'red' }}>Optional children</HoliText>,
}

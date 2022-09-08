import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'

const tabs = [
  {
    title: 'Profile',
    children: (
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 56,
        }}
      >
        <HoliText style={{ textAlign: 'center', color: '#6F7081' }}>This is my profile.</HoliText>
      </View>
    ),
  },
  {
    title: 'Topics',
    children: (
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 56,
        }}
      >
        <HoliText style={{ textAlign: 'center', color: '#6F7081' }}>These are my topics.</HoliText>
      </View>
    ),
  },
]

export default {
  title: 'Organisms/HoliTabs',
  component: HoliTabs,
} as ComponentMeta<typeof HoliTabs>

const Template: ComponentStory<typeof HoliTabs> = ({ ...args }) => <HoliTabs {...args} />

export const Primary: ComponentStory<typeof HoliTabs> = Template.bind({})

Primary.argTypes = {
  id: { description: 'unique ID to identify tabs and child elements', control: false },
  tabs: { description: 'Tabs information with title and children', control: false },
  relativeHeight: { description: 'Relative height of modal', type: 'number', control: { type: 'number' } },
}

Primary.args = {
  id: 'story-tabs',
  tabs,
  relativeHeight: 0.75,
}

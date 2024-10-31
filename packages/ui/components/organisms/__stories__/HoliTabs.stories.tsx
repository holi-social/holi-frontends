import { ComponentMeta, ComponentStory } from '@storybook/react'
import React, { useState } from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'

const tabs = [
  {
    key: 'profile',
    tabTitle: 'Profile',
    content: () => (
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
    key: 'insights',
    tabTitle: 'Insights',
    content: () => (
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 56,
        }}
      >
        <HoliText style={{ textAlign: 'center', color: '#6F7081' }}>These are my insights.</HoliText>
      </View>
    ),
  },
]

export default {
  title: 'Organisms/HoliTabs',
  component: HoliTabs,
} as ComponentMeta<typeof HoliTabs>

const Template: ComponentStory<typeof HoliTabs> = ({ ...args }) => {
  const [activeTab, setActiveTab] = useState('profile')
  return <HoliTabs {...args} activeTab={activeTab} onChange={setActiveTab} />
}

export const Primary: ComponentStory<typeof HoliTabs> = Template.bind({})

Primary.argTypes = {
  data: { description: 'Tab item data information with mandatory "tabTitle" property', control: false },
  keyExtractor: { description: 'Function to extract the key from the data item', control: false },
  renderTabButton: { description: 'Optional function to render the tab button', control: false },
  renderTabContent: { description: 'Function to render the tab content', control: false },
  activeTab: { description: 'The key of the active tab', control: false },
  onChange: { description: 'Function to handle the tab change', control: false },
  centeredTabButtons: { description: 'Whether the tab buttons should be centered', control: false },
  backgroundColor: { description: 'Background color of the tabs', control: false },
  testID: { description: 'Test ID for the tabs component', control: false },
}

Primary.args = {
  data: tabs,
  keyExtractor: (item) => item.tabTitle,
  renderTabContent: ({ item }) => item.content(),
  activeTab: 'profile',
  onChange: () => {
    null
  },
  testID: 'story-tabs',
}

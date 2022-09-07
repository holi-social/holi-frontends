import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'
import renderer from 'react-test-renderer'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'

const tabs = [
  {
    title: 'Profile',
    children: (
      <View>
        <HoliText testID="profileTab">This is my profile.</HoliText>
      </View>
    ),
  },
  {
    title: 'Topics',
    children: (
      <View>
        <HoliText testID="topicsTab">These are my topics.</HoliText>
      </View>
    ),
  },
]

describe('renders correctly', () => {
  it('renders correctly when open', () => {
    const tree = renderer.create(<HoliTabs tabs={tabs} id="test-tabs" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('displays the tab buttons correctly', () => {
  it('displays all tab buttons', () => {
    const testRenderer = renderer.create(<HoliTabs tabs={tabs} id="test-tabs" />)
    const holiTabsInstance = testRenderer.root
    const buttonInstances = holiTabsInstance.findAllByType(HoliButton)

    expect(buttonInstances.length).toBe(tabs.length)
  })

  it('initializes with the first tab button active', () => {
    const testRenderer = renderer.create(<HoliTabs tabs={tabs} id="test-tabs" testID="test-tabs" />)
    const holiTabsInstance = testRenderer.root

    expect(holiTabsInstance.findByProps({ testID: 'test-tabs-button-0-active' })).toBeDefined
    expect(holiTabsInstance.findByProps({ testID: 'test-tabs-button-1-inactive' })).toBeDefined
    expect(holiTabsInstance.findByProps({ testID: 'test-tabs-panel-0-active' })).toBeDefined
  })

  it('activates the correct tab button upon click', () => {
    const testRenderer = renderer.create(<HoliTabs tabs={tabs} id="test-tabs" testID="test-tabs" />)
    const holiTabsInstance = testRenderer.root

    fireEvent.press(holiTabsInstance.findByProps({ testID: 'test-tabs-button-1-inactive' }))

    expect(holiTabsInstance.findByProps({ testID: 'test-tabs-button-0-inactive' })).toBeDefined
    expect(holiTabsInstance.findByProps({ testID: 'test-tabs-button-1-active' })).toBeDefined
    expect(holiTabsInstance.findByProps({ testID: 'test-tabs-panel-1-active' })).toBeDefined
  })
})

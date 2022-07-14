import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'
import renderer from 'react-test-renderer'

import HoliButton from '@holi/ui/components/HoliButton'
import HoliTabs from '@holi/ui/components/HoliTabs'
import HoliText from '@holi/ui/components/HoliText'

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
    const tree = renderer.create(<HoliTabs tabs={tabs}></HoliTabs>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe('displays the tab buttons correctly', () => {
  it('displays all tab buttons', () => {
    const testRenderer = renderer.create(<HoliTabs tabs={tabs} />)
    const holiTabsInstance = testRenderer.root
    const buttonInstances = holiTabsInstance.findAllByType(HoliButton)

    expect(buttonInstances.length).toBe(tabs.length)
  })

  it('initializes with the first tab button disabled (active)', () => {
    const testRenderer = renderer.create(<HoliTabs tabs={tabs} />)
    const holiTabsInstance = testRenderer.root
    const buttonInstances = holiTabsInstance.findAllByType(HoliButton)

    expect(buttonInstances[0].props.disabled).toBeTruthy()
    expect(buttonInstances[1].props.disabled).toBeFalsy()
  })

  it('activates the correct tab button upon click', () => {
    const testRenderer = renderer.create(<HoliTabs tabs={tabs} />)
    const holiTabsInstance = testRenderer.root
    const buttonInstances = holiTabsInstance.findAllByType(HoliButton)

    fireEvent.press(buttonInstances[1])

    expect(buttonInstances[0].props.disabled).toBeFalsy()
    expect(buttonInstances[1].props.disabled).toBeTruthy()
  })
})

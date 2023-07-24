import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Animated, ScrollView, View } from 'react-native'
import renderer from 'react-test-renderer'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabButton from '@holi/ui/components/molecules/HoliTabButton'
import { useStepper } from '@holi/ui/components/organisms/HoliStepper'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'

const TABS_ID = 'test-tabs'
interface TestTabContent extends React.PropsWithChildren {
  index: number
}
const TestTabContent: React.FC<TestTabContent> = ({ index, children }) => {
  const { currentStep } = useStepper()
  return <View testID={`${TABS_ID}-panel-${index}-${currentStep === index ? 'active' : 'inactive'}`}>{children}</View>
}

const tabs = [
  {
    title: 'Profile',
    children: (
      <TestTabContent index={0}>
        <HoliText testID="profileTab">This is my profile.</HoliText>
      </TestTabContent>
    ),
  },
  {
    title: 'Insights',
    children: (
      <TestTabContent index={1}>
        <HoliText testID="InsightsTab">These are my insights.</HoliText>
      </TestTabContent>
    ),
  },
  {
    title: 'Spaces',
    children: (
      <TestTabContent index={2}>
        <HoliText testID="SpacesTab">These are my spaces.</HoliText>
      </TestTabContent>
    ),
  },
]

beforeEach(() => {
  jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
    const time = Date.now()
    cb(time)

    return time
  })
})

afterEach(() => {
  // @ts-ignore
  window.requestAnimationFrame.mockRestore()
  jest.clearAllTimers()
})

describe('HoliTabs', () => {
  describe('renders correctly', () => {
    beforeEach(() => {
      // Animated.ScrollView can not be serialized for snapshot tests, using
      // "normal" ScrollView instead
      // @ts-ignore
      jest.spyOn(Animated, 'ScrollView', 'get').mockImplementation(() => ScrollView)
    })

    it.only('renders correctly when open', () => {
      const tree = renderer.create(<HoliTabs tabs={tabs} id={TABS_ID} />).toJSON()
      expect(tree).toMatchSnapshot()
    })
  })

  describe('displays the tab buttons correctly', () => {
    it('displays all tab buttons', () => {
      const testRenderer = renderer.create(<HoliTabs tabs={tabs} id={TABS_ID} />)
      const holiTabsInstance = testRenderer.root
      const buttonInstances = holiTabsInstance.findAllByType(HoliTabButton)

      expect(buttonInstances.length).toBe(tabs.length)
    })

    it('initializes with the first tab button active', () => {
      const testRenderer = renderer.create(<HoliTabs tabs={tabs} id={TABS_ID} testID={TABS_ID} />)
      const holiTabsInstance = testRenderer.root

      expect(holiTabsInstance.findByProps({ testID: 'test-tabs-button-0-active' })).toBeDefined()
      expect(holiTabsInstance.findByProps({ testID: 'test-tabs-button-1-inactive' })).toBeDefined()
      expect(holiTabsInstance.findByProps({ testID: 'test-tabs-panel-0-active' })).toBeDefined()
    })

    it('activates the correct tab button upon click', async () => {
      const testRenderer = renderer.create(<HoliTabs tabs={tabs} id={TABS_ID} testID={TABS_ID} />)
      const holiTabsInstance = testRenderer.root

      await fireEvent.press(holiTabsInstance.findByProps({ testID: 'test-tabs-button-1-inactive' }))

      expect(holiTabsInstance.findByProps({ testID: 'test-tabs-button-0-inactive' })).toBeDefined()
      expect(holiTabsInstance.findByProps({ testID: 'test-tabs-button-1-active' })).toBeDefined()
    })
  })
})

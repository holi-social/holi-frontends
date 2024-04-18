import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
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

describe('HoliTabs', () => {
  describe('renders correctly', () => {
    it('renders correctly when open', () => {
      render(<HoliTabs tabs={tabs} id={TABS_ID} />)

      expect(screen.getByTestId('profileTab')).toBeVisible()
      expect(screen.getByText('Profile')).toBeVisible()

      expect(screen.getByTestId('InsightsTab')).toBeVisible()
      expect(screen.getByText('Insights')).toBeVisible()

      expect(screen.getByTestId('SpacesTab')).toBeVisible()
      expect(screen.getByText('Spaces')).toBeVisible()
    })
  })

  describe('displays the tab buttons correctly', () => {
    it('displays all tab buttons', () => {
      render(<HoliTabs tabs={tabs} id={TABS_ID} />)
      expect(screen.getAllByTestId('tab-button-tab')).toHaveLength(tabs.length)
    })

    it('initializes with the first tab button active', () => {
      render(<HoliTabs tabs={tabs} id={TABS_ID} testID={TABS_ID} />)

      expect(screen.getByTestId('test-tabs-button-0-active')).toBeVisible()
      expect(screen.getByTestId('test-tabs-button-1-inactive')).toBeVisible()
      expect(screen.getByTestId('test-tabs-panel-0-active')).toBeVisible()
    })

    it('activates the correct tab button upon click', () => {
      render(<HoliTabs tabs={tabs} id={TABS_ID} testID={TABS_ID} />)

      expect(screen.getByTestId('test-tabs-button-0-active')).toBeVisible()
      expect(screen.getByTestId('test-tabs-button-1-inactive')).toBeVisible()

      fireEvent.press(screen.getByTestId('test-tabs-button-1-inactive'))

      expect(screen.getByTestId('test-tabs-button-0-inactive')).toBeVisible()
      expect(screen.getByTestId('test-tabs-button-1-active')).toBeVisible()
    })
  })
})

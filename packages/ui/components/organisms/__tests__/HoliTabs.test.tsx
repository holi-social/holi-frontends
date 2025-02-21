import { fireEvent, render, screen, userEvent } from '@testing-library/react-native'
import React, { type PropsWithChildren, useState } from 'react'
import { View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliTabs from '@holi/ui/components/organisms/HoliTabs'
import type { HoliTabItem, RenderFuncOptions } from '@holi/ui/components/organisms/HoliTabs/types'

const TABS_ID = 'test-tabs'

const TestTabContent = ({ index, isActive, children }: PropsWithChildren<RenderFuncOptions<HoliTabItem>>) => {
  return <View testID={`${TABS_ID}-panel-${index}-${isActive ? 'active' : 'inactive'}`}>{children}</View>
}

interface Tab extends HoliTabItem {
  key: string
  content: (options: RenderFuncOptions<HoliTabItem>) => JSX.Element
}

const tabs: Tab[] = [
  {
    key: 'profile',
    tabTitle: 'Profile',
    content: (options) => (
      <TestTabContent {...options}>
        <HoliText testID="profileTab">This is my profile.</HoliText>
      </TestTabContent>
    ),
  },
  {
    key: 'insights',
    tabTitle: 'Insights',
    content: (options) => (
      <TestTabContent {...options}>
        <HoliText testID="InsightsTab">These are my insights.</HoliText>
      </TestTabContent>
    ),
  },
  {
    key: 'spaces',
    tabTitle: 'Spaces',
    content: (options) => (
      <TestTabContent {...options}>
        <HoliText testID="SpacesTab">These are my spaces.</HoliText>
      </TestTabContent>
    ),
  },
]

const HoliTabsWrapper = () => {
  const [activeTab, setActiveTab] = useState('profile')

  return (
    <HoliTabs
      data={tabs}
      keyExtractor={({ key }) => key}
      renderTabContent={(options) => options.item.content(options)}
      activeTab={activeTab}
      onChange={setActiveTab}
    />
  )
}

describe('HoliTabs', () => {
  describe('renders correctly', () => {
    it('renders correctly when open', async () => {
      render(<HoliTabsWrapper />)

      expect(screen.getByTestId('profileTab')).toBeVisible()
      expect(screen.getByText('Profile')).toBeVisible()

      await userEvent.press(screen.getByRole('tab', { name: 'Insights' }))
      expect(await screen.findByTestId('InsightsTab')).toBeVisible()
      expect(screen.getByText('Insights')).toBeVisible()

      await userEvent.press(screen.getByRole('tab', { name: 'Spaces' }))
      expect(screen.getByTestId('SpacesTab')).toBeVisible()
      expect(screen.getByText('Spaces')).toBeVisible()
    })
  })

  describe('displays the tab buttons correctly', () => {
    it('displays all tab buttons', () => {
      render(
        <HoliTabs
          data={tabs}
          keyExtractor={({ key }) => key}
          renderTabContent={(options) => options.item.content(options)}
          activeTab="profile"
          onChange={() => {}}
        />
      )
      expect(screen.getAllByTestId('tab-button-tab')).toHaveLength(tabs.length)
    })

    it('initializes with the first tab button active', () => {
      render(
        <HoliTabs
          data={tabs}
          keyExtractor={({ key }) => key}
          renderTabContent={(options) => options.item.content(options)}
          activeTab="profile"
          onChange={() => {}}
          testID={TABS_ID}
        />
      )

      expect(screen.getByTestId(`test-tabs-button-${tabs[0].key}-active`)).toBeVisible()
      expect(screen.getByTestId(`test-tabs-button-${tabs[1].key}-inactive`)).toBeVisible()
    })

    it('activates the correct tab button upon click', async () => {
      const onChangeHandler = jest.fn()
      render(
        <HoliTabs
          data={tabs}
          keyExtractor={({ key }) => key}
          renderTabContent={(options) => options.item.content(options)}
          activeTab="profile"
          onChange={onChangeHandler}
          testID={TABS_ID}
        />
      )

      expect(screen.getByTestId(`test-tabs-button-${tabs[0].key}-active`)).toBeVisible()
      expect(screen.getByTestId(`test-tabs-button-${tabs[1].key}-inactive`)).toBeVisible()

      await fireEvent.press(screen.getByTestId(`test-tabs-button-${tabs[1].key}-inactive`))

      expect(onChangeHandler).toHaveBeenCalledWith(tabs[1].key)
    })
  })
})

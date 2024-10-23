import { mockPlatformOS, setupPlatformOSMock } from '@holi/core/helpers/__mocks__/mockPlatformOS'

import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import {
  FirstVisitOnboardingSelection,
  FirstVisitOnboardingSelectionOption,
} from '@holi/core/screens/onboarding/components/FirstVisitOnboardingSelection'

describe('FirstVisitOnboardingSelection', () => {
  setupPlatformOSMock()
  const onSelect = jest.fn()
  const step = 'SMALL_ACTIONS'
  const options: FirstVisitOnboardingSelectionOption[] = [
    {
      mobileOnly: true,
      id: 'CHALLENGES',
    },
    { id: 'DISCUSS' },
    { id: 'DONATIONS' },
    { id: 'SPACES' },
  ]

  it('should render step with options', () => {
    render(<FirstVisitOnboardingSelection onSelect={onSelect} step={step} options={options} />)

    expect(screen.queryByTestId('option-CHALLENGES')).toBeTruthy()
    expect(screen.queryByTestId('option-DISCUSS')).toBeTruthy()
    expect(screen.queryByTestId('option-DONATIONS')).toBeTruthy()
    expect(screen.queryByTestId('option-SPACES')).toBeTruthy()

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should filter mobile only options on web', () => {
    mockPlatformOS('web')

    render(<FirstVisitOnboardingSelection onSelect={onSelect} step={step} options={options} />)

    expect(screen.queryByTestId('option-CHALLENGES')).toBeFalsy()
  })

  it('should handle initial option selection', () => {
    render(
      <FirstVisitOnboardingSelection onSelect={onSelect} step={step} options={options} initialSelection="DONATIONS" />
    )

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should call onSelect callback on option selection', () => {
    render(<FirstVisitOnboardingSelection onSelect={onSelect} step={step} options={options} />)

    fireEvent.press(screen.getByTestId('option-DONATIONS'))

    expect(onSelect).toHaveBeenCalledWith('DONATIONS')
  })
})

import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'
import { Platform } from 'react-native'

import {
  FirstVisitOnboardingSelectionOption,
  FirstVisitOnboardingStep,
} from '@holi/core/screens/onboarding/components/FirstVisitOnboardingStep'

describe('FirstVisitOnboardingStep', () => {
  const originalOS = Platform.OS
  const mockPlatformOS = jest.fn()
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

  beforeEach(() => {
    Object.defineProperty(Platform, 'OS', {
      get: mockPlatformOS,
    })
  })

  afterAll(() => {
    Object.defineProperty(Platform, 'OS', {
      get: () => originalOS,
    })
  })

  it('should render step with options', () => {
    render(<FirstVisitOnboardingStep onSelect={onSelect} step={step} options={options} />)

    expect(screen.queryByTestId('option-CHALLENGES')).toBeTruthy()
    expect(screen.queryByTestId('option-DISCUSS')).toBeTruthy()
    expect(screen.queryByTestId('option-DONATIONS')).toBeTruthy()
    expect(screen.queryByTestId('option-SPACES')).toBeTruthy()

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should filter mobile only options on web', () => {
    mockPlatformOS.mockReturnValue('web')

    render(<FirstVisitOnboardingStep onSelect={onSelect} step={step} options={options} />)

    expect(screen.queryByTestId('option-CHALLENGES')).toBeFalsy()
  })

  it('should handle initial option selection', () => {
    render(<FirstVisitOnboardingStep onSelect={onSelect} step={step} options={options} initialSelection="DONATIONS" />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should render step without options', () => {
    render(<FirstVisitOnboardingStep onSelect={onSelect} step={step} />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should render step headline and description', () => {
    render(<FirstVisitOnboardingStep onSelect={onSelect} step={step} />)

    expect(screen.findByText('onboarding.firstVisit.SMALL_ACTIONS.heading')).toBeTruthy()
    expect(screen.findByText('onboarding.firstVisit.SMALL_ACTIONS.description')).toBeTruthy()
  })

  it('should render step with description about headline', () => {
    render(<FirstVisitOnboardingStep onSelect={onSelect} step={step} descriptionAbove />)

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('should call onSelect callback on option selection', () => {
    render(<FirstVisitOnboardingStep onSelect={onSelect} step={step} options={options} />)

    fireEvent.press(screen.getByTestId('option-DONATIONS'))

    expect(onSelect).toHaveBeenCalledWith('DONATIONS')
  })
})

import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { FirstVisitOnboardingSelectionOption } from '@holi/core/screens/onboarding/components/FirstVisitOnboardingSelection'
import { FirstVisitOnboardingStep } from '@holi/core/screens/onboarding/components/FirstVisitOnboardingStep'

describe('FirstVisitOnboardingStep', () => {
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
    render(<FirstVisitOnboardingStep onSelect={onSelect} step={step} options={options} />)

    expect(screen.queryByTestId('option-CHALLENGES')).toBeTruthy()
    expect(screen.queryByTestId('option-DISCUSS')).toBeTruthy()
    expect(screen.queryByTestId('option-DONATIONS')).toBeTruthy()
    expect(screen.queryByTestId('option-SPACES')).toBeTruthy()

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

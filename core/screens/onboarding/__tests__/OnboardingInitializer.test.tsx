import { useOnboardingInitialization, useOnboardingRedirect } from '@holi/core/screens/onboarding/hooks/onboardingState'
import OnboardingInitializer from '@holi/core/screens/onboarding/OnboardingInitializer'
import { render } from '@testing-library/react-native'
import React from 'react'

const mockUseOnboardingInitialization = useOnboardingInitialization as jest.Mock
const mockUseOnboardingRedirect = useOnboardingRedirect as jest.Mock
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  useOnboardingInitialization: jest.fn(),
  useOnboardingRedirect: jest.fn(),
}))

describe('OnboardingInitializer', () => {
  it('should initialize onboarding', () => {
    render(<OnboardingInitializer />)

    expect(mockUseOnboardingInitialization).toHaveBeenCalled()
  })

  it('should redirect to onboarding', () => {
    render(<OnboardingInitializer />)

    expect(mockUseOnboardingRedirect).toHaveBeenCalled()
  })
})

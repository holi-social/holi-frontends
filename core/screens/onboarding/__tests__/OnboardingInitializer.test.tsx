import { useOnboardingInitialization, useOnboardingRedirect } from '@holi/core/screens/onboarding/hooks/onboardingState'
import OnboardingInitializer from '@holi/core/screens/onboarding/OnboardingInitializer'
import { render, screen } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text'
import React from 'react'

const mockUseOnboardingInitialization = useOnboardingInitialization as jest.Mock
const mockUseOnboardingRedirect = useOnboardingRedirect as jest.Mock
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  useOnboardingInitialization: jest.fn(),
  useOnboardingRedirect: jest.fn(),
}))

describe('OnboardingInitializer', () => {
  beforeEach(() => {
    mockUseOnboardingInitialization.mockReturnValue({ isLoading: false })
    mockUseOnboardingRedirect.mockReturnValue({ showOnboardingOnStartup: false })
  })

  it('should initialize onboarding', () => {
    render(
      <OnboardingInitializer>
        <Text size="md">child</Text>
      </OnboardingInitializer>
    )

    expect(mockUseOnboardingInitialization).toHaveBeenCalled()
  })

  it('should redirect to onboarding', () => {
    render(
      <OnboardingInitializer>
        <Text size="md">child</Text>
      </OnboardingInitializer>
    )

    expect(mockUseOnboardingRedirect).toHaveBeenCalled()
  })

  it('should not render children while onboarding is initializing', () => {
    mockUseOnboardingInitialization.mockReturnValue({ isLoading: true })
    render(
      <OnboardingInitializer>
        <Text size="md">child</Text>
      </OnboardingInitializer>
    )

    expect(screen.queryByText('child')).not.toBeOnTheScreen()
  })

  it('should not render children while redirecting to onboarding', () => {
    mockUseOnboardingRedirect.mockReturnValue({ showOnboardingOnStartup: true })
    render(
      <OnboardingInitializer>
        <Text size="md">child</Text>
      </OnboardingInitializer>
    )

    expect(screen.queryByText('child')).not.toBeOnTheScreen()
  })

  it('should render children if onboarding is not required', () => {
    render(
      <OnboardingInitializer>
        <Text size="md">child</Text>
      </OnboardingInitializer>
    )

    expect(screen.getByText('child')).toBeOnTheScreen()
  })
})

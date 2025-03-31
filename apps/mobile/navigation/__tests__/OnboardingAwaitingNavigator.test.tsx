import React from 'react'
import { useOnboardingInitialization, useOnboardingRedirect } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { OnboardingAwaitingNavigator } from '@holi/mobile/navigation/OnboardingAwaitingNavigator'
import { render, screen } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text'
import type { RootNavigatorProps } from '@holi/mobile/navigation/RootNavigator'

const mockUseOnboardingInitialization = jest.mocked(useOnboardingInitialization)
const mockUseOnboardingRedirect = jest.mocked(useOnboardingRedirect)
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  useOnboardingInitialization: jest.fn(),
  useOnboardingRedirect: jest.fn(),
}))

const MockedRootNavigator = ({ showOnboardingOnStartup }: RootNavigatorProps) => (
  <Text size="md">{showOnboardingOnStartup ? 'onboarding' : 'something else'}</Text>
)

jest.mock('@holi/mobile/navigation/RootNavigator', () => ({
  RootNavigator: (props: RootNavigatorProps) => MockedRootNavigator(props),
}))

describe('OnboardingAwaitingNavigator', () => {
  const mockIsInitializing = () => {
    mockUseOnboardingInitialization.mockReturnValue({
      isLoading: true,
      onboardingState: null,
    })
  }
  const mockFinishedInitialization = () => {
    mockUseOnboardingInitialization.mockReturnValue({
      isLoading: false,
      onboardingState: 'finished',
    })
  }

  beforeEach(() => {
    mockFinishedInitialization()
    mockUseOnboardingRedirect.mockReturnValue({
      showOnboardingOnStartup: false,
    })
  })

  it('should render null while onboarding is initializing', () => {
    mockIsInitializing()

    render(<OnboardingAwaitingNavigator onReady={jest.fn()} />)

    expect(screen.toJSON()).toBeNull()
  })

  it('should call onReady when onboarding is initialized', () => {
    const onReadyMock = jest.fn()

    render(<OnboardingAwaitingNavigator onReady={onReadyMock} />)

    expect(onReadyMock).toHaveBeenCalled()
  })

  it('should call onReady callback only once', () => {
    const onReadyMock = jest.fn()

    // Onboarding initialized > onReady called
    mockFinishedInitialization()

    const { rerender } = render(<OnboardingAwaitingNavigator onReady={onReadyMock} />)

    expect(onReadyMock).toHaveBeenCalled()

    // Onboarding re-initializing > no call
    onReadyMock.mockClear()
    mockIsInitializing()

    rerender(<OnboardingAwaitingNavigator onReady={onReadyMock} />)

    expect(onReadyMock).not.toHaveBeenCalled()

    // Onboarding re-initialized > no call
    mockFinishedInitialization()

    rerender(<OnboardingAwaitingNavigator onReady={onReadyMock} />)

    expect(onReadyMock).not.toHaveBeenCalled()
  })

  it('should not render null again after initialized once', () => {
    // First render: initializing > null
    mockIsInitializing()

    const { rerender } = render(<OnboardingAwaitingNavigator onReady={jest.fn()} />)

    expect(screen.toJSON()).toBeNull()

    // Second render: finish initialization > RootNavigator
    mockFinishedInitialization()

    rerender(<OnboardingAwaitingNavigator onReady={jest.fn()} />)

    expect(screen.getByText('something else')).toBeTruthy()

    // Third render: re-initializing > RootNavigator
    mockIsInitializing()

    rerender(<OnboardingAwaitingNavigator onReady={jest.fn()} />)

    expect(screen.getByText('something else')).toBeTruthy()
  })

  it('should render RootNavigator once onboarding is initialized', () => {
    render(<OnboardingAwaitingNavigator onReady={jest.fn()} />)

    expect(screen.getByText('something else')).toBeTruthy()
  })

  it('should pass truthy showOnboarding prop to RootNavigator if onboarding is required', () => {
    mockUseOnboardingRedirect.mockReturnValue({
      showOnboardingOnStartup: true,
    })

    render(<OnboardingAwaitingNavigator onReady={jest.fn()} />)

    expect(screen.getByText('onboarding')).toBeTruthy()
  })

  it('should pass falsy showOnboarding prop to RootNavigator if onboarding is not required', () => {
    render(<OnboardingAwaitingNavigator onReady={jest.fn()} />)

    expect(screen.getByText('something else')).toBeTruthy()
  })
})

import React from 'react'
import { useOnboardingInitialization, useOnboardingRedirect } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { OnboardingAwaitingNavigator } from '@holi/mobile/navigation/OnboardingAwaitingNavigator'
import { render, screen, act } from '@testing-library/react-native'
import { Text } from 'holi-bricks/components/text'
import type { RootNavigatorProps } from '@holi/mobile/navigation/RootNavigator'
import { initNotifications } from '@holi/mobile/notifications/initNotifications'

const mockUseOnboardingInitialization = jest.mocked(useOnboardingInitialization)
const mockUseOnboardingRedirect = jest.mocked(useOnboardingRedirect)
const mockInitNotifications = jest.mocked(initNotifications)

jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  useOnboardingInitialization: jest.fn(),
  useOnboardingRedirect: jest.fn(),
}))

jest.mock('@holi/mobile/notifications/initNotifications', () => ({
  initNotifications: jest.fn().mockResolvedValue(undefined),
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
  const mockFinishedInitialization = (onboardingState: 'finished' | 'onboarding' | null = 'finished') => {
    mockUseOnboardingInitialization.mockReturnValue({
      isLoading: false,
      onboardingState,
    })
  }

  beforeEach(() => {
    mockFinishedInitialization()
    mockUseOnboardingRedirect.mockReturnValue({
      showOnboardingOnStartup: false,
    })
    mockInitNotifications.mockClear()
    // Ensure initNotifications always returns a resolved promise
    mockInitNotifications.mockResolvedValue(undefined)
  })

  it('should render null while onboarding is initializing', () => {
    mockIsInitializing()

    render(<OnboardingAwaitingNavigator onReady={jest.fn()} />)

    expect(screen.toJSON()).toBeNull()
    expect(mockInitNotifications).not.toHaveBeenCalled()
  })

  it('should call onReady when onboarding is initialized', async () => {
    const onReadyMock = jest.fn().mockResolvedValue(true)

    render(<OnboardingAwaitingNavigator onReady={onReadyMock} />)

    expect(onReadyMock).toHaveBeenCalled()
    expect(mockInitNotifications).toHaveBeenCalledTimes(1)
  })

  it('should call onReady callback only once', async () => {
    const onReadyMock = jest.fn().mockResolvedValue(true)

    // Onboarding initialized > onReady called and initNotifications called
    mockFinishedInitialization()

    const { rerender } = render(<OnboardingAwaitingNavigator onReady={onReadyMock} />)

    expect(onReadyMock).toHaveBeenCalled()
    expect(mockInitNotifications).toHaveBeenCalledTimes(1)

    // Wait for any pending promises
    await act(async () => {
      await Promise.resolve()
    })

    // Onboarding re-initializing > no call to onReady or initNotifications
    onReadyMock.mockClear()
    mockInitNotifications.mockClear()
    mockIsInitializing()

    rerender(<OnboardingAwaitingNavigator onReady={onReadyMock} />)

    expect(onReadyMock).not.toHaveBeenCalled()
    expect(mockInitNotifications).not.toHaveBeenCalled()

    // Onboarding re-initialized > no call to onReady or initNotifications again
    mockFinishedInitialization()

    rerender(<OnboardingAwaitingNavigator onReady={onReadyMock} />)

    expect(onReadyMock).not.toHaveBeenCalled()

    // Wait for any pending promises
    await act(async () => {
      await Promise.resolve()
    })

    // initNotifications should not be called again due to notificationsInitialized state
    expect(mockInitNotifications).not.toHaveBeenCalled()
  })

  it('should not render null again after initialized once', async () => {
    // First render: initializing > null
    mockIsInitializing()

    const { rerender } = render(<OnboardingAwaitingNavigator onReady={jest.fn().mockResolvedValue(true)} />)

    expect(screen.toJSON()).toBeNull()
    expect(mockInitNotifications).not.toHaveBeenCalled()

    // Second render: finish initialization > RootNavigator and initNotifications
    mockFinishedInitialization()

    rerender(<OnboardingAwaitingNavigator onReady={jest.fn().mockResolvedValue(true)} />)

    expect(screen.getByText('something else')).toBeTruthy()
    expect(mockInitNotifications).toHaveBeenCalledTimes(1)

    // Wait for any pending promises
    await act(async () => {
      await Promise.resolve()
    })

    // Third render: re-initializing > RootNavigator, but no new initNotifications call
    mockIsInitializing()
    mockInitNotifications.mockClear()

    rerender(<OnboardingAwaitingNavigator onReady={jest.fn().mockResolvedValue(true)} />)

    expect(screen.getByText('something else')).toBeTruthy()
    expect(mockInitNotifications).not.toHaveBeenCalled()
  })

  it('should render RootNavigator once onboarding is initialized and call initNotifications', async () => {
    render(<OnboardingAwaitingNavigator onReady={jest.fn().mockResolvedValue(true)} />)

    expect(screen.getByText('something else')).toBeTruthy()
    expect(mockInitNotifications).toHaveBeenCalledTimes(1)

    // Wait for any pending promises
    await act(async () => {
      await Promise.resolve()
    })
  })

  it('should call initNotifications only when onboardingState is "finished"', async () => {
    // Case 1: onboardingState is null (initializing)
    mockUseOnboardingInitialization.mockReturnValue({
      isLoading: true,
      onboardingState: null,
    })
    render(<OnboardingAwaitingNavigator onReady={jest.fn().mockResolvedValue(true)} />)
    expect(mockInitNotifications).not.toHaveBeenCalled()
    screen.unmount()
    mockInitNotifications.mockClear()

    // Case 2: onboardingState is 'onboarding'
    mockUseOnboardingInitialization.mockReturnValue({
      isLoading: false,
      onboardingState: 'onboarding',
    })
    render(<OnboardingAwaitingNavigator onReady={jest.fn().mockResolvedValue(true)} />)
    expect(mockInitNotifications).not.toHaveBeenCalled()
    screen.unmount()
    mockInitNotifications.mockClear()

    // Case 3: onboardingState is 'finished'
    mockUseOnboardingInitialization.mockReturnValue({
      isLoading: false,
      onboardingState: 'finished',
    })
    render(<OnboardingAwaitingNavigator onReady={jest.fn().mockResolvedValue(true)} />)
    expect(mockInitNotifications).toHaveBeenCalledTimes(1)

    // Wait for any pending promises
    await act(async () => {
      await Promise.resolve()
    })

    screen.unmount()
  })

  it('should call initNotifications only once even if re-rendered with finished state', async () => {
    mockUseOnboardingInitialization.mockReturnValue({
      isLoading: false,
      onboardingState: 'finished',
    })
    const { rerender } = render(<OnboardingAwaitingNavigator onReady={jest.fn().mockResolvedValue(true)} />)
    expect(mockInitNotifications).toHaveBeenCalledTimes(1)

    // Wait for any pending promises to resolve the first initNotifications call
    await act(async () => {
      await Promise.resolve()
    })

    // Rerender with the same finished state
    mockInitNotifications.mockClear() // Clear mock to verify it's not called again
    rerender(<OnboardingAwaitingNavigator onReady={jest.fn().mockResolvedValue(true)} />)

    // Wait for any pending promises
    await act(async () => {
      await Promise.resolve()
    })

    expect(mockInitNotifications).not.toHaveBeenCalled() // Should not be called again
  })

  it('should pass truthy showOnboarding prop to RootNavigator if onboarding is required', () => {
    mockUseOnboardingRedirect.mockReturnValue({
      showOnboardingOnStartup: true,
    })
    mockUseOnboardingInitialization.mockReturnValue({
      isLoading: false,
      onboardingState: 'onboarding',
    })

    render(<OnboardingAwaitingNavigator onReady={jest.fn().mockResolvedValue(true)} />)

    expect(screen.getByText('onboarding')).toBeTruthy()
    expect(mockInitNotifications).not.toHaveBeenCalled()
  })

  it('should pass falsy showOnboarding prop to RootNavigator if onboarding is not required', async () => {
    render(<OnboardingAwaitingNavigator onReady={jest.fn().mockResolvedValue(true)} />)

    expect(screen.getByText('something else')).toBeTruthy()
    expect(mockInitNotifications).toHaveBeenCalledTimes(1)

    // Wait for any pending promises
    await act(async () => {
      await Promise.resolve()
    })
  })
})

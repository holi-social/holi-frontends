import React from 'react'
import AnonymousProfileView from '@holi/core/screens/userprofile/components/AnonymousProfileView'
import { renderRouter, screen, fireEvent, waitFor } from 'expo-router/testing-library'
import { clearGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'
import { clearOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { Text } from 'react-native'

const mockIsProduction = jest.fn()
jest.mock('@holi/core/helpers/environment', () => ({
  get isProduction() {
    return mockIsProduction()
  },
}))

const mockClearGuestMode = clearGuestMode as jest.Mock
jest.mock('@holi/core/screens/onboarding/helpers/guestModeStorage', () => ({
  clearGuestMode: jest.fn(),
}))

const mockClearOnboardingState = clearOnboardingState as jest.Mock
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => ({
  clearOnboardingState: jest.fn(),
}))

const mockUseFeatureFlag = jest.mocked(useFeatureFlag)
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: jest.fn(),
}))

describe('AnonymousProfileView', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockUseFeatureFlag.mockReturnValue([false, {}])
    mockIsProduction.mockReturnValue(false)
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should not display button to reset onboarding state in production', () => {
    mockIsProduction.mockReturnValue(true)

    renderRouter({ index: () => <AnonymousProfileView /> })

    expect(screen.queryByText('profile.settings.resetOnboardingState.title')).not.toBeOnTheScreen()
  })

  it('should display button to reset onboarding state in development', () => {
    renderRouter({ index: () => <AnonymousProfileView /> })

    expect(screen.getByText('profile.settings.resetOnboardingState.title')).toBeOnTheScreen()
  })

  it('should fully reset onboarding state and redirect to home when button to reset onboarding state is pressed', async () => {
    const context = renderRouter({
      index: () => <AnonymousProfileView />,
      onboarding: () => <Text>Onboarding</Text>,
    })

    fireEvent.press(screen.getByText('profile.settings.resetOnboardingState.title'))

    await waitFor(() => expect(mockClearOnboardingState).toHaveBeenCalled())
    expect(mockClearGuestMode).toHaveBeenCalled()
    expect(context).toHavePathname('/onboarding')
  })
})

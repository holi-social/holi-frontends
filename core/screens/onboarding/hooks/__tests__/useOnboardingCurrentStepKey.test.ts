import { type OnboardingStateValue, useOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import {
  useOnboardingCurrentStepKey,
  type OnboardingStepKey,
} from '@holi/core/screens/onboarding/hooks/useOnboardingCurrentStepKey'
import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react-native'
import { useFocusEffect } from '@holi/core/helpers'

const mockUseOnboardingState = useOnboardingState as jest.Mock
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => {
  return {
    useOnboardingState: jest.fn(),
  }
})

const mockUseFocusEffect = jest.mocked(useFocusEffect)
jest.mock('@holi/core/helpers', () => ({
  useFocusEffect: jest.fn(),
}))

describe('useOnboardingCurrentStepKey', () => {
  beforeEach(() => {
    mockUseFocusEffect.mockImplementation(jest.fn())
  })

  const testCases: { state: OnboardingStateValue | null; expectedStep: OnboardingStepKey | null }[] = [
    {
      state: null,
      expectedStep: null,
    },
    {
      state: 'onboarding',
      expectedStep: 'WELCOME_SCREEN',
    },
    {
      state: 'emailVerification',
      expectedStep: 'EMAIL_VERIFICATION',
    },
    {
      state: 'accountSetup',
      expectedStep: 'USER_NAME_SELECTION',
    },
    {
      state: 'finished',
      expectedStep: 'CREATE_ACCOUNT',
    },
  ]

  it.each(testCases)(
    'should set initial step to $expectedStep for onboarding state $state',
    ({ state, expectedStep }) => {
      mockUseOnboardingState.mockReturnValue(state)

      const { result } = renderHook(() => useOnboardingCurrentStepKey())

      expect(result.current[0]).toEqual(expectedStep)
    }
  )

  it.each(testCases)(
    'should update step to $expectedStep for switch to onboarding state $state',
    async ({ state, expectedStep }) => {
      mockUseOnboardingState.mockReturnValue(null)

      const { result, rerender } = renderHook(() => useOnboardingCurrentStepKey())

      expect(result.current[0]).toBeNull()

      mockUseOnboardingState.mockReturnValue(state)

      rerender()

      await waitFor(() => expect(result.current[0]).toEqual(expectedStep))
    }
  )

  it('should reset current step on focus change', () => {
    mockUseOnboardingState.mockReturnValue('onboarding')
    mockUseFocusEffect.mockImplementation(jest.fn())

    const { result, rerender } = renderHook(() => useOnboardingCurrentStepKey())

    expect(result.current[0]).toBe('WELCOME_SCREEN')
    mockUseOnboardingState.mockReturnValue(null)

    // Simulate useFocusEffect call
    mockUseFocusEffect.mock.calls[0][0]()
    rerender()

    expect(result.current[0]).toBeNull()
  })
})

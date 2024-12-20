import { type OnboardingStateValue, useOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import {
  useOnboardingCurrentStepKey,
  type OnboardingStepKey,
} from '@holi/core/screens/onboarding/hooks/useOnboardingCurrentStepKey'
import { renderHook } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/react-native'

const mockUseOnboardingState = useOnboardingState as jest.Mock
jest.mock('@holi/core/screens/onboarding/hooks/onboardingState', () => {
  return {
    useOnboardingState: jest.fn(),
  }
})

describe('useOnboardingCurrentStepKey', () => {
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
})

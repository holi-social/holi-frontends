import {
  hideOnboardingFinishModal,
  useOnboardingFinishModalState,
} from '@holi/core/screens/onboarding/hooks/useOnboardingFinishModalState'
import { act, renderHook } from '@testing-library/react-hooks'

describe('useOnboardingFinishModalState', () => {
  beforeEach(() => {
    hideOnboardingFinishModal()
  })

  it('should expose flag if modal is visible', () => {
    const { result } = renderHook(() => useOnboardingFinishModalState())

    expect(result.current.visible).toBeFalsy()
  })

  it('should allow to show modal', () => {
    const { result } = renderHook(() => useOnboardingFinishModalState())

    act(() => {
      result.current.show()
    })

    expect(result.current.visible).toBeTruthy()
  })

  it('should allow to hide modal', () => {
    const { result } = renderHook(() => useOnboardingFinishModalState())

    act(() => {
      result.current.show()
    })

    expect(result.current.visible).toBeTruthy()

    act(() => {
      result.current.hide()
    })

    expect(result.current.visible).toBeFalsy()
  })
})

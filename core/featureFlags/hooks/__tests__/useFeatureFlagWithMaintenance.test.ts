import { renderHook } from 'expo-router/testing-library'

import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

const mockUseFeatureFlag = jest.fn()

jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: string) => mockUseFeatureFlag(flag),
}))

describe('useFeatureFlagWithMaintenance', () => {
  const flag = FeatureFlagKey.DONATIONS

  it('should fetch state for correct feature flag', () => {
    renderHook(() => useFeatureFlagWithMaintenance(flag))

    expect(mockUseFeatureFlag).toHaveBeenCalledWith(flag)
  })

  it('should recognize if feature flag is on', () => {
    mockUseFeatureFlag.mockReturnValue(['on'])

    const { result } = renderHook(() => useFeatureFlagWithMaintenance(flag))

    expect(result.current.isOn).toBeTruthy()
  })

  it('should recognize if feature flag is off', () => {
    mockUseFeatureFlag.mockReturnValue(['off'])

    const { result } = renderHook(() => useFeatureFlagWithMaintenance(flag))

    expect(result.current.isOff).toBeTruthy()
  })

  it('should recognize if feature flag is in maintenance', () => {
    mockUseFeatureFlag.mockReturnValue(['maintenance'])

    const { result } = renderHook(() => useFeatureFlagWithMaintenance(flag))

    expect(result.current.inMaintenance).toBeTruthy()
  })

  it('should recognize if feature flag state is unknown', () => {
    mockUseFeatureFlag.mockReturnValue([])

    const { result } = renderHook(() => useFeatureFlagWithMaintenance(flag))

    expect(result.current.isUnknown).toBeTruthy()
  })

  it('should return and log unknown state if feature flag state is invalid', () => {
    mockUseFeatureFlag.mockReturnValue(['foobar'])

    const { result } = renderHook(() => useFeatureFlagWithMaintenance(flag))

    expect(result.current.isUnknown).toBeTruthy()
    expect(mockConsoleWarn).toHaveBeenCalled()
  })
})

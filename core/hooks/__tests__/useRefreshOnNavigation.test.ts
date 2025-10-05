import { renderHook } from 'expo-router/testing-library'

import useRefreshOnNavigation from '@holi/core/hooks/useRefreshOnNavigation'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'

jest.mock('@holi/core/navigation/hooks/useParam')

const mockOnRefresh = jest.fn()
jest.mock('@holi/core/refreshing/hooks/useRefreshContext', () => ({
  useRefreshContext: () => ({ refreshControlProps: { onRefresh: mockOnRefresh } }),
}))

describe('useRefreshOnNavigation', () => {
  it('should not refresh if not initialized yet', () => {
    const { mockUseUpdateParams } = mockParameters({ refresh: 'true' })

    renderHook(() => useRefreshOnNavigation({}))

    expect(mockOnRefresh).not.toHaveBeenCalled()
    expect(mockUseUpdateParams).not.toHaveBeenCalled()
  })

  it('should not refresh after initializing without change of refresh param', () => {
    mockParameters({ refresh: 'true' })

    const { rerender } = renderHook(() => useRefreshOnNavigation({}))
    rerender(() => useRefreshOnNavigation({ initialized: true }))

    expect(mockOnRefresh).not.toHaveBeenCalled()
  })

  it('should not refresh if refresh param is not set', () => {
    mockParameters({ refresh: 'true' })
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: false }))

    mockParameters({ refresh: undefined })
    rerender(() => useRefreshOnNavigation({ initialized: true }))

    expect(mockOnRefresh).not.toHaveBeenCalled()
  })

  it('should refresh if refresh param changed after initializing', () => {
    mockParameters()
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: true }))

    mockParameters({ refresh: 'true' })
    rerender(() => useRefreshOnNavigation({ initialized: true }))

    expect(mockOnRefresh).toHaveBeenCalled()
  })

  it('should reset param when refreshing', () => {
    const { mockUseUpdateParams } = mockParameters()
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: true }))

    mockParameters({ refresh: 'true' })
    rerender(() => useRefreshOnNavigation({ initialized: true }))

    expect(mockUseUpdateParams).toHaveBeenCalledWith({ refresh: undefined })
  })

  it('should refresh everytime the refresh param changes to true', () => {
    const { mockUseUpdateParams } = mockParameters()
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: true }))
    for (let i = 0; i < 3; i++) {
      mockParameters({ refresh: 'true' })
      rerender(() => useRefreshOnNavigation({ initialized: true }))

      expect(mockOnRefresh).toHaveBeenCalledTimes(i + 1)
      expect(mockUseUpdateParams).toHaveBeenCalledTimes(i + 1)

      mockParameters({})
      rerender(() => useRefreshOnNavigation({ initialized: true }))
    }
  })
})

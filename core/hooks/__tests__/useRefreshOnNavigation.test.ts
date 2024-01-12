import { renderHook } from '@testing-library/react-native'

import useRefreshOnNavigation from '@holi/core/hooks/useRefreshOnNavigation'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'

jest.mock('@holi/core/navigation/hooks/useParam')

describe('useRefreshOnNavigation', () => {
  const onRefresh = jest.fn()

  it('should not refresh if not initialized yet', () => {
    const { mockUseUpdateParams } = mockParameters({ refresh: 'true' })

    renderHook(() => useRefreshOnNavigation({ onRefresh }))

    expect(onRefresh).not.toHaveBeenCalled()
    expect(mockUseUpdateParams).not.toHaveBeenCalled()
  })

  it('should not refresh after initializing without change of refresh param', () => {
    mockParameters({ refresh: 'true' })

    const { rerender } = renderHook(() => useRefreshOnNavigation({ onRefresh }))
    rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('should not refresh if refresh param is not set', () => {
    mockParameters({ refresh: 'true' })
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: false, onRefresh }))

    mockParameters({ refresh: undefined })
    rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('should refresh if refresh param changed after initializing', () => {
    mockParameters()
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    mockParameters({ refresh: 'true' })
    rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    expect(onRefresh).toHaveBeenCalled()
  })

  it('should reset param when refreshing', () => {
    const { mockUseUpdateParams } = mockParameters()
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    mockParameters({ refresh: 'true' })
    rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    expect(mockUseUpdateParams).toHaveBeenCalledWith({ refresh: undefined })
  })

  it('should refresh everytime the refresh param changes to true', () => {
    const { mockUseUpdateParams } = mockParameters()
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: true, onRefresh }))
    for (let i = 0; i < 3; i++) {
      mockParameters({ refresh: 'true' })
      rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

      expect(onRefresh).toHaveBeenCalledTimes(i + 1)
      expect(mockUseUpdateParams).toHaveBeenCalledTimes(i + 1)

      mockParameters({})
      rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))
    }
  })
})

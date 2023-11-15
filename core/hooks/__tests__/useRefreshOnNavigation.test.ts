import { renderHook } from '@testing-library/react-native'

import useRefreshOnNavigation from '@holi/core/hooks/useRefreshOnNavigation'

const mockUseParam = jest.fn()

jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: () => mockUseParam(),
}))

describe('useRefreshOnNavigation', () => {
  const onRefresh = jest.fn()
  const mockSetParam = jest.fn()

  it('should not refresh if not initialized yet', () => {
    mockUseParam.mockReturnValue(['true', mockSetParam])

    renderHook(() => useRefreshOnNavigation({ onRefresh }))

    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('should not refresh after initializing without change of refresh param', () => {
    mockUseParam.mockReturnValue(['true', mockSetParam])

    const { rerender } = renderHook(() => useRefreshOnNavigation({ onRefresh }))
    rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('should not refresh if refresh param is not set', () => {
    mockUseParam.mockReturnValue(['true', mockSetParam])
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: false, onRefresh }))

    mockUseParam.mockReturnValue([undefined, mockSetParam])
    rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    expect(onRefresh).not.toHaveBeenCalled()
  })

  it('should refresh if refresh param changed after initializing', () => {
    mockUseParam.mockReturnValue([undefined, mockSetParam])
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    mockUseParam.mockReturnValue(['true', mockSetParam])
    rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    expect(onRefresh).toHaveBeenCalled()
  })

  it('should reset param when refreshing', () => {
    mockUseParam.mockReturnValue([undefined, mockSetParam])
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    mockUseParam.mockReturnValue(['true', mockSetParam])
    rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

    expect(mockSetParam).toHaveBeenCalledWith(undefined)
  })

  it('should refresh everytime the refresh param changes to true', () => {
    mockUseParam.mockReturnValue([undefined, mockSetParam])
    const { rerender } = renderHook(() => useRefreshOnNavigation({ initialized: true, onRefresh }))
    for (let i = 0; i < 3; i++) {
      mockUseParam.mockReturnValue(['true', mockSetParam])
      rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))

      expect(onRefresh).toHaveBeenCalledTimes(i + 1)
      expect(mockSetParam).toHaveBeenCalledTimes(i + 1)

      mockUseParam.mockReturnValue([undefined, mockSetParam])
      rerender(() => useRefreshOnNavigation({ initialized: true, onRefresh }))
    }
  })
})

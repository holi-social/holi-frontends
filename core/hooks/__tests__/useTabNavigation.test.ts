import { act, renderHook } from '@testing-library/react-native'

import useTabNavigation from '@holi/core/hooks/useTabNavigation'

const mockUseParam = jest.fn()
const mockUseUpdateParams = jest.fn()

jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: () => mockUseParam(),
  useUpdateParams: () => mockUseUpdateParams,
}))

describe('useTabNavigation', () => {
  const tabNamesInOrder = ['tab0', 'tab1', 'tab2']

  beforeEach(() => {
    mockUseParam.mockReturnValue([undefined])
  })

  it('updates query parameter on tab change', () => {
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toBeUndefined()

    act(() => result.current.selectTabWithIndex(1))

    expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'tab1' }, { web: { replace: true } })
  })

  it('ignores invalid tab indices', () => {
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder }))

    act(() => result.current.selectTabWithIndex(-1))
    act(() => result.current.selectTabWithIndex(4))

    expect(mockUseUpdateParams).not.toHaveBeenCalled()
  })

  it('uses query parameter for initial tab selection', () => {
    const determineInitialTab = () => 'tab1'
    mockUseParam.mockReturnValue(['tab2'])

    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.currentTabName).toEqual('tab2')
    expect(result.current.initialTabIndex).toEqual(2)
    expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'tab2' }, { web: { replace: true } })
  })

  it('uses determineInitialTab for initial tab selection if no parameter is passed', () => {
    const determineInitialTab = () => 'tab1'
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.initialTabIndex).toEqual(1)
    expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'tab1' }, { web: { replace: true } })
  })

  it('uses determineInitialTab for initial tab selection if no parameter is passed', () => {
    const determineInitialTab = () => 'tab1'
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.initialTabIndex).toEqual(1)
    expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'tab1' }, { web: { replace: true } })
  })

  it('ignores invalid result from determineInitialTab for initial tab selection', () => {
    const determineInitialTab = () => 'unknown'
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.initialTabIndex).toBeUndefined()
    expect(mockUseUpdateParams).not.toHaveBeenCalled()
  })

  it('sticks to first defined decision for initial tab selection', () => {
    const { rerender, result } = renderHook(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toBeUndefined()
    expect(result.current.initialTabIndex).toBeUndefined()

    mockUseParam.mockReturnValue(['tab2'])
    rerender(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toEqual('tab2')
    expect(result.current.initialTabIndex).toEqual(2)
    expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'tab2' }, { web: { replace: true } })

    mockUseUpdateParams.mockClear()
    mockUseParam.mockReturnValue(['tab1'])
    rerender(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toEqual('tab1')
    expect(result.current.initialTabIndex).toEqual(2)
    expect(mockUseUpdateParams).not.toHaveBeenCalled()
  })
})

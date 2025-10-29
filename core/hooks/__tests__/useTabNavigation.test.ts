import { act, renderHook } from 'expo-router/testing-library'

import useTabNavigation from '@holi/core/hooks/useTabNavigation'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'

jest.mock('@holi/core/navigation/hooks/useParam')

describe('useTabNavigation', () => {
  const tabNamesInOrder = ['tab0', 'tab1', 'tab2']

  it('updates query parameter on tab change', () => {
    const { mockUseUpdateParams } = mockParameters()

    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toBeUndefined()

    act(() => result.current.selectTabWithIndex(1))

    expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'tab1' })
  })

  it('ignores invalid tab indices', () => {
    const { mockUseUpdateParams } = mockParameters()
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder }))

    act(() => result.current.selectTabWithIndex(-1))
    act(() => result.current.selectTabWithIndex(4))

    expect(mockUseUpdateParams).not.toHaveBeenCalled()
  })

  it('uses query parameter for initial tab selection', () => {
    mockParameters({ tab: 'tab2' })
    const determineInitialTab = () => 'tab1'

    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.currentTabName).toEqual('tab2')
    expect(result.current.initialTabIndex).toEqual(2)
  })

  it('uses determineInitialTab for initial tab selection if no parameter is passed', () => {
    const { mockUseUpdateParams } = mockParameters()
    const determineInitialTab = () => 'tab1'
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.initialTabIndex).toEqual(1)
    expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'tab1' })
  })

  it('uses determineInitialTab for initial tab selection if no parameter is passed', () => {
    const { mockUseUpdateParams } = mockParameters()
    const determineInitialTab = () => 'tab1'
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.initialTabIndex).toEqual(1)
    expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'tab1' })
  })

  it('ignores invalid result from determineInitialTab for initial tab selection', () => {
    const { mockUseUpdateParams } = mockParameters()
    const determineInitialTab = () => 'unknown'
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.initialTabIndex).toBeUndefined()
    expect(mockUseUpdateParams).not.toHaveBeenCalled()
  })

  it('sticks to first defined decision for initial tab selection', () => {
    const { mockUseUpdateParams } = mockParameters()
    const { rerender, result } = renderHook(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toBeUndefined()
    expect(result.current.initialTabIndex).toBeUndefined()

    mockParameters({ tab: 'tab2' })
    rerender(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toEqual('tab2')
    expect(result.current.initialTabIndex).toEqual(2)

    mockUseUpdateParams.mockClear()
    mockParameters({ tab: 'tab1' })
    rerender(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toEqual('tab1')
    expect(result.current.initialTabIndex).toEqual(2)
    expect(mockUseUpdateParams).not.toHaveBeenCalled()
  })
})

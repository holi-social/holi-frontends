import { act, renderHook } from '@testing-library/react-native'
import { useState } from 'react'

import useTabNavigation from '@holi/core/hooks/useTabNavigation'

const mockUseParam = jest.fn()

jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: () => mockUseParam(),
}))

describe('useTabNavigation', () => {
  const mockSetParam = jest.fn()
  const tabNamesInOrder = ['tab0', 'tab1', 'tab2']

  beforeEach(() => {
    mockUseParam.mockImplementation(() => {
      const [param, setParam] = useState()
      return [param, mockSetParam.mockImplementation(setParam)]
    })
  })

  it('can change current tab by index', () => {
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toBeUndefined()

    act(() => result.current.selectTabWithIndex(1))

    expect(result.current.currentTabName).toEqual('tab1')
  })

  it('updates query parameter on tab change', () => {
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder }))

    act(() => result.current.selectTabWithIndex(1))

    expect(result.current.currentTabName).toEqual('tab1')
    expect(mockSetParam).toHaveBeenCalledWith('tab1')
  })

  it('ignores invalid tab indices', () => {
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toBeUndefined()

    act(() => result.current.selectTabWithIndex(-1))

    expect(result.current.currentTabName).toBeUndefined()

    act(() => result.current.selectTabWithIndex(4))

    expect(result.current.currentTabName).toBeUndefined()
  })

  it('uses query parameter for initial tab selection', () => {
    const determineInitialTab = () => 'tab1'
    mockUseParam.mockReturnValue(['tab2', mockSetParam])

    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.currentTabName).toEqual('tab2')
    expect(result.current.initialTabIndex).toEqual(2)
  })

  it('uses determineInitialTab for initial tab selection if no parameter is passed', () => {
    const determineInitialTab = () => 'tab1'
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.currentTabName).toEqual('tab1')
    expect(result.current.initialTabIndex).toEqual(1)
  })

  it('uses determineInitialTab for initial tab selection if no parameter is passed', () => {
    const determineInitialTab = () => 'tab1'
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.currentTabName).toEqual('tab1')
    expect(result.current.initialTabIndex).toEqual(1)
  })

  it('ignores invalid result from determineInitialTab for initial tab selection', () => {
    const determineInitialTab = () => 'unknown'
    const { result } = renderHook(() => useTabNavigation({ tabNamesInOrder, determineInitialTab }))

    expect(result.current.currentTabName).toBeUndefined()
    expect(result.current.initialTabIndex).toBeUndefined()
  })

  it('sticks to first defined decision for initial tab selection', () => {
    const { rerender, result } = renderHook(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toBeUndefined()
    expect(result.current.initialTabIndex).toBeUndefined()

    act(() => mockSetParam('tab2'))
    rerender(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toEqual('tab2')
    expect(result.current.initialTabIndex).toEqual(2)

    act(() => mockSetParam('tab1'))
    rerender(() => useTabNavigation({ tabNamesInOrder }))

    expect(result.current.currentTabName).toEqual('tab1')
    expect(result.current.initialTabIndex).toEqual(2)
  })
})

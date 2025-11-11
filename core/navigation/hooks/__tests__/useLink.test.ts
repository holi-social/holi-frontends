import useLink from '@holi/core/navigation/hooks/useLink'
import type { RoutingState } from '@holi/core/navigation/hooks/useRouting/types'
import { renderHook, waitFor } from '@testing-library/react-native'
import { Linking } from 'react-native'

const mockNavigate = jest.fn()
const mockNavigateBack = jest.fn()
const testEvent = {} as React.SyntheticEvent

jest.mock<() => RoutingState>('@holi/core/navigation/hooks/useRouting', () => () => ({
  navigate: mockNavigate,
  navigateBack: mockNavigateBack,
  replaceRoute: jest.fn(),
  replaceHistory: jest.fn(),
  setParams: jest.fn(),
}))

describe('useLink', () => {
  it('should call onPress if given', () => {
    const onPress = jest.fn()
    const { result } = renderHook(() => useLink({ href: '/', onPress }))

    result.current(testEvent)

    expect(onPress).toHaveBeenCalled()
  })

  it('should stop event propagation', () => {
    const onPress = jest.fn().mockReturnValue(false)
    const { result } = renderHook(() => useLink({ href: '/', onPress }))

    result.current(testEvent)

    expect(onPress).toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should not await async onPress callback before deciding on event propagation', async () => {
    const onPress = jest.fn().mockResolvedValue(false)
    const { result } = renderHook(() => useLink({ href: '/', onPress }))

    result.current(testEvent)

    expect(onPress).toHaveBeenCalled()
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })

  it('should propagate event if not stopped', async () => {
    const onPress = jest.fn()
    const { result } = renderHook(() => useLink({ href: '/', onPress }))

    result.current(testEvent)

    expect(onPress).toHaveBeenCalled()
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('//'))
  })

  it('should navigate to href', () => {
    const { result } = renderHook(() => useLink({ href: '/' }))

    result.current(testEvent)

    expect(mockNavigate).toHaveBeenCalledWith('//')
  })

  it('should open external url', () => {
    const mockOpenURL = jest.spyOn(Linking, 'openURL')
    const { result } = renderHook(() => useLink({ href: '/', external: true }))

    result.current(testEvent)

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(mockOpenURL).toHaveBeenCalledWith('/')
  })

  it('should ignore domain and locale path param', () => {
    const { result } = renderHook(() => useLink({ href: 'https://app.holi.social/en/spaces' }))

    result.current(testEvent)

    expect(mockNavigate).toHaveBeenCalledWith('/spaces')
  })
})

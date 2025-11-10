import { act, renderHook, waitFor } from '@testing-library/react-native'

import { logError } from '@holi/core/errors/helpers'
import { useRefreshControl } from '@holi/core/refreshing/hooks/useRefreshControl'

jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
}))

jest.useFakeTimers()

describe('useRefreshControl', () => {
  it('should provide refresh control props', () => {
    const { result } = renderHook(useRefreshControl)

    expect(result.current.refreshControlProps.refreshing).toBeDefined()
    expect(result.current.refreshControlProps.onRefresh).toBeDefined()
  })

  it('should provide handler to register refresh callbacks', () => {
    const { result } = renderHook(useRefreshControl)

    expect(result.current.registerRefreshHandler).toBeDefined()
  })

  it('should call registered handlers on refresh', async () => {
    const { result } = renderHook(useRefreshControl)

    const callback1 = jest.fn()
    const callback2 = jest.fn()

    result.current.registerRefreshHandler?.(callback1)
    result.current.registerRefreshHandler?.(callback2)

    await act(async () => {
      result.current.refreshControlProps?.onRefresh?.()

      await waitFor(() => expect(result.current.refreshControlProps.refreshing).toBeFalsy())
    })

    expect(callback1).toHaveBeenCalled()
    expect(callback2).toHaveBeenCalled()
  })

  it('should allow to deregister refresh callback', async () => {
    const { result } = renderHook(useRefreshControl)

    // Register callbacks
    const callback1 = jest.fn()
    const callback2 = jest.fn()
    const deregisterCallback1 = result.current.registerRefreshHandler?.(callback1)
    result.current.registerRefreshHandler?.(callback2)

    await act(async () => {
      // Ensure both callbacks are used during refresh
      result.current.refreshControlProps?.onRefresh?.()
      expect(callback1).toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
      await waitFor(() => expect(result.current.refreshControlProps.refreshing).toBe(false))
    })

    // Deregister callback1 and reset mock calls
    deregisterCallback1?.()
    callback1.mockClear()
    callback2.mockClear()

    await act(async () => {
      // Ensure only callback2 is still called during refresh
      result.current.refreshControlProps?.onRefresh?.()
      expect(callback1).not.toHaveBeenCalled()
      expect(callback2).toHaveBeenCalled()
      await waitFor(() => expect(result.current.refreshControlProps.refreshing).toBe(false))
    })
  })

  it('should expose flag if refresh is in progress', async () => {
    const { result } = renderHook(useRefreshControl)

    const callback = jest.fn(() => new Promise((resolve) => setTimeout(resolve, 1000)))

    result.current.registerRefreshHandler?.(callback)

    expect(result.current.refreshControlProps.refreshing).toBe(false)

    act(() => {
      result.current.refreshControlProps?.onRefresh?.()
    })

    expect(result.current.refreshControlProps.refreshing).toBe(true)

    await waitFor(() => expect(result.current.refreshControlProps.refreshing).toBe(false))
  })

  it('should catch and log errors during refresh', async () => {
    const { result } = renderHook(useRefreshControl)

    const failingCallback = jest.fn(() => Promise.reject('Test'))
    const callback2 = jest.fn()

    result.current.registerRefreshHandler?.(failingCallback)
    result.current.registerRefreshHandler?.(callback2)

    await act(async () => {
      result.current.refreshControlProps?.onRefresh?.()

      await waitFor(() => expect(result.current.refreshControlProps.refreshing).toBeFalsy())
    })

    // Ensure all handlers were called
    expect(failingCallback).toHaveBeenCalled()
    expect(callback2).toHaveBeenCalled()

    expect(logError).toHaveBeenCalledWith('Test', 'Error during refresh', { location: 'useRefreshControl.onRefresh' })
  })
})

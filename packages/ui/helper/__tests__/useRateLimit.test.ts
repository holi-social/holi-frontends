import { useRateLimit } from '@holi/ui/helper/useRateLimit'
import { renderHook, act } from '@testing-library/react-native'

jest.useFakeTimers()

describe('useDebounce', () => {
  it('should call the function immediately if timeout has passed', () => {
    const mockFn = jest.fn()
    const { result } = renderHook(() => useRateLimit(mockFn, 5000))

    act(() => {
      result.current()
    })

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should not call the function again if timeout has not passed', () => {
    const mockFn = jest.fn()
    const { result } = renderHook(() => useRateLimit(mockFn, 5000))

    act(() => {
      result.current()
      result.current()
    })

    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  it('should call the function again after timeout', () => {
    const mockFn = jest.fn()
    const { result } = renderHook(() => useRateLimit(mockFn, 5000))

    act(() => {
      result.current()
    })
    expect(mockFn).toHaveBeenCalledTimes(1)

    act(() => {
      jest.advanceTimersByTime(5001)
      result.current()
    })

    expect(mockFn).toHaveBeenCalledTimes(2)
  })

  it('should handle async functions correctly', async () => {
    const asyncMockFn = jest.fn().mockResolvedValue('result')
    const { result } = renderHook(() => useRateLimit(asyncMockFn, 5000))

    let promise
    act(() => {
      promise = result.current()
    })

    await expect(promise).resolves.toBe('result')
    expect(asyncMockFn).toHaveBeenCalledTimes(1)
  })

  it('should return a promise when the function is called', () => {
    const asyncMockFn = jest.fn().mockResolvedValue('async result')
    const { result } = renderHook(() => useRateLimit(asyncMockFn, 5000))

    let promise
    act(() => {
      promise = result.current()
    })

    expect(promise).toBeInstanceOf(Promise)
  })
})

import { history, useWebHistory } from '@holi/core/navigation/hooks/useWebHistory'
import { renderHook } from '@testing-library/react-hooks'

describe('useWebHistory', () => {
  beforeEach(() => {
    // Clear history
    history.splice(0, history.length)
  })

  it('should push new route to history', () => {
    const { result } = renderHook(() => useWebHistory())

    result.current.push('/new')
    result.current.push('/new/route')

    expect(history).toHaveLength(2)
    expect(history[0]).toEqual('/new')
    expect(history[1]).toEqual('/new/route')
  })

  it('should replace route in history', () => {
    const { result } = renderHook(() => useWebHistory())

    result.current.push('/old')
    result.current.replace('/new')

    expect(history).toHaveLength(1)
    expect(history[0]).toEqual('/new')
  })

  it('should replace route in empty history', () => {
    const { result } = renderHook(() => useWebHistory())

    result.current.replace('/new')

    expect(history).toHaveLength(1)
    expect(history[0]).toEqual('/new')
  })

  describe('with non-empty history', () => {
    it('should not propose back route', () => {
      const { result } = renderHook(() => useWebHistory())

      result.current.push('/')
      result.current.push('/new')

      const backRoute = result.current.back('/new/route', '/fallback')

      expect(backRoute).toBeUndefined()
    })
  })

  describe('with empty history', () => {
    it('should navigate back to fallback route if given', () => {
      const { result } = renderHook(() => useWebHistory())

      const backRoute = result.current.back('/new/route', '/fallback')

      expect(backRoute).toEqual('/fallback')
    })

    it('should ignore single history entry', () => {
      const { result } = renderHook(() => useWebHistory())

      result.current.push('/new')
      const backRoute = result.current.back('/new/route', '/fallback')

      expect(backRoute).toEqual('/fallback')
    })

    it('should navigate back to parent route if not fallback is given', () => {
      const { result } = renderHook(() => useWebHistory())

      const backRoute = result.current.back('/new/route')

      expect(backRoute).toEqual('/new')
    })

    it('should navigate back to home if parent route is empty', () => {
      const { result } = renderHook(() => useWebHistory())

      const backRoute = result.current.back('/new')

      expect(backRoute).toEqual('/')
    })
  })
})

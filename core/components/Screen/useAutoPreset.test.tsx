import { renderHook, act } from '@testing-library/react-hooks'
import { useAutoPreset } from './useAutoPreset'
import type { LayoutChangeEvent } from 'react-native'

const createLayoutChangeEvent = (height: number) =>
  ({
    nativeEvent: {
      layout: {
        height,
        x: 0,
        y: 0,
        width: 0,
      },
    },
  }) as unknown as LayoutChangeEvent

describe('useAutoPreset', () => {
  it('returns scrollEnabled as true for non-auto presets', () => {
    const { result } = renderHook(() => useAutoPreset({ preset: 'fixed' }))
    expect(result.current.scrollEnabled).toBe(true)
  })

  it('disables scrolling when content fits within the screen (percent threshold)', () => {
    const { result } = renderHook(() =>
      useAutoPreset({ preset: 'auto', scrollToggleHeightThreshold: { relativeHeightPercent: 0.9 } })
    )

    act(() => {
      result.current.onLayout(createLayoutChangeEvent(1000))
    })

    act(() => {
      result.current.onContentSizeChange(500, 800)
    })

    expect(result.current.scrollEnabled).toBe(false)
  })

  it('enables scrolling when content exceeds the screen size (percent threshold)', () => {
    const { result } = renderHook(() =>
      useAutoPreset({ preset: 'auto', scrollToggleHeightThreshold: { relativeHeightPercent: 0.9 } })
    )

    act(() => {
      result.current.onLayout(createLayoutChangeEvent(1000))
    })

    act(() => {
      result.current.onContentSizeChange(500, 950)
    })

    expect(result.current.scrollEnabled).toBe(true)
  })

  it('disables scrolling when content fits within the screen, point threshold', () => {
    const { result } = renderHook(() =>
      useAutoPreset({ preset: 'auto', scrollToggleHeightThreshold: { fixedHeight: 50 } })
    )

    act(() => {
      result.current.onLayout(createLayoutChangeEvent(1000))
    })

    act(() => {
      result.current.onContentSizeChange(500, 940)
    })

    expect(result.current.scrollEnabled).toBe(false)
  })

  it('enables scrolling when content exceeds the screen size, point threshold', () => {
    const { result } = renderHook(() =>
      useAutoPreset({ preset: 'auto', scrollToggleHeightThreshold: { fixedHeight: 50 } })
    )

    act(() => {
      result.current.onLayout(createLayoutChangeEvent(1000))
    })

    act(() => {
      result.current.onContentSizeChange(500, 960)
    })

    expect(result.current.scrollEnabled).toBe(true)
  })

  it('does not update scroll state for null dimensions', () => {
    const { result } = renderHook(() =>
      useAutoPreset({ preset: 'auto', scrollToggleHeightThreshold: { relativeHeightPercent: 0.9 } })
    )

    act(() => {
      result.current.onContentSizeChange(0, 0)
    })

    expect(result.current.scrollEnabled).toBe(true)
  })

  it('handles missing scrollEnabledToggleThreshold gracefully', () => {
    const { result } = renderHook(() => useAutoPreset({ preset: 'auto' }))

    act(() => {
      result.current.onLayout(createLayoutChangeEvent(1000))
    })

    act(() => {
      result.current.onContentSizeChange(500, 800)
    })

    expect(result.current.scrollEnabled).toBe(false)
  })
})

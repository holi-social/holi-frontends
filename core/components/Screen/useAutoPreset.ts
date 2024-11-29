import { useRef, useState } from 'react'
import type { LayoutChangeEvent } from 'react-native'

interface UseAutoPresetReturn {
  scrollEnabled: boolean
  onContentSizeChange: (w: number, h: number) => void
  onLayout: (e: LayoutChangeEvent) => void
}

export type ScrollEnabledToggleThreshold = { percent?: number; point?: number }

interface UseAutoPresetParams {
  scrollEnabledToggleThreshold?: ScrollEnabledToggleThreshold
  preset?: string
}

export const useAutoPreset = ({ scrollEnabledToggleThreshold, preset }: UseAutoPresetParams): UseAutoPresetReturn => {
  const { percent = 0.92, point = 0 } = scrollEnabledToggleThreshold || {}
  const scrollViewHeight = useRef<null | number>(null)
  const scrollViewContentHeight = useRef<null | number>(null)
  const [scrollEnabled, setScrollEnabled] = useState(true)

  function updateScrollState() {
    if (scrollViewHeight.current === null || scrollViewContentHeight.current === null) return

    // check whether content fits the screen then toggle scroll state according to it
    const contentFitsScreen = (() => {
      if (point) {
        return scrollViewContentHeight.current < scrollViewHeight.current - point
      } else {
        return scrollViewContentHeight.current < scrollViewHeight.current * percent
      }
    })()

    // content is less than the size of the screen, so we can disable scrolling
    if (scrollEnabled && contentFitsScreen) setScrollEnabled(false)

    // content is greater than the size of the screen, so let's enable scrolling
    if (!scrollEnabled && !contentFitsScreen) setScrollEnabled(true)
  }

  /**
   * @param {number} w - The width of the content.
   * @param {number} h - The height of the content.
   */
  function onContentSizeChange(w: number, h: number) {
    // update scroll-view content height
    scrollViewContentHeight.current = h
    updateScrollState()
  }

  /**
   * @param {LayoutChangeEvent} e = The layout change event.
   */
  function onLayout(e: LayoutChangeEvent) {
    const { height } = e.nativeEvent.layout
    // update scroll-view height
    scrollViewHeight.current = height
    updateScrollState()
  }

  // update scroll state on every render
  if (preset === 'auto') updateScrollState()

  return {
    scrollEnabled: preset === 'auto' ? scrollEnabled : true,
    onContentSizeChange,
    onLayout,
  }
}

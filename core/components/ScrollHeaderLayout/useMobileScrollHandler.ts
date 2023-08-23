import { useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, Platform, ScrollViewProps } from 'react-native'

import { onScreenScrollY, useMobileScrollListener } from '@holi/core/helpers'
import { useCallWhenCurrentScreenIsActive } from '@holi/core/helpers/useCallWhenCurrentScreenIsActive'
import { throttleDebounce } from '@holi/ui/helper/throttleDebounce'

export const useMobileScrollHandler = (onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void) => {
  const globalScrollListener = useMobileScrollListener()
  const onScreenScrollListener = useCallWhenCurrentScreenIsActive(globalScrollListener)
  const onScreenScrollHeader = useCallWhenCurrentScreenIsActive(onScreenScrollY)

  return useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll?.(event)
      onScreenScrollListener(event)
      onScreenScrollHeader(event)
    },
    [onScreenScrollListener, onScreenScrollHeader, onScroll]
  )
}

const nativeEventPersist = (event: NativeSyntheticEvent<NativeScrollEvent>) => event.persist()

const DEFAULT_SCROLL_EVENT_THROTTLE_MS = 250

interface ThrottledMobileScrollEventProps {
  onScroll?: ScrollViewProps['onScroll']
  scrollEventThrottleMs?: number
}

export const useThrottledMobileScrollEvents = ({
  onScroll,
  scrollEventThrottleMs = DEFAULT_SCROLL_EVENT_THROTTLE_MS,
}: ThrottledMobileScrollEventProps = {}): Partial<ScrollViewProps> => {
  // capture mobile events via onScroll, web is done differently (to not use scroll listeners -> bad!)
  const onScrollHandler = useMobileScrollHandler(onScroll)
  // throttle mobile scroll events, because android doesn't have `scrollEventThrottle`
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onScrollThrottled = useCallback(throttleDebounce(onScrollHandler, scrollEventThrottleMs, nativeEventPersist), [
    onScrollHandler,
  ])

  return {
    // on web `onScroll` would not trigger in this global scroll view anyway
    // (only when setting it to a specific height, but we don't want that,
    //  because we explicitly want this scroll view to be the default one)
    // if you need scroll events in web, use our `useScrollY` hook or
    // add a callback to the window listener above
    onScroll: Platform.OS === 'web' ? undefined : onScrollThrottled,
    // our throttling does better when we don't compete with ios throttling
    // halving the rate gives us a healthy amount of updates to decide upon
    scrollEventThrottle: scrollEventThrottleMs / 2,
  }
}

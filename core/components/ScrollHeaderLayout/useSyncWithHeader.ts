import { useCallback, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import Animated, {
  AnimatedRef,
  interpolate,
  useAnimatedReaction,
  useAnimatedRef,
  useScrollViewOffset,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { isWeb } from '@holi/chat/src/utils'
import { setScreenScrollY, useFocusEffect, useHeaderAnimationProgress } from '@holi/core/helpers'
import { throttleDebounce } from '@holi/ui/helper/throttleDebounce'

export const useSyncWithHeader = (): AnimatedRef<Animated.ScrollView> => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>()
  const currentScrollViewOffsetY = useScrollViewOffset(scrollViewRef)
  // represents the scrollY value when the scroll direction changes
  const changeScrollStartingPoint = useSharedValue(0)
  const headerAnimationProgress = useHeaderAnimationProgress()

  const { height: screenHeight } = useWindowDimensions()
  const SCROLL_THRESHOLD = screenHeight * 0.25

  useAnimatedReaction(
    () => currentScrollViewOffsetY.value,
    (currentScrollY, prevScrollY) => {
      prevScrollY = prevScrollY ?? 0

      if (currentScrollY > prevScrollY && changeScrollStartingPoint.value > prevScrollY) {
        changeScrollStartingPoint.value = prevScrollY
      }

      if (currentScrollY < prevScrollY && changeScrollStartingPoint.value < prevScrollY) {
        changeScrollStartingPoint.value = prevScrollY
      }

      // On iOS the scrollY can be negative when the scroll view is bouncing
      const changeScrollStartingPointValue = Math.max(changeScrollStartingPoint.value, 0)

      if (currentScrollY > 0 && currentScrollY > changeScrollStartingPoint.value) {
        headerAnimationProgress.value = interpolate(
          currentScrollY,
          [changeScrollStartingPointValue, changeScrollStartingPointValue + SCROLL_THRESHOLD],
          [1, 0],
          'clamp'
        )
      } else {
        headerAnimationProgress.value = withTiming(1)
      }
    }
  )

  // MOBILE: screens could stay in cache and we need to restore the scroll position and show the header when user comes back
  useFocusEffect(
    useCallback(() => {
      if (isWeb) return

      headerAnimationProgress.value = withTiming(1)
      changeScrollStartingPoint.value = currentScrollViewOffsetY.value
    }, [changeScrollStartingPoint, headerAnimationProgress, currentScrollViewOffsetY])
  )
  // WEB: add `scroll` event listener on `<html>` element and update `currentScrollViewOffsetY` value
  useEffect(() => {
    if (!isWeb) return

    const onScroll = throttleDebounce(() => {
      const scrollY = document.documentElement.scrollTop
      currentScrollViewOffsetY.value = scrollY
      setScreenScrollY(scrollY)
    }, 50)
    document.addEventListener('scroll', onScroll)
    return () => document.removeEventListener('scroll', onScroll)
  }, [currentScrollViewOffsetY])

  return scrollViewRef
}

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScrollView, type ScrollViewProps } from 'react-native'

import type { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import type {
  RefreshableScrollHeaderLayoutProps,
  RefreshableScrollViewProps,
} from '@holi/core/components/ScrollHeaderLayout/types'
import { useRefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'

const PULL_DIVIDER = 2
const REFRESH_THRESHOLD = dimensions.topBarHeight
const LOADER_TOP_OFFSET = 66

const isHoliModalOpen = () => document.querySelector('[aria-modal="true"]') !== null

// DISCLAIMER: When changing anything here, also test horizontal scrolling on iOS Safari!
export function withRefreshControl<P extends LayoutProps, T>(
  ScrollComponent: React.ComponentType<RefreshableScrollViewProps<P>>
) {
  const WithRefreshControl = React.forwardRef<T, RefreshableScrollHeaderLayoutProps<P>>(
    ({ headerOverlap, webWrapperStyle, ...scrollViewProps }, ref) => {
      const startPointRef = useRef(0)
      // For better perfomance of the `useEffect` use non-reactive `pullChange` ref to keep track of the pull length in event handlers
      const pullChange = useRef(0)
      // use `pullChangeReactive` for reactive updates
      const [pullChangeReactive, setPullChangeReactive] = useState(0)
      const isPullInProgress = pullChangeReactive > 0
      const {
        refreshControlProps: { refreshing, onRefresh },
      } = useRefreshContext()

      const pullStart = useCallback((event: TouchEvent) => {
        if (isHoliModalOpen()) return

        const { screenY } = event.targetTouches[0]
        startPointRef.current = screenY
        setPullChangeReactive(pullChange.current)
      }, []) // !!! TRY TO KEEP DEPENDENCIES EMPTY TO PREVENT CHANGES IN 'useEffect' BELOW !!!

      const pull = useCallback((event: TouchEvent) => {
        if (isHoliModalOpen()) return

        // get the current user touch event data
        const touch = event.targetTouches[0]
        // get the touch position on the screen's Y axis
        const { screenY } = touch
        // The length of the pull
        // if the start touch position is lesser than the current touch position, calculate the difference, which gives the `pullLength`
        // This tells us how much the user has pulled
        const pullLength = startPointRef.current < screenY ? Math.abs(screenY - startPointRef.current) : 0

        pullChange.current = Math.min(pullLength / PULL_DIVIDER, REFRESH_THRESHOLD)
        setPullChangeReactive(pullChange.current)
      }, []) // !!! TRY TO KEEP DEPENDENCIES EMPTY TO PREVENT CHANGES IN 'useEffect' BELOW !!!

      const endPull = useCallback(() => {
        if (isHoliModalOpen()) return

        if (pullChange.current >= REFRESH_THRESHOLD) {
          onRefresh?.()
        }

        startPointRef.current = 0
        pullChange.current = 0
        setPullChangeReactive(0)
      }, [onRefresh]) // !!! TRY TO KEEP ONLY 'onRefresh' IN DEPENDENCIES TO PREVENT CHANGES IN 'useEffect' BELOW !!!
      // `onRefresh` is a prop and must be protected from changes in the parent component using `useCallback`

      // DISCLAIMER: highly performance intensive! If you notice touch-scrolling bugs, look here!
      useEffect(() => {
        window.addEventListener('touchstart', pullStart)
        window.addEventListener('touchmove', pull)
        window.addEventListener('touchend', endPull)

        return () => {
          window.removeEventListener('touchstart', pullStart)
          window.removeEventListener('touchmove', pull)
          window.removeEventListener('touchend', endPull)
        }
      }, [endPull, pull, pullStart])

      const offsetY = refreshing ? REFRESH_THRESHOLD : pullChangeReactive

      return (
        <div
          className="refreshable-wrapper"
          style={{
            marginTop: offsetY,
            overscrollBehaviorY: 'contain',
            // animate only on endPull
            transition: !isPullInProgress ? 'margin .3s ease-out' : 'none',
            display: 'flex',
            flex: 1,
            ...webWrapperStyle,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: REFRESH_THRESHOLD,
              left: 0,
              right: 0,
              height: LOADER_TOP_OFFSET,
              transition: !isPullInProgress ? 'transform .3s ease-out' : 'none',
              zIndex: 1,
              transform: `scale(${offsetY / REFRESH_THRESHOLD})`,
            }}
          >
            <HoliLoader />
          </div>

          <ScrollComponent
            {...(scrollViewProps as RefreshableScrollViewProps<P>)}
            headerOverlap={headerOverlap}
            ref={ref}
          />
        </div>
      )
    }
  )

  WithRefreshControl.displayName = 'WithRefreshControl'

  return WithRefreshControl
}

const ScrollViewWithRef = React.forwardRef<ScrollView, ScrollViewProps>((props, ref) => (
  <ScrollView {...props} ref={ref} />
))
ScrollViewWithRef.displayName = 'ScrollViewWithRef'

export const ScrollViewRefreshable = withRefreshControl(ScrollViewWithRef)

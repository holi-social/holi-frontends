import React, { useEffect, useRef, useState } from 'react'

import { LayoutProps } from '@holi/core/components/DefaultLayout/types'
import {
  RefreshableScrollHeaderLayoutProps,
  RefreshableScrollViewProps,
} from '@holi/core/components/ScrollHeaderLayout/types'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { vars } from '@holi/ui/styles/globalVars'

const PULL_DEVIDER = 2

// DISCLAIMER: When changing anything here, also test horizontal scrolling on iOS Safari!
export function withRefreshControl<P extends LayoutProps, T>(
  ScrollComponent: (props: RefreshableScrollViewProps<P>, ref: React.ForwardedRef<T>) => React.ReactNode
) {
  const WithRefreshControl = React.forwardRef(
    (
      {
        refreshableProps: { refreshing, onRefresh },
        headerOverlap,
        webWrapperStyle,
        ...scrollViewProps
      }: RefreshableScrollHeaderLayoutProps<P>,
      ref: React.ForwardedRef<T>
    ) => {
      const refreshHeight = +vars.topBarHeight + +vars.loaderHeight
      const loaderTopOffset = +vars.loaderHeight

      const startPointRef = useRef(0)
      const [pullChange, setPullChange] = useState(0)
      const isPullInProgress = pullChange > 0

      const pullStart = (event: TouchEvent) => {
        const { screenY } = event.targetTouches[0]
        startPointRef.current = screenY
      }

      const pull = (event: TouchEvent) => {
        // get the current user touch event data
        const touch = event.targetTouches[0]
        // get the touch position on the screen's Y axis
        const { screenY } = touch
        // The length of the pull
        // if the start touch position is lesser than the current touch position, calculate the difference, which gives the `pullLength`
        // This tells us how much the user has pulled
        const pullLength = startPointRef.current < screenY ? Math.abs(screenY - startPointRef.current) : 0
        setPullChange(pullLength / PULL_DEVIDER)
      }

      const endPull = () => {
        if (pullChange >= refreshHeight) {
          onRefresh && onRefresh()
        }

        startPointRef.current = 0
        setPullChange(0)
      }

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
      })

      useEffect(() => {
        if (!refreshing) {
          setPullChange(0)
        }
      }, [refreshing])

      return (
        <div
          className="refreshable-wrapper"
          style={{
            marginTop: refreshing ? refreshHeight : pullChange,
            overscrollBehaviorY: 'contain',
            // animate only on endPull
            transition: !isPullInProgress ? 'all .3s ease-out' : '',
            ...webWrapperStyle,
          }}
        >
          {(isPullInProgress || refreshing) && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: refreshHeight,
                transform: `translateY(${(pullChange / refreshHeight) * 200})`,
              }}
            >
              <HoliLoader style={{ top: loaderTopOffset }} />
            </div>
          )}
          <ScrollComponent {...scrollViewProps} headerOverlap={headerOverlap} ref={ref} />
        </div>
      )
    }
  )

  WithRefreshControl.displayName = 'WithRefreshControl'

  return WithRefreshControl
}

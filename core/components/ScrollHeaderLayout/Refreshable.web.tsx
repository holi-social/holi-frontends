import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import RefreshableWrapper from 'react-native-fresh-refresh'

import { LayoutProps } from '@holi/core/components/DefaultLayout/Default'
import Default from '@holi/core/components/ScrollHeaderLayout/Default'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

type DefaultProps = Omit<LayoutProps, 'refreshControl'>
type RefreshableWrapperProps = Omit<React.ComponentProps<typeof RefreshableWrapper>, 'children'> & {
  loaderTopOffset?: number
}

export interface RefreshableScrollHeaderLayoutProps extends DefaultProps {
  refreshableProps: RefreshableWrapperProps
}

const PULL_DEVIDER = 3.118

const Refreshable = React.forwardRef<ScrollView, RefreshableScrollHeaderLayoutProps>(
  (
    {
      refreshableProps: { Loader, isLoading, onRefresh, refreshHeight = 100, loaderTopOffset = 0 },
      ...defaultLayoutProps
    },
    ref
  ) => {
    const defaultLoader = () => <HoliLoader style={{ top: loaderTopOffset }} />
    Loader ??= defaultLoader

    const [startPoint, setStartPoint] = useState(0)
    const [pullChange, setPullChange] = useState(0)

    const pullStart = (event: TouchEvent) => {
      const { screenY } = event.targetTouches[0]
      setStartPoint(screenY)
    }

    const pull = (event: TouchEvent) => {
      // get the current user touch event data
      const touch = event.targetTouches[0]
      // get the touch position on the screen's Y axis
      const { screenY } = touch
      // The length of the pull
      // if the start touch position is lesser than the current touch position, calculate the difference, which gives the `pullLength`
      // This tells us how much the user has pulled
      const pullLength = startPoint < screenY ? Math.abs(screenY - startPoint) : 0
      setPullChange(pullLength / PULL_DEVIDER)
    }

    const endPull = () => {
      setStartPoint(0)
      setPullChange((pullChange) => {
        if (pullChange >= refreshHeight) {
          onRefresh()
        }

        return 0
      })
    }

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
      if (!isLoading) {
        setPullChange(0)
      }
    }, [isLoading])

    return (
      <div
        className="refreshable-wrapper"
        style={{
          overscrollBehaviorY: 'contain',
          marginTop: isLoading ? refreshHeight : pullChange,
          // animate only on endPull
          transition: !startPoint ? 'all .3s ease-out' : '',
        }}
      >
        {(!!startPoint || isLoading) && (
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
            <Loader />
          </div>
        )}
        <Default {...defaultLayoutProps} ref={ref} />
      </div>
    )
  }
)

Refreshable.displayName = 'ScrollHeaderLayout.Refreshable'

export default Refreshable

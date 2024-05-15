import React, { type PropsWithChildren } from 'react'
import { GestureResponderEvent } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'

export type HoliLinkTrackedProps = HoliLinkProps & {
  trackingEvent: TrackingEvent
}

export const HoliLinkTracked = (props: PropsWithChildren<HoliLinkTrackedProps>) => {
  const { track } = useTracking()
  const tracked = (fn?: CallableFunction): CallableFunction => {
    return (event: GestureResponderEvent) => {
      try {
        track(props.trackingEvent)
      } catch (e) {
        // console.error will be picked up by Sentry, so this does not go unnoticed to the programmer, but to the user.
        // eslint-disable-next-line no-console
        console.error('Error during evaluation of onTrack callback', e)
      }
      fn?.(event)
    }
  }
  return <HoliLink {...props} onPress={tracked(props.onPress)} />
}

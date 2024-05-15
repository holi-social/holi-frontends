import React, { type PropsWithChildren } from 'react'
import { GestureResponderEvent } from 'react-native'

import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { HoliTextLinkProps } from '@holi/core/navigation/components/HoliTextLink/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'

export type HoliTextTrackedProps = HoliTextLinkProps & {
  trackingEvent: TrackingEvent
}

export const HoliTextLinkTracked = (props: PropsWithChildren<HoliTextTrackedProps>) => {
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
  return <HoliTextLink {...props} onPress={tracked(props.onPress)} />
}

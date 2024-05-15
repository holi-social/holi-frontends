import React from 'react'

import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliButton, { HoliButtonOnPressHandler, HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

export type HoliButtonTrackedProps = HoliButtonProps & {
  trackingEvent: TrackingEvent
}

export const HoliButtonTracked = (props: React.PropsWithChildren<HoliButtonTrackedProps>) => {
  const { track } = useTracking()
  const tracked = (fn?: HoliButtonOnPressHandler): HoliButtonOnPressHandler => {
    return (event) => {
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
  return <HoliButton {...props} onPress={tracked(props.onPress)} />
}

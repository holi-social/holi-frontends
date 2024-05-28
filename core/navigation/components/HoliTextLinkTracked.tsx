import React, { type PropsWithChildren } from 'react'

import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { HoliTextLinkProps } from '@holi/core/navigation/components/HoliTextLink/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'

export type HoliTextTrackedProps = HoliTextLinkProps & {
  trackingEvent: TrackingEvent
}

export const HoliTextLinkTracked = (props: PropsWithChildren<HoliTextTrackedProps>) => {
  const { track } = useTracking()
  return (
    <HoliTextLink
      {...props}
      onPress={(e) => {
        track(props.trackingEvent)
        props.onPress?.(e)
      }}
    />
  )
}

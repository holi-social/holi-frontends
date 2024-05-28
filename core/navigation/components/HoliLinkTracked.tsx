import React, { type PropsWithChildren } from 'react'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import { HoliLinkProps } from '@holi/core/navigation/components/HoliLink/types'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'

export type HoliLinkTrackedProps = HoliLinkProps & {
  trackingEvent: TrackingEvent
}

export const HoliLinkTracked = (props: PropsWithChildren<HoliLinkTrackedProps>) => {
  const { track } = useTracking()
  return (
    <HoliLink
      {...props}
      onPress={(e) => {
        track(props.trackingEvent)
        props.onPress?.(e)
      }}
    />
  )
}

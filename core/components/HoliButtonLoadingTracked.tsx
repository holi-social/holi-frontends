import React from 'react'

import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliButtonLoading, { HoliButtonLoadingProps } from '@holi/ui/components/molecules/HoliButtonLoading'

export type HoliButtonLoadingTrackedProps = HoliButtonLoadingProps & {
  trackingEvent: TrackingEvent
}

export const HoliButtonLoadingTracked = (props: React.PropsWithChildren<HoliButtonLoadingTrackedProps>) => {
  const { track } = useTracking()
  return (
    <HoliButtonLoading
      {...props}
      onPress={(e) => {
        track(props.trackingEvent)
        props.onPress?.(e)
      }}
    />
  )
}

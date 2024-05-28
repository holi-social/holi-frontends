import React from 'react'

import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliButton, { HoliButtonProps } from '@holi/ui/components/molecules/HoliButton'

export type HoliButtonTrackedProps = HoliButtonProps & {
  trackingEvent: TrackingEvent
}

export const HoliButtonTracked = (props: React.PropsWithChildren<HoliButtonTrackedProps>) => {
  const { track } = useTracking()
  return (
    <HoliButton
      {...props}
      onPress={(e) => {
        track(props.trackingEvent)
        props.onPress?.(e)
      }}
    />
  )
}

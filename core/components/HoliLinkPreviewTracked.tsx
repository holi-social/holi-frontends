import React, { memo } from 'react'

import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliLinkPreview from '@holi/ui/components/organisms/HoliLinkPreview'
import { HoliLinkPreviewProps } from '@holi/ui/components/organisms/HoliLinkPreview/holiLinkPreviewProps'

type HoliLinkPreviewTrackedProps = HoliLinkPreviewProps & {
  trackingEvent: TrackingEvent
}

const HoliLinkPreviewTracked = (props: HoliLinkPreviewTrackedProps) => {
  const { track } = useTracking()
  return (
    <HoliLinkPreview
      {...props}
      onPress={(e) => {
        track(props.trackingEvent)
        props.onPress?.(e)
      }}
    />
  )
}

export default memo(HoliLinkPreviewTracked)

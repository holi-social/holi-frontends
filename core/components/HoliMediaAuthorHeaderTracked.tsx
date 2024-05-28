import React from 'react'

import HoliMediaAuthorHeader, { HoliMediaAuthorHeaderProps } from '@holi/core/components/HoliMediaAuthorHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'

export type HoliMediaAuthorHeaderTrackedProps = HoliMediaAuthorHeaderProps & {
  trackingEvent: TrackingEvent
}

export const HoliMediaAuthorHeaderTracked = (props: HoliMediaAuthorHeaderTrackedProps) => {
  const { navigate } = useRouting()
  const { track } = useTracking()
  const onPressHandler = () => {
    track(props.trackingEvent)
    navigate(`/profile/${props.author?.id}`)
  }
  return <HoliMediaAuthorHeader {...props} onAvatarPressed={onPressHandler} onTitlePressed={onPressHandler} />
}

import React, { memo } from 'react'

import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import { ReadMoreProps } from '@holi/ui/components/molecules/HoliReadMore/shared'

export type HoliReadMoreTrackedProps = ReadMoreProps & {
  readMoreTrackingEvent: TrackingEvent
  readLessTrackingEvent: TrackingEvent
}

const HoliReadMoreTracked = (props: React.PropsWithChildren<HoliReadMoreTrackedProps>) => {
  const { track } = useTracking()
  return (
    <HoliReadMore
      {...props}
      onReadMoreSideEffect={() => track(props.readMoreTrackingEvent)}
      onReadLessSideEffect={() => track(props.readLessTrackingEvent)}
    />
  )
}

export default memo(HoliReadMoreTracked)

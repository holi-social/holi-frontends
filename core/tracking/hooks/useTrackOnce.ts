import { useEffect, useRef } from 'react'

import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'

const useTrackOnce = (event?: TrackingEvent) => {
  const { track } = useTracking()
  const tracked = useRef(false)

  useEffect(() => {
    if (event === undefined || tracked.current) {
      return
    }

    track(event)
    tracked.current = true
  }, [event, track])
}

export default useTrackOnce

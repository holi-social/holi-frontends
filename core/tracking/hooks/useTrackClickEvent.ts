import { useCallback } from 'react'

import useTrackEvent from '@holi/core/tracking/hooks/useTrackEvent'

interface TrackClickEventParams {
  clickTarget: string
}

function useTrackClickEvent() {
  const trackEvent = useTrackEvent()

  return useCallback(
    async ({ clickTarget }: TrackClickEventParams) => {
      const eventData = {
        eventType: 'click',
        clickTarget: clickTarget,
      }

      await trackEvent(eventData)
    },
    [trackEvent]
  )
}

export default useTrackClickEvent

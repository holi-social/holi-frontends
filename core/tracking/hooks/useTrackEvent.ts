import { useMutation } from '@apollo/client'
import { useCallback } from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { usePathname } from '@holi/core/navigation/hooks/usePathname'
import { trackEventMutation } from '@holi/core/tracking/queries'

function useTrackEvent() {
  const pathname = usePathname()

  const { userId } = useAuth()

  const [trackEvent] = useMutation(trackEventMutation)

  return useCallback(
    async (eventData: Record<string, unknown>) => {
      const eventData1 = {
        date: new Date(),
        currentPath: pathname,
        userId: userId,
        ...eventData,
      }
      await trackEvent({ variables: { data: JSON.stringify(eventData1) } })
    },
    [pathname, userId, trackEvent]
  )
}

export default useTrackEvent

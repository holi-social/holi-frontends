import { PostHog, PostHogProvider } from 'posthog-react-native'
import React from 'react'

import { posthogHost, posthogKey } from '@holi/core/helpers/config'
import { getLogger } from '@holi/core/helpers/logging'
import { trackingEnabled } from '@holi/core/tracking/config'

const logger = getLogger('Tracking')

const posthog = trackingEnabled
  ? new PostHog(posthogKey, {
      host: posthogHost,
      defaultOptIn: false,
    })
  : undefined

export const TrackingProvider = ({ children }: { children?: React.ReactNode }) => {
  logger.debug('TrackingProvider', 'trackingEnabled=%s', trackingEnabled)
  return posthog ? (
    <PostHogProvider client={posthog} autocapture={{ captureTouches: true }}>
      {children}
    </PostHogProvider>
  ) : (
    <>{children}</>
  )
}

export default TrackingProvider

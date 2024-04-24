import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import React, { useEffect } from 'react'

import { posthogHost, posthogKey } from '@holi/core/helpers/config'
import { getLogger } from '@holi/core/helpers/logging'
import { trackingEnabled } from '@holi/core/tracking/config'

const logger = getLogger('Tracking')

// don't actually set a host. the browser knows the origin of the request.
const POSTHOG_API_HOST = '/api/tracking'

if (trackingEnabled) {
  // Check that PostHog is client-side (used to handle Next.js SSR)
  if (typeof window !== 'undefined') {
    const isDevEnv = process.env.NODE_ENV === 'development'

    posthog.init(posthogKey, {
      api_host: POSTHOG_API_HOST,
      ui_host: posthogHost,
      persistence: 'localStorage',
      disable_compression: isDevEnv,
      opt_out_capturing_by_default: true,
      loaded: (posthog) => {
        if (isDevEnv) posthog.debug()
      },
    })
  }
}

export const TrackingProvider = ({ children }: { children?: React.ReactNode }) => {
  logger.debug('TrackingProvider', 'trackingEnabled=%s', trackingEnabled)
  return trackingEnabled ? <PostHogProviderWrapper>{children}</PostHogProviderWrapper> : <>{children}</>
}

const PostHogProviderWrapper = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter()

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export default TrackingProvider

import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import React, { useEffect } from 'react'

import { posthogHost, posthogKey } from '@holi/core/helpers/config'

// don't actually set a host. the browser knows the origin of the request.
const POSTHOG_API_HOST = '/ingest'

const trackingEnabled = [posthogKey, posthogHost].every((x) => x !== undefined && x.trim().length > 0)

if (trackingEnabled) {
  // Check that PostHog is client-side (used to handle Next.js SSR)
  if (typeof window !== 'undefined') {
    const isDevEnv = process.env.NODE_ENV === 'development'

    posthog.init(posthogKey, {
      api_host: POSTHOG_API_HOST,
      ui_host: posthogHost,
      disable_compression: isDevEnv,
      opt_out_capturing_by_default: true,
      loaded: (posthog) => {
        if (isDevEnv) posthog.debug()
      },
    })
  }
}

export const Tracking = ({ children }: { children?: React.ReactNode }) => {
  return trackingEnabled ? <PostHogWrapper>{children}</PostHogWrapper> : <>{children}</>
}

const PostHogWrapper = ({ children }: { children?: React.ReactNode }) => {
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

export default Tracking

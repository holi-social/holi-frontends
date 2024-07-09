import { useRouter } from 'next/router'
import posthog, { Properties as PosthogProperties } from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import React, { PropsWithChildren, useEffect } from 'react'

import { posthogHost, posthogKey } from '@holi/core/helpers/config'
import { DEBUG_LOG_COMPONENTS } from '@holi/core/helpers/logging/constants'
import { featureFlagBootstrapValues } from '@holi/core/helpers/useFeatureFlag.common'
import { getConsentState } from '@holi/core/tracking/TrackingInitializer'
import { trackingEnabled } from '@holi/core/tracking/config'
import { ConsentState } from '@holi/core/tracking/types'

// don't actually set a host. the browser knows the origin of the request.
const POSTHOG_API_HOST = '/api/tracking'

const isDevEnv = process.env.NODE_ENV === 'development'

const debugOutput = isDevEnv && DEBUG_LOG_COMPONENTS.Tracking

const withConsentProperties = (properties: PosthogProperties) => {
  return {
    ...properties,
    ...ConsentState.toEventProperties(getConsentState()),
  }
}

// tracking UTM parameters is only allowed if users gave consent to tracking for marketing purposes. we're currently not
// asking the user for consent, so UTM parameters are removed in case they're present
const withoutUtmParameters = (properties: PosthogProperties) => {
  const result: PosthogProperties = {}
  for (const key in properties) {
    if (!key.startsWith('utm_')) {
      result[key] = properties[key]
    }
  }
  return result
}

const WebTrackingProvider = ({ children }: PropsWithChildren) => {
  // Check that PostHog is client-side (used to handle Next.js SSR)
  if (trackingEnabled() && typeof window !== 'undefined') {
    posthog.init(posthogKey, {
      api_host: POSTHOG_API_HOST,
      ui_host: posthogHost,
      persistence: 'localStorage',
      disable_compression: isDevEnv,
      opt_out_capturing_by_default: true,
      loaded: (posthog) => {
        if (debugOutput) posthog.debug()
      },
      sanitize_properties: function (properties) {
        return withoutUtmParameters(withConsentProperties(properties))
      },
      bootstrap: {
        featureFlags: featureFlagBootstrapValues,
      },
    })
    return <PostHogProviderWrapper>{children}</PostHogProviderWrapper>
  } else {
    return <>{children}</>
  }
}

const PostHogProviderWrapper = ({ children }: PropsWithChildren) => {
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

export default WebTrackingProvider

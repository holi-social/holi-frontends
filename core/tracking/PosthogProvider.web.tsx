import { useRouter } from 'next/router'
import posthog, { type BootstrapConfig, PostHog, type Properties as PosthogProperties } from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import React, { type PropsWithChildren, useEffect } from 'react'

import { featureFlagBootstrapValues } from '@holi/core/featureFlags/featureFlagBootstrapValues'
import { posthogHost, posthogKey } from '@holi/core/helpers/config'
import { isSSR } from '@holi/core/helpers/isSSR'
import { DEBUG_LOG_COMPONENTS } from '@holi/core/helpers/logging/constants'
import { getConsentState } from '@holi/core/tracking/TrackingInitializer'
import { ConsentState } from '@holi/core/tracking/types'

// don't actually set a host. the browser knows the origin of the request.
const POSTHOG_API_HOST = '/api/tracking'

const isDevEnv = process.env.NODE_ENV === 'development'

const debugOutput = isDevEnv && DEBUG_LOG_COMPONENTS.Tracking

interface PosthogProviderProps {
  bootstrapState: BootstrapConfig
}

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

const PosthogProvider = ({ children, bootstrapState = {} }: PropsWithChildren<PosthogProviderProps>) => {
  // Added early return for SSR to prevent PostHog initialization
  if (isSSR) {
    return <>{children}</>
  }

  // Create new instances for SSR, re-use global one on the client side
  const client = isSSR ? new PostHog() : posthog
  client.init(posthogKey, {
    api_host: POSTHOG_API_HOST,
    ui_host: posthogHost,
    persistence: 'localStorage',
    disable_compression: isDevEnv,
    opt_out_capturing_by_default: true,
    loaded: (posthog) => {
      // Suppressing logging during SSR as some browser API (localStorage, navigator) is missing and leads to error logs
      if (debugOutput && !isSSR) {
        posthog.debug()
      }
    },
    sanitize_properties: (properties) => withoutUtmParameters(withConsentProperties(properties)),
    bootstrap: {
      ...featureFlagBootstrapValues,
      ...bootstrapState,
    },
  })

  return (
    <PostHogProvider client={client}>
      {isSSR ? null : <RouteChangeHandler />}
      {children}
    </PostHogProvider>
  )
}

const RouteChangeHandler = () => {
  const router = useRouter()

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return null
}

export default PosthogProvider

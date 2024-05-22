import { useRouter } from 'next/router'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import React, { PropsWithChildren, useEffect } from 'react'

import { posthogHost, posthogKey } from '@holi/core/helpers/config'
import { getLogger } from '@holi/core/helpers/logging'
import { DEBUG_LOG_COMPONENTS } from '@holi/core/helpers/logging/constants'
import { trackingEnabled } from '@holi/core/tracking/config'

const logger = getLogger('Tracking')

// don't actually set a host. the browser knows the origin of the request.
const POSTHOG_API_HOST = '/api/tracking'

const isDevEnv = process.env.NODE_ENV === 'development'

const debugOutput = isDevEnv && DEBUG_LOG_COMPONENTS.Tracking

if (trackingEnabled()) {
  // Check that PostHog is client-side (used to handle Next.js SSR)
  if (typeof window !== 'undefined') {
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
        Object.keys(properties).forEach((key) => {
          if (key.startsWith('utm_')) {
            delete properties[key]
          }
        })
        return properties
      },
    })
  }
}

export const TrackingProvider = ({ children }: PropsWithChildren) => {
  logger.debug('TrackingProvider', 'trackingEnabled=%s', trackingEnabled())
  return trackingEnabled() ? <PostHogProviderWrapper>{children}</PostHogProviderWrapper> : <>{children}</>
}

const normalize = (urlOrPath: string): string => {
  const lowercased = urlOrPath.toLowerCase()
  return lowercased.endsWith('/') ? lowercased : lowercased + '/'
}

const removeCountryCode = (url: string): string => {
  const regex = /^(https?:\/\/[^/]+)\/[a-zA-Z]{2}(\/.*)?$/
  const match = url.match(regex)

  if (match) {
    const protocolAndDomain = match[1] // The protocol and domain part
    const remainingPath = match[2] || '' // The remaining path after the country code
    return protocolAndDomain + remainingPath
  }

  // If no match, return the original URL
  return url
}

const countryCodePathnameMatcher = /(^\/[a-z]{2}\/?$|^\/[a-z]{2}\/)/

const createRouteChangeHandler = (url: () => string) => (path: string) => {
  const urlWithoutCountryCode = normalize(removeCountryCode(url()))
  const pathWithoutCountryCode = normalize(path.replace(countryCodePathnameMatcher, '/'))
  posthog.capture('$pageview', {
    $current_url: urlWithoutCountryCode,
    $pathname: pathWithoutCountryCode,
  })
}

const PostHogProviderWrapper = ({ children }: PropsWithChildren) => {
  const router = useRouter()

  useEffect(() => {
    const routeChangeHandler = createRouteChangeHandler(() => window.location.href)
    // Track page views
    router.events.on('routeChangeComplete', routeChangeHandler)

    return () => {
      router.events.off('routeChangeComplete', routeChangeHandler)
    }
  }, [router.events])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export default TrackingProvider

export const exportedForTesting = {
  createRouteChangeHandler,
}

import { PostHog, PostHogProvider } from 'posthog-react-native'
import React, { PropsWithChildren } from 'react'

import { posthogHost, posthogKey } from '@holi/core/helpers/config'
import { getLogger } from '@holi/core/helpers/logging'
import { featureFlagBootstrapValues } from '@holi/core/helpers/usePosthogFeatureFlag.common'
import { getConsentState } from '@holi/core/tracking/TrackingInitializer'
import { trackingEnabled } from '@holi/core/tracking/config'
import { ConsentState } from '@holi/core/tracking/types'

const logger = getLogger('Tracking')

const posthog = trackingEnabled()
  ? new PostHog(posthogKey, {
      host: posthogHost,
      defaultOptIn: false,
      captureNativeAppLifecycleEvents: true,
    })
  : null

type RouteToPropertiesFilter = ((name: string, params: unknown) => Record<string, unknown>) | undefined

const withNavigationAndConsentProperties: RouteToPropertiesFilter = (name, params) => {
  const paramsProps =
    typeof params === 'object' && params !== null /* null is an Object in JS */
      ? (params as Record<string, unknown>)
      : {}
  return {
    ...paramsProps,
    ...ConsentState.toEventProperties(getConsentState()),
  }
}

const MobileTrackingProvider = ({ children }: PropsWithChildren) => {
  logger.debug('TrackingProvider', 'trackingEnabled=%s', trackingEnabled())
  return posthog ? (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureTouches: true,
        navigation: { routeToProperties: withNavigationAndConsentProperties },
      }}
      options={{
        bootstrap: {
          featureFlags: featureFlagBootstrapValues,
        },
      }}
    >
      {children}
    </PostHogProvider>
  ) : (
    <>{children}</>
  )
}

export default MobileTrackingProvider

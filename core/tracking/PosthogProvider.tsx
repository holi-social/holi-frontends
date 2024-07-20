import { PostHog, PostHogProvider } from 'posthog-react-native'
import React, { PropsWithChildren } from 'react'

import { posthogHost, posthogKey } from '@holi/core/helpers/config'
import { featureFlagBootstrapPayloads, featureFlagBootstrapValues } from '@holi/core/helpers/useFeatureFlag.common'
import { getConsentState } from '@holi/core/tracking/TrackingInitializer'
import { ConsentState } from '@holi/core/tracking/types'

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

const PosthogProvider = ({ children }: PropsWithChildren) => {
  const posthog = new PostHog(posthogKey, {
    host: posthogHost,
    defaultOptIn: false,
    captureNativeAppLifecycleEvents: true,
    bootstrap: {
      featureFlags: featureFlagBootstrapValues,
      featureFlagPayloads: featureFlagBootstrapPayloads,
    },
  })

  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        captureTouches: true,
        navigation: { routeToProperties: withNavigationAndConsentProperties },
      }}
    >
      {children}
    </PostHogProvider>
  )
}

export default PosthogProvider

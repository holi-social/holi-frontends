import { PostHog, PostHogOptions, PostHogProvider } from 'posthog-react-native'
import React, { PropsWithChildren } from 'react'

import { featureFlagBootstrapValues } from '@holi/core/featureFlags/featureFlagBootstrapValues'
import { posthogHost, posthogKey } from '@holi/core/helpers/config'
import { getConsentState } from '@holi/core/tracking/TrackingInitializer'
import { ConsentState } from '@holi/core/tracking/types'

type RouteToPropertiesFilter = ((name: string, params: unknown) => Record<string, unknown>) | undefined

export interface PosthogProviderProps {
  bootstrapState?: PostHogOptions['bootstrap']
}

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

const PosthogProvider = ({ children, bootstrapState = {} }: PropsWithChildren<PosthogProviderProps>) => {
  const posthog = new PostHog(posthogKey, {
    host: posthogHost,
    defaultOptIn: false,
    captureNativeAppLifecycleEvents: true,
    bootstrap: {
      ...featureFlagBootstrapValues,
      ...bootstrapState,
    },
  })

  return (
    <PostHogProvider
      client={posthog}
      autocapture={{
        navigation: { routeToProperties: withNavigationAndConsentProperties },
      }}
    >
      {children}
    </PostHogProvider>
  )
}

export default PosthogProvider

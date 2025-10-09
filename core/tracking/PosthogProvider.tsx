import { PostHog, type PostHogOptions, PostHogProvider } from 'posthog-react-native'
import React, { type PropsWithChildren } from 'react'

import { featureFlagBootstrapValues } from '@holi/core/featureFlags/featureFlagBootstrapValues'
import { posthogHost, posthogKey } from '@holi/core/helpers/config'

export interface PosthogProviderProps {
  bootstrapState?: PostHogOptions['bootstrap']
}

const PosthogProvider = ({ children, bootstrapState = {} }: PropsWithChildren<PosthogProviderProps>) => {
  // Disable PostHog in development
  const isDevEnv = process.env.NODE_ENV === 'development'
  if (isDevEnv) {
    return <PostHogProvider client={undefined}>{children}</PostHogProvider>
  }

  const posthog = new PostHog(posthogKey, {
    host: posthogHost,
    defaultOptIn: false,
    captureNativeAppLifecycleEvents: true,
    bootstrap: {
      ...featureFlagBootstrapValues,
      ...bootstrapState,
    },
  })

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export default PosthogProvider

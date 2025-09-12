import { PostHog, type PostHogOptions, PostHogProvider } from 'posthog-react-native'
import React, { type PropsWithChildren } from 'react'

import { featureFlagBootstrapValues } from '@holi/core/featureFlags/featureFlagBootstrapValues'
import { posthogHost, posthogKey } from '@holi/core/helpers/config'

export interface PosthogProviderProps {
  bootstrapState?: PostHogOptions['bootstrap']
}

const PosthogProvider = ({ children, bootstrapState = {} }: PropsWithChildren<PosthogProviderProps>) => {
  const posthog = new PostHog(posthogKey, {
    host: posthogHost,
    defaultOptIn: false,
    captureAppLifecycleEvents: true,
    bootstrap: {
      ...featureFlagBootstrapValues,
      ...bootstrapState,
    },
  })

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export default PosthogProvider

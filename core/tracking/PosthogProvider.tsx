import { PostHog, PostHogOptions, PostHogProvider } from 'posthog-react-native'
import React, { PropsWithChildren } from 'react'

import { featureFlagBootstrapValues } from '@holi/core/featureFlags/featureFlagBootstrapValues'
import { posthogHost, posthogKey } from '@holi/core/helpers/config'

export interface PosthogProviderProps {
  bootstrapState?: PostHogOptions['bootstrap']
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

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export default PosthogProvider

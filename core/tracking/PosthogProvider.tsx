import { PostHog, type PostHogOptions, PostHogProvider } from 'posthog-react-native'
import React, { useMemo, type PropsWithChildren } from 'react'

import { featureFlagBootstrapValues } from '@holi/core/featureFlags/featureFlagBootstrapValues'
import { posthogHost, posthogKey } from '@holi/core/helpers/config'

export interface PosthogProviderProps {
  bootstrapState?: PostHogOptions['bootstrap']
}

const PosthogProvider = ({ children, bootstrapState = {} }: PropsWithChildren<PosthogProviderProps>) => {
  const posthogClient = useMemo(
    () =>
      new PostHog(posthogKey, {
        host: posthogHost,
        defaultOptIn: false,
        captureAppLifecycleEvents: true,
        bootstrap: {
          ...featureFlagBootstrapValues,
          ...bootstrapState,
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  if (!posthogClient) return <>{children}</>

  return <PostHogProvider client={posthogClient}>{children}</PostHogProvider>
}

export default PosthogProvider

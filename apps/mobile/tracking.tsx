import { PostHog, PostHogProvider } from 'posthog-react-native'
import React from 'react'

import { posthogHost, posthogKey } from '@holi/core/helpers/config'

const trackingEnabled = [posthogKey, posthogHost].every((x) => x !== undefined && x.trim().length > 0)

const posthog = trackingEnabled
  ? new PostHog(posthogKey, {
      host: posthogHost,
      defaultOptIn: false,
    })
  : undefined

export const Tracking = ({ children }: { children?: React.ReactNode }) => {
  return posthog ? <PostHogProvider client={posthog}>{children}</PostHogProvider> : <>{children}</>
}

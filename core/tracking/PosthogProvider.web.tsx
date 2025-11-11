'use client'
import posthog, { type BootstrapConfig, CaptureResult } from 'posthog-js'
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

const withConsentProperties = (cr: CaptureResult | null) => {
  if (!cr) return cr
  cr.properties = {
    ...cr.properties,
    ...ConsentState.toEventProperties(getConsentState()),
  }
  return cr
}

const PosthogProvider = ({ children, bootstrapState = {} }: PropsWithChildren<PosthogProviderProps>) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(posthogKey, {
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
        before_send: (cr) => withConsentProperties(cr),
        bootstrap: {
          ...featureFlagBootstrapValues,
          ...bootstrapState,
        },
      })
    }
  }, [bootstrapState])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}

export default PosthogProvider

import Constants from 'expo-constants'
import { useEffect, useMemo, useState } from 'react'

import { type AuthorizationHeaders, createAuthorizationHeaders } from '@holi/api/helpers'
import { useLoginState } from '@holi/core/auth/loginState'
import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { Consent } from '@holi/core/tracking/types'

type ChallengesHeaders =
  | (AuthorizationHeaders & {
      'X-Client-Platform-Anonymous-Tracking-Id'?: string
      'X-Client-Platform-User-Consent': string
      'X-Client-Platform': string
      'X-Client-Platform-Version': string
      'X-Client-Platform-Feature-Flags': string
    })
  | undefined

export const useChallengesHeaders = (): ChallengesHeaders => {
  const [consentState] = useConsentState()
  const [authHeaders, setAuthHeaders] = useState<AuthorizationHeaders | undefined>(undefined)
  const { isLoggedIn } = useLoginState()
  const posthog = usePosthogCrossPlatform()

  useEffect(() => {
    if (isLoggedIn) {
      createAuthorizationHeaders().then(setAuthHeaders)
    } else {
      setAuthHeaders(undefined)
    }
  }, [isLoggedIn])

  const headers = useMemo(() => {
    const anonymousTrackingHeader: { [key: string]: string } =
      !isLoggedIn && consentState.ANALYTICS === Consent.Given
        ? { 'X-Client-Platform-Anonymous-Tracking-Id': posthog.distinctId() }
        : {}

    return {
      ...authHeaders,
      ...anonymousTrackingHeader,
      'X-Client-Platform': 'holi',
      'X-Client-Platform-Version': Constants.expoConfig?.version || '0.0.0',
      'X-Client-Platform-Feature-Flags': 'no-back-app-header, umuted-video-start, versioned-message-from-backend',
      'X-Client-Platform-User-Consent': `${consentState.ANALYTICS === Consent.Given}`,
    }
  }, [authHeaders, consentState.ANALYTICS, posthog, isLoggedIn])

  if (isLoggedIn && !authHeaders) return undefined

  return headers
}

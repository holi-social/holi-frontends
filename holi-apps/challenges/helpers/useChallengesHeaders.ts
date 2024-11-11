import Constants from 'expo-constants'
import { useEffect, useState } from 'react'

import { type AuthorizationHeaders, createAuthorizationHeaders } from '@holi/api/helpers'
import { useLoginState } from '@holi/core/auth/loginState'
import { usePosthogCrossPlatform } from '@holi/core/tracking/PosthogCrossPlatform'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { Consent } from '@holi/core/tracking/types'

export const useChallengesHeaders = () => {
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

  const anonymousTrackingHeader: { [key: string]: string } =
    !isLoggedIn && consentState.ANALYTICS === Consent.Given
      ? { 'X-Client-Platform-Anonymous-Tracking-Id': posthog.distinctId() }
      : {}

  const headers = {
    ...authHeaders,
    ...anonymousTrackingHeader,
    'X-Client-Platform': 'holi',
    'X-Client-Platform-Version': Constants.expoConfig?.version || '',
    'X-Client-Platform-Feature-Flags': 'no-back-app-header, umuted-video-start, versioned-message-from-backend',
    'X-Client-Platform-User-Consent': `${consentState.ANALYTICS === Consent.Given}`,
  }

  if (isLoggedIn && (!authHeaders || !authHeaders.Authorization)) return undefined
  return headers
}

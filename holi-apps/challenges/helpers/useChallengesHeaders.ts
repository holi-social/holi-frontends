import Constants from 'expo-constants'
import { useEffect, useMemo, useState } from 'react'

import { AuthorizationHeaders, createAuthorizationHeaders } from '@holi/api/helpers'
import { useLoginState } from '@holi/core/auth/loginState'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { Consent } from '@holi/core/tracking/types'

export const useChallengesHeaders = () => {
  const useConsent = useConsentState()
  const [authHeaders, setAuthHeaders] = useState<AuthorizationHeaders | undefined>(undefined)
  const { isLoggedIn } = useLoginState()

  useEffect(() => {
    if (isLoggedIn) {
      createAuthorizationHeaders().then(setAuthHeaders)
    } else {
      setAuthHeaders(undefined)
    }
  }, [isLoggedIn])

  const headers = useMemo(() => {
    return {
      ...authHeaders,
      'X-Client-Platform': 'holi',
      'X-Client-Platform-Version': Constants.expoConfig?.version || '',
      'X-Client-Platform-Feature-Flags': 'no-back-app-header, umuted-video-start',
      'X-Client-Platform-User-Consent': `${useConsent.ANALYTICS === Consent.Given}`,
    }
  }, [authHeaders, useConsent.ANALYTICS])

  if (isLoggedIn && (!authHeaders || !authHeaders.Authorization)) return undefined
  return headers
}

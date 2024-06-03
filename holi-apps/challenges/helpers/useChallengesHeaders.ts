import Constants from 'expo-constants'
import { useEffect, useState } from 'react'

import { AuthorizationHeaders, createAuthorizationHeaders } from '@holi/api/helpers'
import { useConsentState } from '@holi/core/tracking/TrackingInitializer'
import { Consent } from '@holi/core/tracking/types'

export const useChallengesHeaders = () => {
  const useConsent = useConsentState()
  const [authHeaders, setAuthHeaders] = useState<AuthorizationHeaders | undefined>(undefined)

  useEffect(() => {
    createAuthorizationHeaders().then(setAuthHeaders)
  }, [])

  if (!authHeaders) {
    return undefined
  }

  return {
    ...authHeaders,
    'X-Client-Platform': 'holi',
    'X-Client-Platform-Version': Constants.expoConfig?.version || '',
    'X-Client-Platform-Feature-Flags': 'no-back-app-header, umuted-video-start',
    'X-Client-Platform-User-Consent': `${useConsent.ANALYTICS === Consent.Given}`,
  }
}

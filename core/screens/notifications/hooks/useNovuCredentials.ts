import axios from 'axios'
import { useEffect, useState } from 'react'

import { createAuthorizationHeaders } from '@holi/api/helpers'
import { novuCredentialsUrl } from '@holi/core/screens/notifications/config'

export interface NovuCredentialsResponse {
  hmacHash: string
}

export const useNovuCredentials = (userId?: string) => {
  const [hmacHash, setHmacHash] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    ;(async () => {
      try {
        const headers = await createAuthorizationHeaders()
        const response = await axios.get<NovuCredentialsResponse>(novuCredentialsUrl, {
          withCredentials: true, // cookies for web
          headers, // for mobile
        })
        setHmacHash(response.data.hmacHash)
      } catch (e) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
        //noop
      }
    })()
  }, [userId])

  return {
    hmacHash: hmacHash,
    loading: !hmacHash,
  }
}

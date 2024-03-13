import { ApiService } from '@novu/client'
import { useEffect, useRef, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { novuApplicationIdentifier, novuBackendUrl } from '@holi/core/screens/notifications/config'
import { useNovuCredentials } from '@holi/core/screens/notifications/hooks/useNovuCredentials'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

export const useNotificationService = () => {
  const { user } = useLoggedInUser()

  const novuServiceRef = useRef<ApiService | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)

  const { hmacHash } = useNovuCredentials(user?.id)

  useEffect(() => {
    if (user?.id && hmacHash) {
      setIsInitializing(true)

      const novuService = new ApiService(novuBackendUrl)
      novuService
        .initializeSession(novuApplicationIdentifier, user?.id, hmacHash)
        .then((session) => {
          novuService.setAuthorizationToken(session.token)
          novuServiceRef.current = novuService
        })
        .catch((error) =>
          logError(error, 'Error initializing novu service', {
            location: 'useNotificationService.initializeSession',
          })
        )
        .finally(() => setIsInitializing(false))
    } else {
      novuServiceRef.current = null
    }
  }, [user?.id, hmacHash])

  return { novuService: novuServiceRef.current, isInitializing }
}

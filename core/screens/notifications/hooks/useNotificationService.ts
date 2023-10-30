import { ApiService } from '@novu/client'
import { useEffect, useRef, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { novuApplicationIdentifier, novuBackendUrl } from '@holi/core/screens/notifications/config'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'

export const useNotificationService = () => {
  const { user } = useLoggedInUser()

  const novuServiceRef = useRef<ApiService | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)

  const { ftEnabled: isNotificationFeatureEnabled } = useFeatureToggle(FeatureToggleName.NOTIFICATIONS)

  useEffect(() => {
    if (isNotificationFeatureEnabled && user?.id) {
      setIsInitializing(true)
      const novuService = new ApiService(novuBackendUrl)
      novuService
        .initializeSession(novuApplicationIdentifier, user?.id)
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
  }, [isNotificationFeatureEnabled, user?.id])

  return { novuService: novuServiceRef.current, isInitializing }
}

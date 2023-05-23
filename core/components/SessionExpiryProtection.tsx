import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { setUnauthorizedErrorStatus, useUnauthorizedErrorStatusVar } from '@holi/api/graphql/client'
import { useLogout } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting/useRouting'

const SessionExpiryProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { logout } = useLogout()

  const isError = useUnauthorizedErrorStatusVar()

  useEffect(() => {
    if (isError) {
      setUnauthorizedErrorStatus(false)
      if (Platform.OS === 'web') {
        navigate('/forceLogout')
      } else {
        logout({ message: t('auth.loggingOut'), skipLogoutFlow: true })
      }
    }
  }, [isError, logout, navigate, t])

  return <>{children}</>
}

export default SessionExpiryProtection

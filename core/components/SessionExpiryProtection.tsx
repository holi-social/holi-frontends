// import NetInfo from '@react-native-community/netinfo'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { setUnauthorizedErrorStatus, useUnauthorizedErrorStatusVar } from '@holi/api/graphql/client'
import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import { useLogout } from '@holi/core/helpers'
import { useIsOnline } from '@holi/core/helpers/useIsOnline'
import useRouting from '@holi/core/navigation/hooks/useRouting'

const SessionExpiryProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { logout } = useLogout()

  const isError = useUnauthorizedErrorStatusVar()

  const isOnline = useIsOnline()

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

  return isOnline ? (
    <>{children}</>
  ) : (
    <CenteredImageHeadlineDescriptionLayout
      headlineText={t('global.offline.title')}
      descriptionText={t('global.offline.description')}
    />
  )
}

export default SessionExpiryProtection

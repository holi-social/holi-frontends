// import NetInfo from '@react-native-community/netinfo'
import type React from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { setUnauthorizedErrorStatus, useUnauthorizedErrorStatusVar } from '@holi/api/graphql/state'
import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import { useLogout } from '@holi/core/helpers'
import { useIsOnline } from '@holi/core/helpers/useIsOnline'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { makeVar } from '@apollo/client'

import { useReactiveVar } from '@apollo/client/react'

const isProcessingUnauthorizedLogout = makeVar(false)

export const clearProcessingUnauthorizedLogout = () => {
  setUnauthorizedErrorStatus(false)
  isProcessingUnauthorizedLogout(false)
}

const SessionExpiryProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { logout, isLoggingOut } = useLogout()
  const isProcessingLogout = useReactiveVar(isProcessingUnauthorizedLogout)

  const isError = useUnauthorizedErrorStatusVar()

  const isOnline = useIsOnline()

  useEffect(() => {
    if (isError && !isLoggingOut && !isProcessingLogout) {
      isProcessingUnauthorizedLogout(true)
      if (Platform.OS === 'web') {
        navigate('/forceLogout')
      } else {
        logout({ message: t('auth.loggingOut'), skipLogoutFlow: true }).finally(clearProcessingUnauthorizedLogout)
      }
    }
  }, [isError, logout, navigate, t, isLoggingOut, isProcessingLogout])

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

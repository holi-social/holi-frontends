import React from 'react'
import { useTranslation } from 'react-i18next'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import NotificationSettingsList from '@holi/core/screens/notifications/components/NotificationSettingsList'

const NotificationSettings = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.notifications.title') })
  }, [setScreenOptions, t])

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <LoginProtection>
        <NotificationSettingsList />
      </LoginProtection>
    </PermissionsGuard>
  )
}

export default NotificationSettings

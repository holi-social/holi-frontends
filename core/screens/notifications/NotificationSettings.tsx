import React from 'react'
import { useTranslation } from 'react-i18next'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import NotificationSettingsList from '@holi/core/screens/notifications/components/NotificationSettingsList'
import { useTheme } from '@holi/ui/styles/theme'

const NotificationSettings = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { colors } = theme

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.notifications.title') })
  }, [setScreenOptions, t])

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <ScrollHeaderLayout.Default backgroundColor={colors.background20}>
        <LoginProtection>
          <NotificationSettingsList />
        </LoginProtection>
      </ScrollHeaderLayout.Default>
    </PermissionsGuard>
  )
}

export default NotificationSettings

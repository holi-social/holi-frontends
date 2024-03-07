import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import FavoritesList from '@holi/core/screens/favorites/components/FavoritesList'
import { colors } from '@holi/ui/styles/globalVars'

const Favorites = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.favorites.title') })
  }, [setScreenOptions, t])

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <ScrollHeaderLayout.Default backgroundColor={colors.background30}>
        <LoginProtection>
          <FavoritesList />
        </LoginProtection>
      </ScrollHeaderLayout.Default>
    </PermissionsGuard>
  )
}

export default Favorites

import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import { favoriteInsightsQuery } from '@holi/core/screens/insights/queries'
import { colors } from '@holi/ui/styles/globalVars'

const Favorites = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { displayError } = useErrorHandling()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: 10,
    queryPath: 'favoriteInsights',
    onError: (error) => {
      displayError(error, 'Failed to load favorite insights', {
        location: 'Favorites.favoriteInsightsQuery',
      })
    },
  }

  useLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.favorites.title') })
  }, [setScreenOptions, t])

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <ScrollHeaderLayout.Default backgroundColor={colors.background30}>
        <LoginProtection>
          <Pagination
            query={favoriteInsightsQuery}
            queryOptions={{
              ...queryOptions,
            }}
            loadMoreOnScroll
          >
            {/** TODO: add favorite insights list here */}
          </Pagination>
        </LoginProtection>
      </ScrollHeaderLayout.Default>
    </PermissionsGuard>
  )
}

export default Favorites

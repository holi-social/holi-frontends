import React from 'react'
import { useTranslation } from 'react-i18next'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import FavoritesList from '@holi/core/screens/favorites/components/FavoritesList'
import { favoritesQuery } from '@holi/core/screens/favorites/queries'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { Screen } from '@holi/core/components/Screen'

const Favorites = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: t('profile.settings.favorites.title'),
      headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
    })
  }, [setScreenOptions, t])

  const { displayError } = useErrorHandling()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: 10,
    queryPath: 'favorites',
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error) => {
      displayError(error, 'Failed to load favorites', {
        location: 'Favorites.favoritesQuery',
      })
    },
  }

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <LoginProtection>
        <Screen padding={{ bottom: 'sm', left: 'sm', right: 'sm', top: 'md' }}>
          <Pagination
            query={favoritesQuery}
            queryOptions={{
              ...queryOptions,
            }}
            loadMoreOnScroll
          >
            <FavoritesList />
          </Pagination>
        </Screen>
      </LoginProtection>
    </PermissionsGuard>
  )
}

export default Favorites

import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Platform, StyleSheet } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import FavoritesList from '@holi/core/screens/favorites/components/FavoritesList'
import { favoritesQuery } from '@holi/core/screens/insights/queries'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const Favorites = () => {
  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.favorites.title') })
  }, [setScreenOptions, t])

  const { displayError } = useErrorHandling()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: 20,
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
        <ScrollHeaderLayout.Default style={styles.defaultLayout} headerOverlap keyboardShouldPersistTaps="handled">
          <HoliBox padding={[24, 0]}>
            <HoliContainer>
              <Pagination
                query={favoritesQuery}
                queryOptions={{
                  ...queryOptions,
                }}
                loadMoreOnScroll
              >
                <FavoritesList />
              </Pagination>
            </HoliContainer>
          </HoliBox>
        </ScrollHeaderLayout.Default>
      </LoginProtection>
    </PermissionsGuard>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 0,
    },
    defaultLayout: {
      marginTop: Platform.OS === 'web' ? 10 : 56,
      minHeight: Platform.OS === 'web' ? ('100vh' as DimensionValue) : ('100%' as DimensionValue),
      backgroundColor: theme.colors.background20,
      paddingTop: dimensions.topBarHeight,
    },
  })

export default Favorites

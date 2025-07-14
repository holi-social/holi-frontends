import React from 'react'
import { useTranslation } from 'react-i18next'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { Screen } from '@holi/core/components/Screen'
import { useFavoritesQuery } from '@holi/api/graphql/graphql-codegen'
import { FavoritesListEmpyState } from '@holi/core/screens/favorites/components/FavoritesListEmpyState'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import { BookmarkFill } from '@holi/icons/src/generated'

const Favorites = () => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { data } = useFavoritesQuery({
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error) => {
      displayError(error, 'Failed to load favorites', {
        location: 'Favorites.favoritesQuery',
      })
    },
    variables: {
      offset: 0,
      limit: 20,
    },
  })

  const favorites = data?.favorites?.data || []
  const groupedFavorites = {
    insights: favorites.filter((favorite) => favorite.favoritable.__typename === 'Insight'),
  }

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <LoginProtection>
        <Screen
          preset="auto"
          headerOptions={{
            title: t('profile.settings.favorites.title'),
            headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
          }}
          padding={{ bottom: 'sm', left: 'sm', right: 'sm', top: 'md' }}
        >
          {groupedFavorites.insights.length > 0 ? (
            <Stack direction="column" gap="xxs" margin={{ top: 'xs' }}>
              <Text size="xl">{t('profile.settings.favorites.insights.title')}</Text>
              {groupedFavorites.insights.map((favorite) => {
                const favoritable = favorite.favoritable
                if (favoritable.__typename !== 'Insight') return null

                return (
                  <HoliLinkTracked
                    key={favorite.id}
                    href={`/insights/${favoritable.id}`}
                    label={favoritable.title}
                    trackingEvent={TrackingEvent.Favorites.navigateToFavorited({
                      type: 'Insight',
                      id: favoritable.id,
                    })}
                    isFullHeight
                  >
                    <CompactCard
                      topLabelRightIcon={BookmarkFill}
                      topLabel={favoritable.datePublished}
                      subtitle={favoritable.description}
                      title={favoritable.title}
                      avatar={{
                        source: favoritable.creator?.avatar,
                        label: favoritable.creator?.fullName || '',
                      }}
                      imageSrc={favoritable.headerImage}
                      imageLabel={t('act.events.thumbnail.label')}
                    />
                  </HoliLinkTracked>
                )
              })}
            </Stack>
          ) : (
            <FavoritesListEmpyState />
          )}
        </Screen>
      </LoginProtection>
    </PermissionsGuard>
  )
}

export default Favorites

import React, {} from 'react'
import { useTranslation } from 'react-i18next'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { Screen } from '@holi/core/components/Screen'
import { FavoritableType } from '@holi/api/graphql/graphql-codegen'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { Text } from 'holi-bricks/components/text'
import { SectionList, View } from 'react-native'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { Stack } from 'holi-bricks/components/stack'
import { type FavoriteItem, fromTypesenseId, useFavorites } from './hooks'
import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import { FavoritingButton } from '@holi/core/components/FavoritingButton'
import { FavoritesListEmpyState } from '@holi/core/screens/favorites/components/FavoritesListEmpyState'
import { Spacing } from 'holi-bricks/foundations'

const Favorites = () => {
  const { t, i18n } = useTranslation()

  const { favoriteItems, refetch: refetchFavorites } = useFavorites()
  const sectionListData = favoriteItems
    .reduce(
      (acc, favorite) => {
        if (favorite.__typename === 'Insight') {
          acc[1].data.push(favorite)
        } else {
          acc[0].data.push(favorite)
        }
        return acc
      },
      [
        { title: t('profile.settings.favorites.volunteering.title'), data: [] as FavoriteItem[] },
        { title: t('profile.settings.favorites.insights.title'), data: [] as FavoriteItem[] },
      ] as const
    )
    .filter((section) => section.data.length > 0)

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <LoginProtection>
        <Screen
          preset="auto"
          headerOptions={{
            title: t('profile.settings.favorites.title'),
            headerTitle: ({ children }) => <HeaderTitle>{children}</HeaderTitle>,
          }}
          padding={{ bottom: 'sm' }}
        >
          <SectionList
            sections={sectionListData}
            renderItem={({ item: favorite }) => {
              switch (favorite.__typename) {
                case 'Insight':
                  return (
                    <Stack margin={{ top: 'xxs' }}>
                      <HoliLinkTracked
                        key={favorite.id}
                        href={`/insights/${favorite.id}`}
                        label={favorite.title}
                        trackingEvent={TrackingEvent.Favorites.navigateToFavorited({
                          type: FavoritableType.Insight,
                          id: favorite.id,
                        })}
                        isFullHeight
                      >
                        <CompactCard
                          topLabel={getRelativeDateString(favorite.datePublished, i18n.language)}
                          title={favorite.title}
                          subtitle={favorite.description}
                          avatar={{
                            source: favorite.creator?.avatar,
                            label: favorite.creator?.fullName || '',
                          }}
                          imageSrc={favorite.headerImage}
                          imageLabel={t('act.events.thumbnail.label')}
                          fixedWidth="100%"
                        />
                      </HoliLinkTracked>

                      <View style={{ position: 'absolute', top: Spacing['3xs'], right: Spacing['xxs'], zIndex: 1000 }}>
                        <FavoritingButton
                          favoritableId={favorite.id}
                          favoritableType={FavoritableType.Insight}
                          size="xs"
                          isFavorite={true}
                          __typename={'Insight'}
                          onCompleted={() => refetchFavorites()}
                        />
                      </View>
                    </Stack>
                  )

                case 'Typesense_Document':
                  return (
                    <Stack margin={{ top: 'xxs' }}>
                      <VolunteeringRecoCard engagement={favorite} index={0} />
                      <View style={{ position: 'absolute', top: Spacing['3xs'], right: Spacing['xxs'], zIndex: 1000 }}>
                        <FavoritingButton
                          favoritableId={fromTypesenseId(favorite.id)}
                          favoritableType={
                            favorite.type === 'volunteering'
                              ? FavoritableType.ExternalVolunteeringOpportunity
                              : FavoritableType.Task
                          }
                          size="xs"
                          isFavorite={true}
                          __typename={favorite.type === 'volunteering' ? 'ExternalVolunteeringOpportunity' : 'Task'}
                          onCompleted={() => refetchFavorites()}
                        />
                      </View>
                    </Stack>
                  )

                default:
                  return null
              }
            }}
            renderSectionHeader={({ section }) => (
              <Stack margin={{ top: 'md' }}>
                <Text size="xl">{section.title}</Text>
              </Stack>
            )}
            ListEmptyComponent={
              <Stack margin={{ top: 'md' }}>
                <FavoritesListEmpyState />
              </Stack>
            }
          />
        </Screen>
      </LoginProtection>
    </PermissionsGuard>
  )
}

export default Favorites

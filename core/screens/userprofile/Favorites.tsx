import React, {} from 'react'
import { useTranslation } from 'react-i18next'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { Screen } from '@holi/core/components/Screen'
import {
  FavoritableType,
  type FavoriteInsightFragment,
  type FavoriteTaskFragment,
  type Typesense_Document,
  useFavoritesQuery,
  useTypesense_MultiSearchQuery,
} from '@holi/api/graphql/graphql-codegen'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { Text } from 'holi-bricks/components/text'
import { BookmarkFill } from '@holi/icons/src/generated'
import { SectionList } from 'react-native'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { Stack } from 'holi-bricks/components/stack'

const useFavoritesTypesenseDocuments = (favoriteVolunteeringOpportunityIds: string[]) => {
  const {
    data: { typesense_multiSearch } = {},
  } = useTypesense_MultiSearchQuery({
    variables: {
      input: {
        searches: [
          {
            q: '*',
            filter_by: `type:=[volunteering] && id:=[${favoriteVolunteeringOpportunityIds.join(', ')}]`,
            limit: 100,
          },
        ],
      },
    },
    skip: favoriteVolunteeringOpportunityIds.length === 0,
  })

  return (
    typesense_multiSearch?.results.reduce((acc: Typesense_Document[], result) => {
      if (result.__typename === 'Typesense_SearchResponseSuccess') {
        const hits = result.hits ?? []
        acc.push(...(hits.map(({ document }) => document) ?? []))
      }
      return acc
    }, []) ?? []
  )
}

type FavoriteItem = FavoriteInsightFragment | FavoriteTaskFragment | Typesense_Document

const useFavorites = (): FavoriteItem[] => {
  const { displayError } = useErrorHandling()

  const {
    data: {
      favorites: { data: favorites = [] } = {},
    } = {},
  } = useFavoritesQuery({
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error) => {
      displayError(error, 'Failed to load favorites', {
        location: 'Favorites.favoritesQuery',
      })
    },
    variables: {
      offset: 0,
      limit: 100, // limit it 100 for first iteration
    },
  })
  const favoriteVolunteeringOpportunityIds = favorites.reduce((acc: string[], { favoritable }) => {
    if (favoritable.__typename === 'ExternalVolunteeringOpportunity') {
      acc.push('volunteering_' + favoritable.externalId)
    }
    return acc
  }, [])

  const typesenseDocuments = useFavoritesTypesenseDocuments(favoriteVolunteeringOpportunityIds)

  return favorites.reduce((acc: FavoriteItem[], { favoritable }) => {
    if (favoritable.__typename === 'ExternalVolunteeringOpportunity') {
      const typesenseDoc = typesenseDocuments.find(
        (document) => document.id === 'volunteering_' + favoritable.externalId
      )

      if (typesenseDoc) {
        acc.push(typesenseDoc)
      }
    } else {
      acc.push(favoritable)
    }
    return acc
  }, [])
}

const Favorites = () => {
  const { t, i18n } = useTranslation()

  const favorites = useFavorites()
  const sectionListData = favorites.reduce(
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
                          topLabelRightIcon={BookmarkFill}
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
                    </Stack>
                  )

                case 'Task':
                  return (
                    <Stack margin={{ top: 'xxs' }}>
                      <HoliLinkTracked
                        key={favorite.id}
                        href={`/tasks/${favorite.id}`}
                        label={favorite.name}
                        trackingEvent={TrackingEvent.Favorites.navigateToFavorited({
                          type: FavoritableType.Task,
                          id: favorite.id,
                        })}
                        isFullHeight
                      >
                        <CompactCard
                          topLabelRightIcon={BookmarkFill}
                          topLabel={getRelativeDateString(favorite.created, i18n.language)}
                          title={favorite.name}
                          subtitle={favorite.description}
                          // avatar={{
                          //   source: favorite.creator?.avatar,
                          //   label: favorite.creator?.fullName || '',
                          // }}
                          imageSrc={favorite.thumbnail}
                          imageLabel={t('act.events.thumbnail.label')}
                          fixedWidth="100%"
                        />
                      </HoliLinkTracked>
                    </Stack>
                  )

                case 'Typesense_Document': {
                  return (
                    <Stack margin={{ top: 'xxs' }}>
                      <HoliLinkTracked
                        key={favorite.id}
                        href={`/volunteering/${favorite.id}`}
                        label={favorite.title_en ?? favorite.title_de ?? ''}
                        trackingEvent={TrackingEvent.Favorites.navigateToFavorited({
                          type: FavoritableType.ExternalVolunteeringOpportunity,
                          id: favorite.id,
                        })}
                        isFullHeight
                      >
                        <CompactCard
                          topLabelRightIcon={BookmarkFill}
                          topLabel={favorite.commitment_label}
                          subtitle={favorite.description_en ?? favorite.description_de ?? ''}
                          title={favorite.title_en ?? favorite.title_de ?? ''}
                          avatar={{
                            source: favorite.organizer_image_url,
                            label: favorite.organizer_name ?? '',
                          }}
                          imageSrc={favorite.image_url}
                          imageLabel={t('act.events.thumbnail.label')}
                          fixedWidth="100%"
                        />
                      </HoliLinkTracked>
                    </Stack>
                  )
                }
                default:
                  return null
              }
            }}
            renderSectionHeader={({ section }) => (
              <Stack margin={{ top: 'md' }}>
                <Text size="xl">{section.title}</Text>
              </Stack>
            )}
          />
        </Screen>
      </LoginProtection>
    </PermissionsGuard>
  )
}

export default Favorites

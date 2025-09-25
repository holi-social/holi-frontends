import React from 'react'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { useRecoCardWidth } from '@holi/core/helpers/useRecoCardWidth'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { useTranslation } from 'react-i18next'
import { type FavoriteItem, fromTypesenseId, useFavorites } from '@holi/core/screens/userprofile/Favorites/hooks'
import { useFocusEffect } from '@holi/core/helpers'
import { Stack } from 'holi-bricks/components/stack'
import { FlatList, View } from 'react-native'
import { UnfavoriteButton } from '@holi/core/screens/userprofile/Favorites'
import { FavoritableType } from '@holi/api/graphql/graphql-codegen'
import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { Text, TextLink } from 'holi-bricks/components/text'
import { FavoritesListErrorState } from '@holi/core/screens/userprofile/components/FavoritesListErrorState'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS } from '@holi/icons/src/generated'
import { Spacing } from 'holi-bricks/foundations'
import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'
import { Button } from 'holi-bricks/components/button'

export const MAX_SHOWN_FAVORITES = 5
const ICON_SIZE = 20

export const MyVolunteeringTabFavorites = () => {
  const { t, i18n } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const { track } = useTracking()
  const cardWidth = useRecoCardWidth()
  const { navigate } = useRouting()

  const {
    favoriteItems,
    refetch: refetchFavorites,
    totalResults,
    error: favoritesError,
  } = useFavorites(MAX_SHOWN_FAVORITES)

  const volunteeringFavorites = favoriteItems.filter((item) => item.__typename === 'Typesense_Document')

  useFocusEffect(() => {
    refetchFavorites()
    track(TrackingEvent.UserProfile.favoritesSubpageOpened())
  })

  if (favoritesError) {
    return (
      <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
        <Text size="xl">
          {/* {t('profile.tabs.myVolunteer.favorites.title')} */}
          Favorites
        </Text>
        <FavoritesListErrorState refetch={() => refetchFavorites().then(() => {})} />
      </Stack>
    )
  }

  if (favoriteItems.length === 0) {
    return (
      <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
        <Text size="xl">
          {/* {t('profile.tabs.myVolunteer.favorites.title')} */}
          Favorites
        </Text>
        <Stack justifyContent="center" backgroundColor="support" padding="xs" borderRadius="md">
          <Text>
            {/* {t('favoritesOverview.emptyState.preline')} */}
            No favourites saved yet
          </Text>
        </Stack>
      </Stack>
    )
  }

  const handleSeeMore = () => {
    if (totalResults > MAX_SHOWN_FAVORITES) navigate('/profile/settings/favorites')
  }

  const renderItem = ({ item: favorite }: { item: FavoriteItem }) => {
    switch (favorite.__typename) {
      case 'Insight':
        return (
          <Stack height={'100%'}>
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
                fixedWidth={cardWidth}
                fullHeight
              />
            </HoliLinkTracked>

            <View style={styles.unfavoriteButton}>
              <UnfavoriteButton
                favoritableId={favorite.id}
                favoritableType={FavoritableType.Insight}
                onCompleted={() => refetchFavorites()}
              />
            </View>
          </Stack>
        )

      case 'Typesense_Document':
        return (
          <Stack height={'100%'}>
            <VolunteeringRecoCard
              engagement={favorite}
              index={0}
              trackingEvent={TrackingEvent.Favorites.navigateToFavorited({
                type: FavoritableType.Insight,
                id: favorite.id,
              })}
              fixedWidth={cardWidth}
            />

            <View style={styles.unfavoriteButton}>
              <UnfavoriteButton
                favoritableId={fromTypesenseId(favorite.id)}
                favoritableType={
                  favorite.type === 'volunteering'
                    ? FavoritableType.ExternalVolunteeringOpportunity
                    : FavoritableType.Task
                }
                onCompleted={() => refetchFavorites()}
              />
            </View>
          </Stack>
        )

      default:
        return null
    }
  }

  return (
    <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
      <Stack onPress={handleSeeMore} direction="row" justifyContent="space-between">
        <Text size="xl">
          {/* {t('profile.tabs.myVolunteer.favorites.title')} */}
          Favorites
        </Text>

        {totalResults > MAX_SHOWN_FAVORITES && (
          <Stack direction="row">
            <TextLink size="sm" role="none" onPress={handleSeeMore}>
              {t('global.seeMore')}
            </TextLink>
            <HoliIcon icon={ArrowRightS} size={ICON_SIZE} />
          </Stack>
        )}
      </Stack>

      <FlatList
        data={volunteeringFavorites}
        renderItem={renderItem}
        horizontal
        contentContainerStyle={{ gap: Spacing['3xs'] }}
        ListFooterComponent={
          totalResults > MAX_SHOWN_FAVORITES ? (
            <View style={{ flex: 1 }}>
              <HoliMoreCard
                role="link"
                label={t('act.startSmall.showMore')}
                onPress={handleSeeMore}
                hasButton
                fixedWidth={130}
              >
                <Button label={t('act.startSmall.showMore')} size="sm" onPress={handleSeeMore} />
              </HoliMoreCard>
            </View>
          ) : undefined
        }
      />
    </Stack>
  )
}

const stylesheet = createStyleSheet(() => ({
  unfavoriteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
}))

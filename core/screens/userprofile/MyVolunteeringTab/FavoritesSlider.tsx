import React from 'react'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { useRecoCardWidth } from '@holi/core/helpers/useRecoCardWidth'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { useTranslation } from 'react-i18next'
import { type FavoriteItem, fromTypesenseId, useFavorites } from '@holi/core/screens/userprofile/Favorites/hooks'
import { getInitials, useFocusEffect } from '@holi/core/helpers'
import { Stack } from 'holi-bricks/components/stack'
import { FlatList, View } from 'react-native'
import { UnfavoriteButton } from '@holi/core/screens/userprofile/Favorites'
import { FavoritableType } from '@holi/api/graphql/graphql-codegen'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { Text, TextLink } from 'holi-bricks/components/text'
import { FavoritesListErrorState } from '@holi/core/screens/userprofile/components/FavoritesListErrorState'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS, Global, MapPin2Filled } from '@holi/icons/src/generated'
import { Spacing } from 'holi-bricks/foundations'
import HoliMoreCard from '@holi/ui/components/atoms/HoliMoreCard'
import { Button } from 'holi-bricks/components/button'
import { linkFromLocator } from '@holi/core/typesense/helpers/linkFromLocator'

export const MAX_SHOWN_FAVORITES = 5
const ICON_SIZE = 20

export const FavoritesSlider = () => {
  const { t } = useTranslation()
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
        <Text size="xl">{t('profile.tabs.myVolunteer.favorites.title')}</Text>
        <FavoritesListErrorState
          refetch={async () => {
            await refetchFavorites()
          }}
        />
      </Stack>
    )
  }

  if (volunteeringFavorites.length === 0) {
    return (
      <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
        <Text size="xl">{t('profile.tabs.myVolunteer.favorites.title')}</Text>
        <Stack justifyContent="center" backgroundColor="support" padding="xs" borderRadius="md">
          <Text>{t('favoritesOverview.emptyState.preline')}</Text>
        </Stack>
      </Stack>
    )
  }

  const handleSeeMore = () => {
    if (totalResults > MAX_SHOWN_FAVORITES) navigate('/profile/settings/favorites')
  }

  const renderItem = ({ item: favorite }: { item: FavoriteItem }) => {
    if (favorite.__typename !== 'Typesense_Document') return null

    return (
      <Stack height={'100%'}>
        <HoliLinkTracked
          href={linkFromLocator(favorite.type, favorite.link_locators)}
          label={
            favorite?.organizer_name
              ? t('volunteering.engagement.title', {
                  title: favorite.title,
                  organization: favorite.organizer_name,
                  interpolation: { escapeValue: false },
                })
              : (favorite.title ?? '')
          }
          trackingEvent={TrackingEvent.Favorites.navigateToFavorited({
            type: FavoritableType.Insight,
            id: favorite.id,
          })}
          isFullHeight={!!cardWidth}
          testID={`${favorite.type}-reco-card`}
        >
          <CompactCard
            title={favorite.title}
            subtitle={
              favorite.organizer_name
                ? t('volunteering.engagement.organization', {
                    organization: favorite.organizer_name,
                    interpolation: { escapeValue: false },
                  })
                : ''
            }
            imageSrc={favorite.image_url}
            avatar={
              favorite.organizer_name
                ? {
                    source: favorite.organizer_image_url,
                    label: favorite.organizer_name,
                    initials: getInitials(favorite.organizer_name),
                  }
                : undefined
            }
            topLabelIcon={favorite.location_type === 'remote' ? Global : favorite.location ? MapPin2Filled : undefined}
            topLabel={
              favorite.location_type === 'remote'
                ? t('volunteering.engagement.location_type.remote')
                : favorite.location
            }
            fixedWidth={cardWidth}
            fullHeight={!!cardWidth}
            imageLabel={t('volunteering.engagement.thumbnail.label')}
            fallbackImageHashKey={favorite.id}
          />
        </HoliLinkTracked>

        <View style={styles.unfavoriteButton}>
          <UnfavoriteButton
            favoritableId={fromTypesenseId(favorite.id)}
            favoritableType={
              favorite.type === 'volunteering' ? FavoritableType.ExternalVolunteeringOpportunity : FavoritableType.Task
            }
            onCompleted={() => refetchFavorites()}
          />
        </View>
      </Stack>
    )
  }

  return (
    <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
      <Stack onPress={handleSeeMore} direction="row" justifyContent="space-between">
        <Text size="xl">{t('profile.tabs.myVolunteer.favorites.title')}</Text>

        {totalResults > MAX_SHOWN_FAVORITES && (
          <Stack direction="row">
            <TextLink size="sm" role="none">
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

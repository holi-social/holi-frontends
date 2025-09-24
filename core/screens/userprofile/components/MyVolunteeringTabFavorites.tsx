import React, {} from 'react'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import RecoSlider from '@holi/core/components/RecoSlider'
import { useRecoCardWidth } from '@holi/core/helpers/useRecoCardWidth'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { useTranslation } from 'react-i18next'
import { fromTypesenseId, useFavorites } from '@holi/core/screens/userprofile/Favorites/hooks'
import { useFocusEffect } from '@holi/core/helpers'
import { Stack } from 'holi-bricks/components/stack'
import { View } from 'react-native'
import { UnfavoriteButton } from '@holi/core/screens/userprofile/Favorites'
import { FavoritableType } from '@holi/api/graphql/graphql-codegen'
import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import useTracking from '@holi/core/tracking/hooks/useTracking'

export const MyVolunteeringTabFavorites = () => {
  const { t, i18n } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const { track } = useTracking()
  const cardWidth = useRecoCardWidth()

  const { favoriteItems, refetch: refetchFavorites } = useFavorites()

  useFocusEffect(() => {
    refetchFavorites()
    track(TrackingEvent.UserProfile.favoritesSubpageOpened())
  })

  return (
    <Stack padding={{ top: 'xs', bottom: 'xs' }}>
      <RecoSlider
        name="favorites"
        renderItem={({ item: favorite }) => {
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
        }}
        data={favoriteItems}
        heading={'Favorites'}
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

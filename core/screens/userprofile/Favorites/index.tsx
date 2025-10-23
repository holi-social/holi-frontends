import React, {} from 'react'
import { useTranslation } from 'react-i18next'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import { Screen } from '@holi/core/components/Screen'
import { FavoritableType, useUnfavoriteV2Mutation } from '@holi/api/graphql/graphql-codegen'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { Text } from 'holi-bricks/components/text'
import { Platform, Pressable, SectionList, View } from 'react-native'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { Stack } from 'holi-bricks/components/stack'
import { type FavoriteItem, fromTypesenseId, useFavorites } from './hooks'
import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import { FavoritesListEmpyState } from '@holi/core/screens/favorites/components/FavoritesListEmpyState'
import { Spacing } from 'holi-bricks/foundations'
import { useFocusEffect } from '@holi/core/helpers/useFocusEffect'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { BookmarkFill } from '@holi/icons/src/generated'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import useTracking from '@holi/core/tracking/hooks/useTracking'

const isWeb = Platform.OS === 'web'

export const UnfavoriteButton = ({
  favoritableId,
  favoritableType,
  onCompleted,
}: {
  favoritableId: string
  favoritableType: FavoritableType
  onCompleted: () => void
}) => {
  const [unfavoriteMutation] = useUnfavoriteV2Mutation({ onCompleted })

  return (
    <Pressable
      onPress={() =>
        unfavoriteMutation({
          variables: {
            favoritableId,
            favoritableType,
          },
        })
      }
    >
      <Stack padding="xxs">
        <HoliIcon icon={BookmarkFill} size={Spacing['xs']} />
      </Stack>
    </Pressable>
  )
}

const Favorites = () => {
  const { t, i18n } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const { track } = useTracking()

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
        { title: t('favoritesOverview.sectionTitle.volunteering'), data: [] as FavoriteItem[] },
        { title: t('favoritesOverview.sectionTitle.insights'), data: [] as FavoriteItem[] },
      ] as const
    )
    .filter((section) => section.data.length > 0)

  useFocusEffect(() => {
    refetchFavorites()
    track(TrackingEvent.UserProfile.favoritesSubpageOpened())
  })

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <LoginProtection>
        <Screen
          preset="fixed"
          headerOptions={{
            title: t('profile.settings.favorites.title'),
            headerTitle: ({ children }) => (
              <Text headingLevel="1" size="lg">
                {children}
              </Text>
            ),
          }}
        >
          <SectionList
            sections={sectionListData}
            keyExtractor={(item) => item.id}
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
                    <Stack margin={{ top: 'xxs' }}>
                      <VolunteeringRecoCard
                        engagement={favorite}
                        index={0}
                        trackingEvent={TrackingEvent.Favorites.navigateToFavorited({
                          type: FavoritableType.Insight,
                          id: favorite.id,
                        })}
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
            stickySectionHeadersEnabled={false}
            style={{ height: '100%' }}
            contentContainerStyle={{ paddingBottom: Spacing.md, paddingHorizontal: isWeb ? 0 : Spacing.xs }}
          />
        </Screen>
      </LoginProtection>
    </PermissionsGuard>
  )
}

export default Favorites

const stylesheet = createStyleSheet(() => ({
  unfavoriteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
}))

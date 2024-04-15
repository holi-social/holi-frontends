import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import FavoriteCard from '@holi/core/screens/favorites/components/FavoriteCard'
import { Favorites } from '@holi/core/screens/favorites/types'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors } from '@holi/ui/styles/globalVars'

const FavoritesList = () => {
  const { data: favorites, loading } = usePaginationContext<Favorites>()

  if (loading) return <HoliLoader />

  return favorites.length > 0 ? (
    <View testID={'favorites-list'}>
      {favorites
        .filter((favorite) => !!favorite)
        .map((favorite) => (
          <FavoriteCard item={favorite} key={favorite.id} />
        ))}
    </View>
  ) : (
    <EmptyFavorites />
  )
}

const EmptyFavorites = () => {
  const { t } = useTranslation()
  const imageWidth = 251

  return (
    <View style={styles.noFavoritesContainer} testID={'favorites-empty'}>
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/illustration_favorites.svg')}
        width={imageWidth}
        height={imageWidth * 0.7}
        label="no-favorites"
        isSvg={true}
        resizeMode="stretch"
        style={styles.illustration}
      />
      <HoliText size="small">{t('favorites.noResults.title')}</HoliText>
      <HoliText size="large" style={styles.noFavoritesDescription}>
        {t('favorites.noResults.description')}
      </HoliText>
    </View>
  )
}
const styles = StyleSheet.create({
  noFavoritesContainer: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
    backgroundColor: colors.background10,
    margin: 24,
    padding: 24,
    alignItems: 'center',
  },
  illustration: {
    marginTop: 32,
    marginBottom: 24,
  },
  noFavoritesDescription: { textAlign: 'center', marginTop: 8, color: colors.foreground30 },
})

export default FavoritesList

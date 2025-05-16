import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import FavoriteCard from '@holi/core/screens/favorites/components/FavoriteCard'
import type { Favorites } from '@holi/core/screens/favorites/types'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import useRouting from '@holi/core/navigation/hooks/useRouting'

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
  const imageWidth = 250
  const { navigate } = useRouting()

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      backgroundColor="support"
      padding="lg"
      borderRadius="md"
      gap="md"
      testID={'favorites-empty'}
    >
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/illustration_favorites.svg')}
        width={imageWidth}
        height={imageWidth * 0.7}
        label="no-favorites"
        isSvg={true}
        resizeMode="stretch"
      />
      <Stack alignItems="center" justifyContent="center" gap="3xs">
        <Text size="sm">{t('favorites.noResults.title')}</Text>
        <Stack maxWidth="xs">
          <Text textAlign="center" size="xxl">
            {t('favorites.noResults.description')}
          </Text>
        </Stack>
      </Stack>
      <Button
        inline
        label={t('favorites.noResults.browse')}
        onPress={() => navigate('/volunteering')}
        variant="primary"
      />
      <TextLink size="md" onPress={() => navigate('/insights')}>
        {t('favorites.noResults.link')}
      </TextLink>
    </Stack>
  )
}

export default FavoritesList

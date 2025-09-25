import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { Image } from 'holi-bricks/components/image'
import { Refresh } from '@holi/icons/src/generated'

const IMAGE_WIDTH = 100

interface FavoritesListErrorStateProps {
  refetch: () => Promise<void>
}

export const FavoritesListErrorState = ({ refetch }: FavoritesListErrorStateProps) => {
  const { t } = useTranslation()

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      backgroundColor="support"
      padding="lg"
      borderRadius="md"
      gap="md"
    >
      <Image
        alt="Favorites could not be loaded" // todo: localazy
        source={require('@holi/ui/assets/img/illustrations/illustration_favorites_error.svg')}
        width={IMAGE_WIDTH}
        height={IMAGE_WIDTH * 0.85}
        resizeMode="contain"
      />
      <Stack alignItems="center" justifyContent="center" gap="3xs">
        <Text size="sm">{t('profile.myVolunteer.favorites.error.preline')}</Text>
        <Stack maxWidth="xs">
          <Text textAlign="center" size="xl">
            {t('profile.myVolunteer.favorites.error.title')}
          </Text>
        </Stack>
      </Stack>
      <Button inline label={t('profile.myVolunteer.error.button')} onPress={refetch} variant="primary" icon={Refresh} />
    </Stack>
  )
}

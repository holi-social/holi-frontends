import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { Image } from 'holi-bricks/components/image'
import useRouting from '@holi/core/navigation/hooks/useRouting'

const IMAGE_WIDTH = 250

export const FavoritesListEmpyState = () => {
  const { t } = useTranslation()
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
      <Image
        alt={t('favorites.noResults.imageAlt')}
        source={require('@holi/ui/assets/img/illustrations/illustration_favorites.svg')}
        width={IMAGE_WIDTH}
        height={IMAGE_WIDTH * 0.7}
        resizeMode="contain"
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

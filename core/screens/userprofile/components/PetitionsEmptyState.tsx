import React from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { Image } from 'holi-bricks/components/image'
import useRouting from '@holi/core/navigation/hooks/useRouting'

const IMAGE_WIDTH = 200

export const PetitionsEmptyState = () => {
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
      testID={'volunteering-empty'}
    >
      <Image
        alt=""
        source={require('@holi/ui/assets/img/illustrations/petitions.svg')}
        width={IMAGE_WIDTH}
        height={IMAGE_WIDTH * 0.7}
        resizeMode="contain"
      />
      <Stack alignItems="center" justifyContent="center" gap="3xs">
        <Text size="sm">{t('profile.myVolunteer.petitions.empty.text')}</Text>
        <Stack maxWidth="xs">
          <Text textAlign="center" size="xxl">
            {t('profile.myVolunteer.petitions.empty.title')}
          </Text>
        </Stack>
      </Stack>
      <Button
        inline
        label={t('profile.myVolunteer.petitions.empty.button')}
        onPress={() => navigate('/act')}
        variant="primary"
      />
    </Stack>
  )
}

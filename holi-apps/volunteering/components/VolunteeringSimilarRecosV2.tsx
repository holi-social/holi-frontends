import VolunteeringSimilarRecosSlider, {
  MAX_RECOS_COUNT,
} from '@holi-apps/volunteering/components/VolunteeringSimilarRecosSlider'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import { Platform } from 'react-native'
import { useVolunteeringSimilarRecosV2 } from '@holi-apps/volunteering/hooks/useVolunteeringSimilarRecosV2'

export const VolunteeringSimilarRecosV2 = ({ documentId }: { documentId: string }) => {
  const { t } = useTranslation()

  const recommendations = useVolunteeringSimilarRecosV2({ documentId, pageSize: MAX_RECOS_COUNT })

  return (
    <Stack
      shouldRender={recommendations?.length > 0}
      direction="column"
      gap="sm"
      padding={Platform.OS === 'web' ? undefined : { left: 'sm', right: 'sm' }}
      margin={{ bottom: '3xl' }}
    >
      <Text size="xxl">{t('recommendation.slider.title')}</Text>
      <VolunteeringSimilarRecosSlider recos={recommendations} />
    </Stack>
  )
}

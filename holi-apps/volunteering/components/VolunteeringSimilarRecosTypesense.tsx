import VolunteeringSimilarRecosSlider, {
  MAX_RECOS_COUNT,
} from '@holi-apps/volunteering/components/VolunteeringSimilarRecosSlider'
import type { VolunteeringEngagement } from '@holi-apps/volunteering/types'
import { useCardWidth } from '@holi/core/screens/homeFeed/components/Recommendations'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { Platform } from 'react-native'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { logError } from '@holi/core/errors/helpers'
import { transformTypesenseDocumentToEngagement } from '@holi-apps/volunteering/helpers/transformTypesenseDocumentToEngagement'

export const VolunteeringSimilarRecosTypesense = ({ engagementId }: { engagementId: string }) => {
  const cardWidth = useCardWidth()
  const { t } = useTranslation()
  const language = useUserLanguage()

  const parameters = useMemo(
    () => ({
      filter_by: 'type:volunteering',
      sort_by: '_vector_distance:asc',
      per_page: MAX_RECOS_COUNT,
      vector_query: `similarity_embedding:([], id: volunteering_${engagementId})`,
    }),
    [engagementId]
  )

  const { state, refetch } = useTypesensePaginationQuery({
    parameters,
    onError: (error) => {
      logError(error, 'Error retrieving similar recommendations', {
        location: 'VolunteeringSimilarRecosTypesense.useTypesensePaginationQuery',
      })
    },
  })

  const recommendations = useMemo(
    () => state.data.map((engagement) => transformTypesenseDocumentToEngagement(engagement, language)),
    [language, state.data]
  )

  useOnRefresh(refetch)

  return (
    <Stack
      shouldRender={recommendations?.length > 0}
      direction="column"
      gap="sm"
      padding={Platform.OS === 'web' ? undefined : { left: 'sm' }}
      margin={{ bottom: '3xl' }}
    >
      <Text size="xxl">{t('recommendation.slider.title')}</Text>
      <VolunteeringSimilarRecosSlider cardWidth={cardWidth} recos={recommendations as VolunteeringEngagement[]} />
    </Stack>
  )
}

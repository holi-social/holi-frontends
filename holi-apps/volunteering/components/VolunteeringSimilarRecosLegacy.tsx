import VolunteeringSimilarRecosSlider, {
  MAX_RECOS_COUNT,
} from '@holi-apps/volunteering/components/VolunteeringSimilarRecosSlider'
import { useSimilarVolunteeringSliderQuery } from '@holi/api/graphql/graphql-codegen'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useCardWidth } from '@holi/core/screens/homeFeed/components/Recommendations'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { Platform } from 'react-native'
import { transformEngagementToTypesenseDocument } from '@holi-apps/volunteering/helpers/transformEngagementToTypesenseDocument'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'

export const VolunteeringSimilarRecosLegacy = ({ engagementId }: { engagementId: string }) => {
  const cardWidth = useCardWidth()
  const { t } = useTranslation()
  const language = useUserLanguage()
  const { data, refetch } = useSimilarVolunteeringSliderQuery({
    variables: { id: engagementId, limit: MAX_RECOS_COUNT },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    skip: !engagementId,
  })

  const recommendations = useMemo(
    () =>
      data?.appVolunteering_similarRecommendations.data.map((engagement) =>
        localizeTypesenseDocument(
          transformEngagementToTypesenseDocument({
            engagement,
            matchedTopicsV2: engagement.topicsV2,
            matchedSkillsV2: engagement.skillsV2,
          }),
          language
        )
      ) || [],
    [data?.appVolunteering_similarRecommendations.data, language]
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
      <VolunteeringSimilarRecosSlider cardWidth={cardWidth} recos={recommendations} />
    </Stack>
  )
}

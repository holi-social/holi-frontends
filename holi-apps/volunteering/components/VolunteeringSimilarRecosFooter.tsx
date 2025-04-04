import VolunteeringSimilarRecosSlider from '@holi-apps/volunteering/components/VolunteeringSimilarRecosSlider'
import type { VolunteeringEngagement } from '@holi-apps/volunteering/types'
import { useSimilarVolunteeringSliderQuery } from '@holi/api/graphql/graphql-codegen'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useCardWidth } from '@holi/core/screens/homeFeed/components/Recommendations'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { Platform } from 'react-native'

export const VolunteeringSimilarRecosFooter = ({ engagementId }: { engagementId: string }) => {
  const cardWidth = useCardWidth()
  const { t } = useTranslation()
  const { data, refetch } = useSimilarVolunteeringSliderQuery({
    variables: { id: engagementId },
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    skip: !engagementId,
  })

  const recommendations = data?.appVolunteering_similarRecommendations.data || []

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

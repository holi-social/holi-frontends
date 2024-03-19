import React, { memo } from 'react'
import { Platform } from 'react-native'

import RecommendationCard from '@holi/core/screens/insights/recommendations/RecommendationCard'
import { Recommendation } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'
import Spacing from '@holi/ui/foundations/Spacing'

export interface RecommendationsCarouselProps {
  insightId: string
  recommendations: Recommendation[]
}

const RecommendationsCarousel = ({ recommendations, insightId }: RecommendationsCarouselProps) => {
  return (
    <HoliCarousel
      hideDotIndicators
      marginHorizontal={Platform.OS !== 'web' ? Spacing.xs : undefined}
      slides={recommendations.map((recommendation) => ({
        children: <RecommendationCard insightId={insightId} recommendation={recommendation} />,
      }))}
    />
  )
}
export default memo(RecommendationsCarousel)

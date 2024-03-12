import React, { memo } from 'react'

import RecommendationCard from '@holi/core/screens/insights/recommendations/RecommendationCard'
import { Recommendation } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

export interface RecommendationsCarouselProps {
  insightId: string
  recommendations: Recommendation[]
}

const RecommendationsCarousel = ({ recommendations, insightId }: RecommendationsCarouselProps) => {
  return (
    <HoliCarousel
      hideDotIndicators
      marginHorizontal={20}
      slides={recommendations.map((recommendation) => ({
        children: <RecommendationCard insightId={insightId} recommendation={recommendation} />,
      }))}
    />
  )
}
export default memo(RecommendationsCarousel)

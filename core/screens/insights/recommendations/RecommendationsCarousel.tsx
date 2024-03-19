import React, { memo } from 'react'

import RecommendationCard from '@holi/core/screens/insights/recommendations/RecommendationCard'
import { Recommendation } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

export interface RecommendationsCarouselProps {
  insightId: string
  marginHorizontal: number
  recommendations: Recommendation[]
}

const RecommendationsCarousel = ({ recommendations, insightId, marginHorizontal }: RecommendationsCarouselProps) => {
  return (
    <HoliCarousel
      hideDotIndicators
      marginHorizontal={marginHorizontal}
      slides={recommendations.map((recommendation) => ({
        children: <RecommendationCard insightId={insightId} recommendation={recommendation} />,
      }))}
    />
  )
}
export default memo(RecommendationsCarousel)

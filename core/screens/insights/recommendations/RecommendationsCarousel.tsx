import React, { memo } from 'react'

import RecommendationCard from '@holi/core/screens/insights/recommendations/RecommendationCard'
import { Insight, Recommendation } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

export interface RecommendationsCarouselProps {
  insight: Insight
  recommendations: Recommendation[]
}

const RecommendationsCarousel = ({ recommendations, insight }: RecommendationsCarouselProps) => {
  return (
    <HoliCarousel
      hideDotIndicators
      marginHorizontal={20}
      slides={recommendations.map((recommendation) => ({
        children: <RecommendationCard insight={insight} recommendation={recommendation} />,
      }))}
    />
  )
}
export default memo(RecommendationsCarousel)

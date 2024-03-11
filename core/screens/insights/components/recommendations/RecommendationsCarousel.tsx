import React, { memo } from 'react'

import RecommendationCard from '@holi/core/screens/insights/components/recommendations/RecommendationCard'
import { Recommendation } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

const RecommendationsCarousel: React.FC<{ recommendations: Recommendation[] }> = ({ recommendations }) => {
  return (
    <HoliCarousel
      hideDotIndicators
      marginHorizontal={20}
      slides={recommendations.map((recommendation) => ({
        children: <RecommendationCard recommendation={recommendation} />,
      }))}
    />
  )
}
export default memo(RecommendationsCarousel)

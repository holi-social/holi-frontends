import React, { memo } from 'react'
import { StyleSheet, View } from 'react-native'

import RecommendationCard from '@holi/core/screens/insights/components/recommendations/RecommendationCard'
import { Recommendation } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

const RecommendationsCarousel: React.FC<{ recommendations: Recommendation[] }> = ({ recommendations }) => {
  return (
    <HoliCarousel
      hideDotIndicators
      marginHorizontal={20}
      slides={recommendations.map((recommendation) => ({
        children: (
          <View style={recommendationCarouselStyles.carouselSlide}>
            <RecommendationCard recommendation={recommendation} />
          </View>
        ),
      }))}
    />
  )
}
export default memo(RecommendationsCarousel)

const recommendationCarouselStyles = StyleSheet.create({
  carouselSlide: {
    flex: 1,
  },
})

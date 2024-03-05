import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import createParamHooks from '@holi/core/navigation/hooks/useParam'
import HoliText from '@holi/ui/components/atoms/HoliText'

export type RecommendationDetailPageParams = {
  insightId: string
  recommendationId: string
}

const { useParam } = createParamHooks<RecommendationDetailPageParams>()

const RecommendationDetailPage = () => {
  const [recommendationId] = useParam('recommendationId')

  return (
    <View style={styles.wrapper}>
      <StatusBar style="light" animated />
      <HoliText>Hi!!!! {recommendationId}</HoliText>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 80,
  },
})

export default RecommendationDetailPage

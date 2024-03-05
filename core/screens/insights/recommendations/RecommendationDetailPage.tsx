import { useQuery } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { StyleSheet, View } from 'react-native'

import { isNotFoundError, logError } from '@holi/core/errors/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { RecommendationByIdResponse, recommendationById } from '@holi/core/screens/insights/queries'
import HoliText from '@holi/ui/components/atoms/HoliText'

export type RecommendationDetailPageParams = {
  recommendationId: string
}

const { useParam } = createParamHooks<RecommendationDetailPageParams>()

const RecommendationDetailPage = () => {
  const [recommendationId] = useParam('recommendationId')
  const { replaceRoute } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  const { data: { recommendationById: recommendation } = {} } = useQuery<RecommendationByIdResponse>(
    recommendationById,
    {
      variables: { id: recommendationId },
      notifyOnNetworkStatusChange: true,
      onError: (error) => {
        if (isNotFoundError(error)) {
          return replaceRoute('/404')
        }
        logError(error, 'Failed to load recommendation', {
          location: 'RecommendationDetailPage.recommendationById',
          recommendationId,
        })
      },
    }
  )

  //  TODO: use translated string
  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      title: 'Top Recommendation',
    })
  }, [setScreenOptions])

  return (
    <View style={styles.wrapper}>
      <StatusBar style="light" animated />
      <HoliText>Hi!!!! {recommendationId}</HoliText>
      {recommendation && <HoliText>{recommendation.link}</HoliText>}
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 80,
  },
})

export default RecommendationDetailPage

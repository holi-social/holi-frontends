import { withProfiler } from '@sentry/react'
import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import InsightPreviewBox from '@holi/core/screens/insights/components/InsightPreviewBox'
import { Insight } from '@holi/core/screens/insights/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'

export const INSIGHT_PAGE_SIZE = 4

export type InsightsProps = {
  insights: Insight[]
  style?: StyleProp<ViewStyle>
  loading?: boolean
}

const InsightList = (props: InsightsProps) => {
  const loading = props.loading ?? false

  return (
    <View style={props.style}>
      {/* insights */}
      <HoliGridWrapper>
        {loading
          ? new Array(INSIGHT_PAGE_SIZE).fill(1).map((_, idx) => (
              <HoliGridCell key={idx}>
                <InsightPreviewBox style={styles.insight} loading />
              </HoliGridCell>
            ))
          : props.insights.map((insight) => (
              <HoliGridCell key={insight.id}>
                <InsightPreviewBox key={insight.id} insight={insight} style={styles.insight} />
              </HoliGridCell>
            ))}
      </HoliGridWrapper>
    </View>
  )
}

export default withProfiler(InsightList, { name: 'InsightList' })

const styles = StyleSheet.create({
  insight: {
    flex: 1,
  },
})

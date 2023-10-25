import { withProfiler } from '@sentry/react'
import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import { INSIGHT_PAGE_SIZE } from '@holi/core/screens/homeFeed/components/InsightsOfTheWeek'
import InsightPreviewBox from '@holi/core/screens/insights/components/InsightPreviewBox'
import { Insight } from '@holi/core/screens/insights/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'

export type InsightsProps = {
  insights: Insight[]
  style?: StyleProp<ViewStyle>
  loading?: boolean
}

const InsightList: React.VFC<InsightsProps> = (props) => {
  const insightGridItemsInRow = useBreakpointMatcher()
  const loading = props.loading ?? false

  return (
    <View style={props.style}>
      {/* insights */}
      <HoliGridWrapper itemsInRow={insightGridItemsInRow}>
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

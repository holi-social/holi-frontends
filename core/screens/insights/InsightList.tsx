import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import InsightPreviewBox from '@holi/core/screens/insights/components/InsightPreviewBox'
import { Insight } from '@holi/core/screens/insights/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'

export type InsightsProps = {
  insights: Insight[]
  style?: StyleProp<ViewStyle>
}

const InsightList: React.VFC<InsightsProps> = (props) => {
  const insightGridItemsInRow = useBreakpointMatcher()

  return (
    <View style={props.style}>
      {/* insights */}
      <HoliGridWrapper itemsInRow={insightGridItemsInRow}>
        {
          /** FIXME convert to VirtualizedList, FlatList or SectionList */
          props.insights.map((insight) => (
            <HoliGridCell key={insight.id}>
              <InsightPreviewBox key={insight.id} insight={insight} style={styles.insight} />
            </HoliGridCell>
          ))
        }
      </HoliGridWrapper>
    </View>
  )
}

export default InsightList

const styles = StyleSheet.create({
  insight: {
    flex: 1,
  },
})

import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import InsightPreviewBox from '@holi/core/screens/insights/components/InsightPreviewBox'
import { Insight } from '@holi/core/screens/insights/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type InsightsProps = {
  insights: Insight[]
  style?: StyleProp<ViewStyle>
}

const InsightList: React.VFC<InsightsProps> = (props) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
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

      <HoliButton type="secondary" label={t('homeFeed.insights.loadMoreText')} style={mixins.moreButton} disabled>
        {t('homeFeed.insights.loadMoreText')}
      </HoliButton>
    </View>
  )
}

export default InsightList

const styles = StyleSheet.create({
  insight: {
    flex: 1,
  },
})

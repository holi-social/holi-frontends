import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { logError } from '@holi/core/errors/helpers/logError'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { LastInsightsResponse, lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import TopicPreviewBox from '@holi/core/screens/topics/components/TopicPreviewBox'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type InsightsProps = {
  style?: StyleProp<ViewStyle>
}

const Insights: React.VFC<InsightsProps> = (props) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const numberOfInsights = 2
  const { loading, error, data } = useQuery<LastInsightsResponse>(lastInsightsQuery, {
    variables: { numberOfItems: numberOfInsights },
  })
  const insightGridItemsInRow = useBreakpointMatcher()

  if (error) {
    logError(error, `[InsightsOfTheWeek.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  // if there are no insights in the okuna backend, use fake topics.
  // This way feature branches still have content and don't look empty.
  const insights: Insight[] = data?.lastInsights?.length ? data.lastInsights : fakeTopics

  return (
    <View style={props.style}>
      {/* insights */}
      {/* <View style={styles.insightsContainer}>
        {insights.map((insight) => (
          <TopicPreviewBox key={insight.id} insight={insight} style={styles.insight} />
        ))}
      </View> */}
      <HoliGridWrapper itemsInRow={insightGridItemsInRow}>
        {insights.map((insight) => (
          <HoliGridCell key={insight.id}>
            <TopicPreviewBox key={insight.id} insight={insight} style={styles.insight} />
          </HoliGridCell>
        ))}
      </HoliGridWrapper>

      <HoliButton type="secondary" label={t('homeFeed.insights.loadMoreText')} style={mixins.moreButton} disabled>
        {t('homeFeed.insights.loadMoreText')}
      </HoliButton>
    </View>
  )
}

export default Insights

const styles = StyleSheet.create({
  insight: {
    flex: 1,
    marginTop: 40,
  },
})

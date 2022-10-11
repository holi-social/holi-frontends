import { useQuery } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import { logError } from '@holi/core/errors/helpers/logError'
import { LastInsightsResponse, lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import TopicPreviewBox from '@holi/core/screens/topics/components/TopicPreviewBox'
import fakeTopics from '@holi/core/screens/topics/fakeTopics'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type InsightsListProps = {
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const InsightsList: React.VFC<InsightsListProps> = (props: InsightsListProps) => {
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const mixins = useStyleMixins()
  const styles = getStyles(width)
  const numberOfInsights = 2
  const { loading, error, data } = useQuery<LastInsightsResponse>(lastInsightsQuery, {
    variables: { numberOfItems: numberOfInsights },
  })

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
    <View style={[styles.insightsList, props.style]}>
      {/* insights */}
      <View style={styles.insightsContainer}>
        {insights.map((insight) => (
          <TopicPreviewBox key={insight.id} insight={insight} style={styles.insight} />
        ))}
      </View>

      <HoliButton type="secondary" label={t('homeFeed.insights.loadMoreText')} style={mixins.moreButton} disabled>
        {t('homeFeed.insights.loadMoreText')}
      </HoliButton>
    </View>
  )
}

export default InsightsList

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    insightsList: {},
    insightsContainer: {
      ...Platform.select({
        web: {
          ...(screenWidth > +vars.breakpointM
            ? {
                flexDirection: 'row',
                gap: 24,
              }
            : {}),
        },
      }),
    },
    insight: {
      flex: 1,
      marginTop: 40,
    },
  })

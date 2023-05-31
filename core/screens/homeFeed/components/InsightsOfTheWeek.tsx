import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, View, ViewStyle } from 'react-native'

import { Pagination } from '@holi/core/pagination/Pagination'
import InsightsOfTheWeekList from '@holi/core/screens/homeFeed/components/InsightsOfTheWeekList'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export const INSIGHT_PAGE_SIZE = 4

export type InsightsOfTheWeekProps = {
  style?: StyleProp<ViewStyle>
}

const InsightsOfTheWeek: React.FC<InsightsOfTheWeekProps> = (props: InsightsOfTheWeekProps) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()

  const queryOptions = {
    queryPath: 'lastInsights',
    pageSize: INSIGHT_PAGE_SIZE,
  }

  return (
    <View style={[mixins.container, props.style]}>
      <Pagination
        query={lastInsightsQuery}
        queryOptions={queryOptions}
        fetchMoreButtonProps={{
          type: 'secondary',
          style: mixins.moreButton,
          testID: 'btn-insights-list-load-more',
        }}
        fetchMoreButtonLabel={t('homeFeed.insights.loadMoreText')}
      >
        <InsightsOfTheWeekList />
      </Pagination>
    </View>
  )
}

export default InsightsOfTheWeek

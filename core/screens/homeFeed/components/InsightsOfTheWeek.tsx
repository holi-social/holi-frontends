import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'

import { Pagination } from '@holi/core/pagination/Pagination'
import InsightsOfTheWeekList from '@holi/core/screens/homeFeed/components/InsightsOfTheWeekList'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type InsightsOfTheWeekProps = {
  style?: StyleProp<ViewStyle>
}

const INSIGHT_PAGE_SIZE = 4

const InsightsOfTheWeek: React.FC<InsightsOfTheWeekProps> = (props: InsightsOfTheWeekProps) => {
  const mixins = useStyleMixins()

  const queryOptions = {
    queryPath: 'lastInsights',
    pageSize: INSIGHT_PAGE_SIZE,
  }
  // TODO(SF)
  // const fetchingMoreButtonText = isFetchingMore ? t('global.loading') : t('homeFeed.insights.loadMoreText')

  return (
    <View style={[mixins.container, props.style]}>
      <Pagination
        query={lastInsightsQuery}
        queryOptions={queryOptions}
        buttonProps={{
          type: 'secondary',
          style: mixins.moreButton,
          testID: 'btn-insights-list-load-more',
        }}
      >
        <InsightsOfTheWeekList />
      </Pagination>
    </View>
  )
}

export default InsightsOfTheWeek

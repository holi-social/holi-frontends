import { withProfiler } from '@sentry/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Pagination } from '@holi/core/pagination/Pagination'
import InsightsOfTheWeekList from '@holi/core/screens/homeFeed/components/InsightsOfTheWeekList'
import { lastInsightsQuery } from '@holi/core/screens/insights/queries'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export const INSIGHT_PAGE_SIZE = 4

const InsightsOfTheWeek: React.FC = () => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()

  const queryOptions = {
    queryPath: 'lastInsights',
    pageSize: INSIGHT_PAGE_SIZE,
  }

  return (
    <View style={mixins.container}>
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

export default withProfiler(InsightsOfTheWeek, { name: 'InsightsOfTheWeek' })

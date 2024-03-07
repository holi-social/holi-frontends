import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import InsightFavoriteCard from '@holi/core/screens/favorites/components/InsightFavoriteCard'
import { Insight } from '@holi/core/screens/insights/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'

const InsightFavoritesList = () => {
  const { data: insights } = usePaginationContext<Insight>()
  const { t } = useTranslation()

  return insights.length > 0 ? (
    <View>
      {insights.map((insight) => (
        <HoliGridCell key={insight.id}>
          <InsightFavoriteCard insight={insight} />
        </HoliGridCell>
      ))}
    </View>
  ) : (
    /**TODO: add no result page*/
    <HoliNoResults firstText={t('favorites.noResults.title')} secondText={''} />
  )
}

export default InsightFavoritesList

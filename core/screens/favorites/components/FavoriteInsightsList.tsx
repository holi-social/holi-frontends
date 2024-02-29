import React from 'react'
import { useTranslation } from 'react-i18next'

import { usePaginationContext } from '@holi/core/pagination/Pagination'
import { Insight } from '@holi/core/screens/insights/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'

const FavoriteInsightsList = () => {
  const { data: insights } = usePaginationContext<Insight>()
  const { t } = useTranslation()

  return insights.length > 0 ? (
    <HoliGridWrapper itemsInRow={1} gap={16}>
      {insights.map((item) => (
        <HoliGridCell key={item.id}>{/**TODO: Add favorite insight card*/}</HoliGridCell>
      ))}
    </HoliGridWrapper>
  ) : (
    /**TODO: add no result page*/
    <HoliNoResults firstText={t('favorites.noResults.title')} secondText={''} />
  )
}

export default FavoriteInsightsList

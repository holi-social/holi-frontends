import React from 'react'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import FavoriteInsightsList from '@holi/core/screens/favorites/components/FavoriteInsightsList'
import { favoriteInsightsQuery } from '@holi/core/screens/insights/queries'

const FavoritesList = () => {
  const { displayError } = useErrorHandling()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: 10,
    queryPath: 'favoriteInsights',
    onError: (error) => {
      displayError(error, 'Failed to load favorite insights', {
        location: 'Favorites.favoriteInsightsQuery',
      })
    },
  }

  return (
    <Pagination
      query={favoriteInsightsQuery}
      queryOptions={{
        ...queryOptions,
      }}
      loadMoreOnScroll
    >
      <FavoriteInsightsList />
    </Pagination>
  )
}

export default FavoritesList

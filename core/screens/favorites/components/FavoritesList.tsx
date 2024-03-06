import React from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import InsightFavoritesList from '@holi/core/screens/favorites/components/InsightFavoritesList'
import { favoriteInsightsQuery } from '@holi/core/screens/insights/queries'

const FavoritesList = () => {
  const { displayError } = useErrorHandling()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: 20,
    queryPath: 'favoriteInsights',
    onError: (error) => {
      displayError(error, 'Failed to load favorite insights', {
        location: 'Favorites.favoriteInsightsQuery',
      })
    },
  }

  return (
    <View style={styles.wrapper}>
      <Pagination
        query={favoriteInsightsQuery}
        queryOptions={{
          ...queryOptions,
        }}
        loadMoreOnScroll
      >
        <InsightFavoritesList />
      </Pagination>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    ...Platform.select({
      web: {
        alignItems: 'center',
      },
    }),
  },
})

export default FavoritesList

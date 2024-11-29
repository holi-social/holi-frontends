import { Screen } from '@holi/core/components/Screen'
import {
  typesenseApiKey,
  typesenseCollection,
  typesenseHost,
  typesensePort,
  typesenseProtocol,
} from '@holi/core/helpers/config'
import { InfiniteHits } from '@holi/core/screens/search/typesense/InfiniteHits'
import { RefinementList } from '@holi/core/screens/search/typesense/RefinementList'
import { SearchBox } from '@holi/core/screens/search/typesense/SearchBox'
import { useStyles } from 'holi-bricks/hooks'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useMemo } from 'react'
import { InstantSearch } from 'react-instantsearch-core'
import { View } from 'react-native'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

const searchFields = ['title_de', 'title_en', 'description_de', 'description_en', 'location']

const embeddingFields = ['embedding']

const createTypesenseInstantSearchAdapter = () => {
  return new TypesenseInstantSearchAdapter({
    server: {
      apiKey: typesenseApiKey,
      nodes: [
        {
          host: typesenseHost,
          port: typesensePort,
          protocol: typesenseProtocol,
        },
      ],
      cacheSearchResultsForSeconds: 2 * 60,
    },
    additionalSearchParameters: {
      query_by: searchFields.join(',') + ',' + embeddingFields.join(','),
      highlight_full_fields: searchFields.join(','),
    },
  })
}

export const TypesenseSearch = () => {
  const { styles, theme } = useStyles(stylesheet)
  const typesenseInstantSearchAdapter = useMemo(createTypesenseInstantSearchAdapter, [])
  return (
    <InstantSearch searchClient={typesenseInstantSearchAdapter.searchClient} indexName={typesenseCollection}>
      <Screen
        backgroundColor={theme.colors.background}
        preset={'fixed'}
        contentPadding={{ left: 'xs', top: 'xs' }}
        StickyTopComponent={
          <>
            <View style={styles.searchBoxContainer}>
              <SearchBox />
            </View>
            <View style={styles.refinementListContainer}>
              <RefinementList />
            </View>
          </>
        }
      >
        <InfiniteHits />
      </Screen>
    </InstantSearch>
  )
}

const stylesheet = createStyleSheet(() => ({
  searchBoxContainer: {
    paddingTop: Spacing.xxs,
    paddingLeft: Spacing.xs,
    paddingRight: Spacing.xs,
  },
  refinementListContainer: {
    paddingTop: Spacing.xxs,
    paddingLeft: Spacing.xs,
  },
}))

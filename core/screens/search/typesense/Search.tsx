import {
  typesenseApiKey,
  typesenseCollection,
  typesenseHost,
  typesensePort,
  typesenseProtocol,
} from '@holi/core/helpers/config'
import { SearchFacetsChips } from '@holi/core/screens/search/typesense/SearchFacetsChips'
import { SearchHitInfiniteList } from '@holi/core/screens/search/typesense/SearchHitInfiniteList'
import { SearchTextInput } from '@holi/core/screens/search/typesense/SearchTextInput'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyles } from 'holi-bricks/hooks'
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

export const Search = () => {
  const { styles } = useStyles(stylesheet)
  const typesenseInstantSearchAdapter = useMemo(createTypesenseInstantSearchAdapter, [])
  return (
    <View style={styles.container}>
      <InstantSearch searchClient={typesenseInstantSearchAdapter.searchClient} indexName={typesenseCollection}>
        <View style={styles.searchBoxContainer}>
          <SearchTextInput />
        </View>
        <View style={styles.searchFacetsChipsContainer}>
          <SearchFacetsChips />
        </View>
        <View style={styles.hitsContainer}>
          <SearchHitInfiniteList />
        </View>
      </InstantSearch>
    </View>
  )
}

// TODO restyle after introducing <Screen> component (HOLI-10827)
const stylesheet = createStyleSheet((theme) => ({
  container: {
    backgroundColor: theme.colors.bg.page,
    gap: dimensions.spacingS,
    paddingTop: dimensions.topBarHeight + dimensions.spacingS, // TODO probably not the right way to do this
    paddingBottom: dimensions.bottomBarHeight, // TODO probably not the right way to do this
  },
  searchBoxContainer: {
    paddingLeft: dimensions.spacingS,
    paddingRight: dimensions.spacingS,
  },
  searchFacetsChipsContainer: {
    paddingLeft: dimensions.spacingS,
  },
  hitsContainer: {
    paddingLeft: dimensions.spacingS,
    height: '100%',
  },
}))

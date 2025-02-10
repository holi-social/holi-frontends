import { Screen } from '@holi/core/components/Screen'
import {
  typesenseApiKey,
  typesenseCollection,
  typesenseHost,
  typesensePort,
  typesenseProtocol,
} from '@holi/core/helpers/config'
import createParamHooks, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import { SearchFacetsChips } from '@holi/core/screens/search/typesense/SearchFacetsChips'
import { SearchHitInfiniteList } from '@holi/core/screens/search/typesense/SearchHitInfiniteList'
import { SearchTextInput } from '@holi/core/screens/search/typesense/SearchTextInput'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { InstantSearch } from 'react-instantsearch-core'
import { Dimensions, Platform, View } from 'react-native'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { SearchExamples } from '@holi/core/screens/search/typesense/SearchExamples'

export type SearchParams = {
  query?: string
  facet?: string
}

const { useParam, useUpdateParams } = createParamHooks<SearchParams>()

const searchFields = ['title_de', 'title_en', 'description_de', 'description_en', 'location', 'user_full_name']

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
      vector_query: 'embedding:([], k: 200, distance_threshold: 0.4)',
    },
  })
}

export const Search = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const typesenseInstantSearchAdapter = useMemo(createTypesenseInstantSearchAdapter, [])
  const [queryParam] = useParam('query', singleParamConfig)
  const [facetParam] = useParam('facet', singleParamConfig)
  const updateParams = useUpdateParams({ web: { replace: true } })

  return (
    <InstantSearch searchClient={typesenseInstantSearchAdapter.searchClient} indexName={typesenseCollection}>
      <Screen
        backgroundColor="page"
        preset="fixed"
        contentContainerPadding={{}}
        contentContainerStyle={{ flex: 1 }} // this is needed because flash list has no initial size, it calculates it while rendering.
        style={styles.screen}
        headerOptions={{
          title: t('search.title'),
          headerTitleAlign: 'center',
          navigationCustomOptions: {
            footerShown: false,
          },
        }}
        StickyTopComponent={
          <View style={styles.filterContainer}>
            <HoliBox padding={[0, dimensions.spacingS]}>
              <SearchTextInput queryParam={queryParam} onQueryChange={(query) => updateParams({ query })} />
            </HoliBox>
            <SearchFacetsChips initialFacet={facetParam} onFacetChange={(facet) => updateParams({ facet })} />
          </View>
        }
      >
        {queryParam ? (
          <ErrorBoundary>
            <SearchHitInfiniteList />
          </ErrorBoundary>
        ) : (
          <SearchExamples onQuerySelect={(query) => updateParams({ query })} />
        )}
      </Screen>
    </InstantSearch>
  )
}

const TOP_COMPONENT_HEIGHT = 144
const stylesheet = createStyleSheet((theme) => ({
  filterContainer: {
    paddingTop: dimensions.spacingS,
    gap: dimensions.spacingS,
    flex: 1,
    backgroundColor: theme.colors.bg.page,
  },
  screen: {
    ...Platform.select({
      web: {
        maxHeight: Dimensions.get('window').height - dimensions.topBarHeight - TOP_COMPONENT_HEIGHT,
      },
    }),
  },
}))

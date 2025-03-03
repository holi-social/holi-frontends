import { Screen } from '@holi/core/components/Screen'
import {
  typesenseApiKey,
  typesenseCollection,
  typesenseHost,
  typesensePort,
  typesenseProtocol,
} from '@holi/core/helpers/config'
import createParamHooks, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import { SearchFacetsTabs } from '@holi/core/screens/search/typesense/SearchFacetsTabs'
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

// Original fields for fallback or combined usage
const searchFields = ['title_de', 'title_en', 'description_de', 'description_en', 'location', 'user_full_name']
const embeddingFields = ['embedding']

const createTypesenseInstantSearchAdapter = (facet?: string) => {
  const facetConfigurations: Record<string, { query_by: string; query_by_weights: string; vector_query: string }> = {
    volunteering: {
      query_by: [...searchFields, ...embeddingFields].join(','),
      query_by_weights: '3,3,1,1,1,0,1',
      vector_query: 'embedding:([], k: 200, distance_threshold: 0.9)',
    },
    space: {
      query_by: [...searchFields, ...embeddingFields].join(','),
      query_by_weights: '10,10,1,1,1,0,1',
      vector_query: 'embedding:([], k: 150, distance_threshold: 0.5)',
    },
    profile: {
      query_by: [...searchFields, ...embeddingFields].join(','),
      query_by_weights: '0,0,0,0,0,10,1',
      vector_query: 'embedding:([], k: 100, distance_threshold: 0.1)',
    },
  }

  // Use the provided facet or fallback to a default ('volunteering')
  const config = facetConfigurations[facet || 'volunteering']

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
      query_by: config.query_by,
      query_by_weights: config.query_by_weights,
      vector_query: config.vector_query,
    },
  })
}

export const Search = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const [queryParam] = useParam('query', singleParamConfig)
  const [facetParam] = useParam('facet', singleParamConfig)
  const updateParams = useUpdateParams({ web: { replace: true } })

  // Recreate the adapter whenever the facet changes
  const typesenseInstantSearchAdapter = useMemo(() => createTypesenseInstantSearchAdapter(facetParam), [facetParam])

  const queryParamIsEmpty = !queryParam || queryParam === '*'

  return (
    <InstantSearch
      searchClient={typesenseInstantSearchAdapter.searchClient}
      indexName={typesenseCollection}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Screen
        backgroundColor="page"
        preset="fixed"
        contentContainerStyle={{ flex: 1 }} // needed for FlashList initial size calculations.
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
            <SearchFacetsTabs initialFacet={facetParam} onFacetChange={(facet) => updateParams({ facet })} />
          </View>
        }
      >
        {queryParamIsEmpty ? (
          <SearchExamples onQuerySelect={(query) => updateParams({ query })} />
        ) : (
          <ErrorBoundary>
            <SearchHitInfiniteList />
          </ErrorBoundary>
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

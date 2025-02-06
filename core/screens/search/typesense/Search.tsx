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

export type SearchParams = {
  query?: string
  facet?: string
}

const { useParam, useUpdateParams } = createParamHooks<SearchParams>()

type QueryField = { name: string; weight: number }
type EmbeddingField = QueryField

const searchFields: QueryField[] = [
  { name: 'title_de', weight: 1 },
  { name: 'title_en', weight: 1 },
  { name: 'description_de', weight: 1 },
  { name: 'description_en', weight: 1 },
  { name: 'location', weight: 1 },
  { name: 'user_full_name', weight: 10 },
]
const searchFieldNames = searchFields.map(({ name }) => name)
const searchFieldWeights = searchFields.map(({ weight }) => weight)

const embeddingFields: EmbeddingField[] = [{ name: 'embedding', weight: 1 }]
const embeddingFieldNames = embeddingFields.map(({ name }) => name)
const embeddingFieldWeights = embeddingFields.map(({ weight }) => weight)

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
      query_by: searchFieldNames.join(',') + ',' + embeddingFieldNames.join(','),
      query_by_weights: searchFieldWeights.concat(embeddingFieldWeights).join(','),
      vector_query: 'embedding:([], k: 200, distance_threshold: 0.4)',
    },
  })
}

export const Search = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const typesenseInstantSearchAdapter = useMemo(createTypesenseInstantSearchAdapter, [])
  const [initialQuery] = useParam('query', singleParamConfig)
  const [initialFacet] = useParam('facet', singleParamConfig)
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
              <SearchTextInput initialQuery={initialQuery} onQueryChange={(query) => updateParams({ query })} />
            </HoliBox>
            <SearchFacetsChips initialFacet={initialFacet} onFacetChange={(facet) => updateParams({ facet })} />
          </View>
        }
      >
        <ErrorBoundary>
          <SearchHitInfiniteList />
        </ErrorBoundary>
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

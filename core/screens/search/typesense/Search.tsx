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
import { View } from 'react-native'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'

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
      highlight_full_fields: searchFields.join(','),
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

const stylesheet = createStyleSheet((theme) => ({
  filterContainer: {
    paddingTop: dimensions.spacingS,
    gap: dimensions.spacingS,
    flex: 1,
    backgroundColor: theme.colors.bg.page,
  },
}))

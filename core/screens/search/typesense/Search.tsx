import { Screen } from '@holi/core/components/Screen'
import { typesenseCollection } from '@holi/core/helpers/config'
import createParamHooks, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import { SearchFacetsTabs } from '@holi/core/screens/search/typesense/SearchFacetsTabs'
import { SearchHitInfiniteList } from '@holi/core/screens/search/typesense/SearchHitInfiniteList'
import { SearchTextInput } from '@holi/core/screens/search/typesense/SearchTextInput'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InstantSearch } from 'react-instantsearch-core'
import { Dimensions, Platform, View } from 'react-native'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { SearchExamples } from '@holi/core/screens/search/typesense/SearchExamples'
import { createTypesenseInstantSearchAdapter } from './createTypesenseAdapter'
import { SearchLocationSelection } from '@holi/core/screens/search/typesense/SearchLocationSelection'
import { useGeolocationDetailsWithSuggestion } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { useErrorHandling } from '@holi/core/errors/hooks'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

export type SearchParams = {
  query?: string
  facet?: string
  location?: string
}

const { useParam, useUpdateParams } = createParamHooks<SearchParams>()

export const Search = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const { displayError } = useErrorHandling()
  const [queryParam] = useParam('query', singleParamConfig)
  const [facetParam] = useParam('facet', singleParamConfig)
  const [geolocationId] = useParam('location', singleParamConfig)
  const { geolocationSuggestion, geolocationError, loadingGeolocation } = useGeolocationDetailsWithSuggestion(
    geolocationId,
    (error) =>
      displayError(error, 'Failed to load geolocation', {
        displayMessage: t('TODO'), // TODO(SF) add translation
        location: 'Search.useGeolocationCoordinates',
        geolocationId,
      })
  )
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(geolocationSuggestion)

  const updateParams = useUpdateParams({ web: { replace: true } })

  // Recreate the adapter whenever the facet changes
  const typesenseInstantSearchAdapter = useMemo(
    () => createTypesenseInstantSearchAdapter(facetParam, selectedLocation),
    [facetParam, selectedLocation]
  )

  const displaySearchExamples = (!queryParam || queryParam === '*') && (!geolocationId || geolocationError)

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
              {!loadingGeolocation && (
                <SearchLocationSelection
                  initialSelection={geolocationSuggestion}
                  onLocationChange={(location) => {
                    setSelectedLocation(location)
                    updateParams({ location: location?.id })
                  }}
                />
              )}
            </HoliBox>
            <SearchFacetsTabs
              initialFacet={facetParam}
              onFacetChange={(newFacet) => updateParams({ facet: newFacet })}
            />
          </View>
        }
      >
        {displaySearchExamples ? (
          <SearchExamples onQuerySelect={(query) => updateParams({ query })} />
        ) : (
          <ErrorBoundary>
            <SearchHitInfiniteList loadingParameters={loadingGeolocation} />
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

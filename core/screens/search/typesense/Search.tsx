import { Screen } from '@holi/core/components/Screen'
import createParamHooks, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import { SearchFacetsTabs } from '@holi/core/screens/search/typesense/SearchFacetsTabs'
import { SearchHitInfiniteList } from '@holi/core/screens/search/typesense/SearchHitInfiniteList'
import { SearchTextInput } from '@holi/core/screens/search/typesense/SearchTextInput'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, Platform, View } from 'react-native'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { SearchLocationSelection } from '@holi/core/screens/search/typesense/SearchLocationSelection'
import { useGeolocationDetailsWithSuggestion } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSearchFilter } from '@holi/core/screens/search/typesense/hooks/useSearchFilter'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'

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

  // Query parameters
  const [queryParam] = useParam('query', singleParamConfig)
  const [facetParam = 'volunteering'] = useParam('facet', singleParamConfig)
  const [geolocationId] = useParam('location', singleParamConfig)
  const updateParams = useUpdateParams({ web: { replace: true } })

  // Determine initial geolocation selection from query parameters
  const { geolocationSuggestion, loadingGeolocation } = useGeolocationDetailsWithSuggestion(geolocationId, (error) => {
    updateParams({ location: undefined }) // TODO(SF) test
    displayError(error, 'Failed to load geolocation', {
      displayMessage: t('TODO'), // TODO(SF) add translation
      location: 'Search.useGeolocationCoordinates',
      geolocationId,
    })
  })

  const { filter, isFilterEmpty, setQuery, setFacet, setLocation } = useSearchFilter(
    {
      query: queryParam,
      facet: facetParam,
      location: geolocationSuggestion,
    },
    (newFilter) =>
      updateParams({
        query: newFilter.query,
        facet: newFilter.facet,
        location: newFilter.location?.id,
      })
  )

  return (
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
            <SearchTextInput currentQuery={filter.query} onQueryChange={setQuery} />
            <HoliGap size="xs" />
            {/* TODO(SF) hide for facet profile && handle loading state */}
            <SearchLocationSelection currentLocation={filter.location} onLocationChange={setLocation} />
          </HoliBox>
          <SearchFacetsTabs currentFacet={filter.facet} onFacetChange={setFacet} />
        </View>
      }
    >
      <ErrorBoundary>
        <SearchHitInfiniteList
          filter={filter}
          isFilterEmpty={isFilterEmpty}
          loadingParameters={loadingGeolocation}
          onQuerySelect={setQuery}
        />
      </ErrorBoundary>
    </Screen>
  )
}

const TOP_COMPONENT_HEIGHT = 178
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

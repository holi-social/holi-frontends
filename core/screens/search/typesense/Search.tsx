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
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InstantSearch } from 'react-instantsearch-core'
import { Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native'
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { SearchExamples } from '@holi/core/screens/search/typesense/SearchExamples'
import LocationSelection from './SearchLocationSelection'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { Edit2 } from '@holi/icons/src/generated'

export type SearchParams = {
  query?: string
  facet?: string
  location?: string
}

const { useParam, useUpdateParams } = createParamHooks<SearchParams>()

const searchFields = ['title_de', 'title_en', 'description_de', 'description_en', 'location', 'user_full_name']
const embeddingFields = ['embedding']

const facetConfigurations: Record<string, { query_by: string; query_by_weights: string; vector_query: string }> = {
  volunteering: {
    query_by: [...searchFields, ...embeddingFields].join(','),
    query_by_weights: '1,1,1,1,100,0,10',
    vector_query: 'embedding:([], k: 200, alpha:0.9, distance_threshold: 0.7)',
  },
  space: {
    query_by: [...searchFields, ...embeddingFields].join(','),
    query_by_weights: '10,10,1,1,1,0,5',
    vector_query: 'embedding:([], k: 150, distance_threshold: 0.5)',
  },
  profile: {
    query_by: [...searchFields, ...embeddingFields].join(','),
    query_by_weights: '0,0,0,0,0,10,0',
    vector_query: 'embedding:([], k: 100, distance_threshold: 0.0)',
  },
}

const createTypesenseInstantSearchAdapter = (facet?: string, locationParam?: string) => {
  // Use the provided facet or fallback to a default ('volunteering')
  const config = facetConfigurations[facet || 'volunteering']

  let filter_by = ''
  let sort_by = ''

  // Build the facet filter
  if (facet === 'volunteering') {
    filter_by = 'type:=[`volunteering`]'
  } else if (facet === 'space') {
    filter_by = 'type:=[`space`]'
  } else if (facet === 'profile') {
    filter_by = 'type:=[`profile`]'
  }

  // Add the location filter if locationParam is set
  if (locationParam) {
    const [lat, lng] = locationParam.split(',').map(parseFloat)
    const locationFilter = `location_lat_lng:(${lat}, ${lng}, 30 km)`

    // If we already have a facet filter, unify them with "&&"
    if (filter_by) {
      filter_by += ` && ${locationFilter}`
    } else {
      filter_by = locationFilter
    }

    // For sorting by distance
    sort_by = `location_lat_lng(${lat}, ${lng}):asc`
  }

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
    },
    additionalSearchParameters: {
      query_by: config.query_by,
      query_by_weights: config.query_by_weights,
      vector_query: config.vector_query,
      ...(filter_by && { filter_by }),
      ...(sort_by && { sort_by }),
    },
  })
}

export const Search = () => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

  // Route params
  const [queryParam] = useParam('query', singleParamConfig)
  const [facetParam] = useParam('facet', singleParamConfig)
  const [locationParam, setLocationParam] = useParam('location', singleParamConfig)

  // Modal visibility
  const [locationModalVisible, setLocationModalVisible] = useState(false)

  // Local state for the location's display name
  const [locationName, setLocationName] = useState('Bundesweit')

  const updateParams = useUpdateParams({ web: { replace: true } })

  // Recreate the adapter whenever the facet changes
  const typesenseInstantSearchAdapter = useMemo(
    () => createTypesenseInstantSearchAdapter(facetParam, locationParam),
    [facetParam, locationParam]
  )

  const queryParamIsEmpty = !queryParam || queryParam === '*'

  const handleLocationSave = (latLngString: string | null, label?: string) => {
    if (!latLngString) {
      setLocationParam(undefined)
      setLocationName('Bundesweit')
      // Force the search bar to reset
      updateParams({ query: '', location: undefined })
    } else {
      setLocationParam(latLngString)
      setLocationName(label || 'Bundesweit')
      // Reset the search bar by clearing the query
      updateParams({ query: '', location: latLngString })
    }
    // Close modal
    setLocationModalVisible(false)
  }

  // Called when user taps 'Back'
  const handleBack = () => {
    setLocationModalVisible(false)
  }

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
              <TouchableOpacity style={styles.locationChip} onPress={() => setLocationModalVisible(true)}>
                <Text style={styles.locationChipText}>{locationName}</Text>
                <Edit2 width={14} height={14} style={styles.editIcon} />
              </TouchableOpacity>
            </HoliBox>
            <SearchFacetsTabs
              initialFacet={facetParam}
              onFacetChange={(newFacet) => updateParams({ facet: newFacet })}
            />
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

      <HoliModal
        shown={locationModalVisible}
        onDismiss={handleBack}
        label="Location Filter"
        relativeHeight={0.8}
        autoHeight={false}
        testID="location-filter-modal"
      >
        <LocationSelection
          testID="search-location-selection"
          selected={undefined}
          onChange={handleLocationSave}
          onBackPress={handleBack}
          onSavePress={() => {
            // child calls onChange internally
          }}
          autoFocus
        />
      </HoliModal>
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
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start', // Only wrap text, no extra horizontal space
    backgroundColor: '#FFF',
    borderColor: '#E2E2E2', // Light gray border
    borderWidth: 1,
    borderRadius: 16, // Rounded edges for a “chip” look
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 8, // Larger spacing above/below
  },
  locationChipText: {
    marginRight: 6, // Space before pencil icon
    color: '#333',
    fontSize: 14,
  },
  editIcon: {
    tintColor: '#666', // Dark gray icon color if your icon is tintable
  },
}))

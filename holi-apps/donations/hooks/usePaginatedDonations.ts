import { useMemo } from 'react'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import type { Typesense_SearchParams_Input } from '@holi/api/graphql/graphql-codegen'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

interface UsePaginatedDonationsProps {
  pageSize: number
  selectedLocation?: GeolocationSuggestion
  loadingGeolocation?: boolean
  onError?: (error: Error) => void
}

export const usePaginatedDonations = ({
  pageSize,
  selectedLocation,
  loadingGeolocation,
  onError,
}: UsePaginatedDonationsProps) => {
  const language = useUserLanguage()

  const parameters = useMemo<Typesense_SearchParams_Input>(() => {
    const filterBy = ['type:=[donation]']
    const sortBy = []

    if (selectedLocation) {
      const { latitude, longitude } = selectedLocation.coordinates || {}
      if (latitude && longitude) {
        filterBy.push(`location_lat_lng:(${latitude},${longitude},30 km)`)
        sortBy.push(`location_lat_lng(${latitude},${longitude},precision:5km):asc`)
      }
    }
    return {
      filter_by: filterBy.join('&&'),
      sort_by: sortBy.join(','),
      per_page: pageSize,
    }
  }, [selectedLocation, pageSize])

  const { state, isLoading, fetchNextPage, refetch } = useTypesensePaginationQuery({
    parameters,
    skip: loadingGeolocation,
    onError,
  })

  const projects = useMemo(
    () => state.hits.map((hit) => localizeTypesenseDocument(hit.document, language)),
    [language, state.hits]
  )

  useOnRefresh(refetch)

  return {
    isLoading: isLoading || loadingGeolocation,
    fetchNextPage,
    canFetchMore: state.canFetchMore,
    totalResults: state.totalResults,
    projects,
  }
}

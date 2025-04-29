import { type ApolloError, useQuery } from '@apollo/client'

import { logError } from '@holi/core/errors/helpers'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { type GeoPlaceDetailsResponse, geoPlaceDetailsQuery } from '@holi/core/geolocation/queries'
import type { PlaceDetails } from '@holi/core/geolocation/typings'

interface GeolocationDetails {
  geolocationDetails?: PlaceDetails
  geolocationError?: ApolloError
  loadingGeolocation: boolean
}

type useGeolocationHook<T extends GeolocationDetails = GeolocationDetails> = (
  locationId?: string,
  onError?: (error: ApolloError) => void
) => T

export const useGeolocationDetails: useGeolocationHook = (locationId, onError) => {
  const { data, loading, error } = useQuery<GeoPlaceDetailsResponse>(geoPlaceDetailsQuery, {
    variables: { id: locationId },
    skip: !locationId,
    onError: (error) => {
      logError(error, 'Failed to fetch geolocation details', {
        location: 'useGeolocationDetails.fetchPlaceDetails',
        geolocationId: locationId,
      })
      onError?.(error)
    },
  })

  return {
    geolocationDetails: data?.geo_placeDetails,
    loadingGeolocation: loading || (!!locationId && !(data?.geo_placeDetails || error)),
    geolocationError: error,
  }
}

export const useGeolocationDetailsWithSuggestion: useGeolocationHook<
  GeolocationDetails & { geolocationSuggestion?: GeolocationSuggestion }
> = (locationId, onError) => {
  const { geolocationDetails, ...loadingVars } = useGeolocationDetails(locationId, onError)
  const detailProperties = geolocationDetails?.geolocation?.properties
  const geolocationSuggestion = geolocationDetails && {
    ...geolocationDetails,
    label: geolocationDetails.name,
    coordinates: detailProperties ? { latitude: detailProperties.lat, longitude: detailProperties.lon } : undefined,
  }

  return {
    ...loadingVars,
    geolocationDetails,
    geolocationSuggestion,
  }
}

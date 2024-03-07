import { useQuery } from '@apollo/client'

import { logError } from '@holi/core/errors/helpers'
import { GeoPlaceDetailsResponse, geoPlaceDetailsQuery } from '@holi/core/geolocation/queries'

export const useGeolocationDetails = (geolocationId: string | undefined) => {
  const { data, loading, error } = useQuery<GeoPlaceDetailsResponse>(geoPlaceDetailsQuery, {
    variables: { id: geolocationId },
    skip: !geolocationId,
    onError: (error) =>
      logError(error, 'Failed to fetch geolocation details', {
        location: 'useGeolocationDetails.fetchPlaceDetails',
        geolocationId,
      }),
  })

  return {
    geolocationDetails: data?.geo_placeDetails,
    loadingGeolocation: loading,
    geolocationError: error,
  }
}

import { useLazyQuery } from '@apollo/client'
import { useEffect } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { GeoPlaceDetailsResponse, geoPlaceDetailsQuery } from '@holi/core/location/queries'

export const useGeolocationDetails = (geolocationId: string | undefined) => {
  const [fetchPlaceDetails, { data, loading, error }] = useLazyQuery<GeoPlaceDetailsResponse>(geoPlaceDetailsQuery)

  useEffect(() => {
    if (geolocationId) {
      fetchPlaceDetails({
        variables: { id: geolocationId },
        onError: (error) => logError(error, `[useGeolocationDetails.ts] ${error.message}`),
      })
    }
  }, [fetchPlaceDetails, geolocationId])

  return {
    geolocationDetails: data?.geo_placeDetails,
    loadingGeolocation: loading,
    geolocationError: error,
  }
}

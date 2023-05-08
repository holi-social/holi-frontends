import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { GeoPlaceDetailsResponse, geoPlaceDetailsQuery } from '@holi/core/location/queries'
import { PlaceDetails } from '@holi/core/location/typings'

export const useGeolocationDetails = (geolocationId: string | undefined) => {
  const [details, setDetails] = useState<PlaceDetails | undefined>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(undefined)

  const [fetchPlaceDetails] = useLazyQuery<GeoPlaceDetailsResponse>(geoPlaceDetailsQuery)

  useEffect(() => {
    if (geolocationId) {
      setLoading(true)
      fetchPlaceDetails({ variables: { id: geolocationId } })
        .then((response) => {
          const { geolocation, name } = response.data?.geo_placeDetails || {}
          setDetails(geolocation && name ? response.data?.geo_placeDetails : undefined)
          setError(undefined)
        })
        .catch((error) => {
          setDetails(undefined)
          setError(error)
          logError(error, `[useGeolocationDetails.ts] ${error.message}`)
        })
        .finally(() => setLoading(false))
    }
  }, [fetchPlaceDetails, geolocationId])

  return {
    geolocationDetails: details,
    loadingGeolocation: loading,
    geolocationError: error,
  }
}

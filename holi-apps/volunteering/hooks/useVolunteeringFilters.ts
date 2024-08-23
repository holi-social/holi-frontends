import { useCallback, useEffect, useMemo, useState } from 'react'

import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagToggle } from '@holi/core/featureFlags/hooks/useFeatureFlagToggle'
import { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import createParamHooks, { singleParamConfig, webReplaceQueryConfig } from '@holi/core/navigation/hooks/useParam'

import { VolunteeringFilterParams, VolunteeringFilters } from '@holi-apps/volunteering/types'

const { useParam, useUpdateParams } = createParamHooks<VolunteeringFilterParams>()

export const useVolunteeringFilters = (onSubmit: () => void) => {
  const discoveryV1Toggle = useFeatureFlagToggle(FeatureFlagKey.VOLUNTEERING_DISCOVERY_V1)

  const [location] = useParam('location', singleParamConfig)
  const [category] = useParam('category', singleParamConfig)
  const updateParams = useUpdateParams(webReplaceQueryConfig)
  const { geolocationDetails, geolocationError, loadingGeolocation } = useGeolocationDetails(location)
  const initialLocationSelection = useMemo<GeolocationSuggestion | undefined>(() => {
    return (
      geolocationDetails && {
        ...geolocationDetails,
        label: geolocationDetails.name,
      }
    )
  }, [geolocationDetails])
  // TODO(SF) legacy?
  const [filters, setFilters] = useState({ location: initialLocationSelection, category })
  const loadingFilters = loadingGeolocation || (!!location && !geolocationDetails && !geolocationError)
  const isFiltering = !!(location || category)

  const submit = useCallback(
    (filters?: VolunteeringFilters) => {
      // TODO(SF) legacy
      setFilters({ location: filters?.location, category: filters?.category })
      updateParams({ location: filters?.location?.id, category: filters?.category })
      onSubmit()
    },
    [updateParams, onSubmit]
  )

  const clearParamsFromUrl = useCallback(
    () =>
      updateParams({
        // TODO(SF) legacy
        location: undefined,
        category: undefined,
      }),
    [updateParams]
  )

  const clearFilters = useCallback(() => {
    // TODO(SF) legacy
    setFilters({ location: undefined, category: undefined })
    clearParamsFromUrl()
  }, [clearParamsFromUrl])

  useEffect(() => {
    // TODO(SF) legacy
    if (loadingFilters) {
      return
    }
    if (geolocationDetails || category) {
      setFilters({
        location: geolocationDetails && {
          ...geolocationDetails,
          label: geolocationDetails.name,
        },
        category,
      })
    } else {
      setFilters({ location: undefined, category: undefined })
    }
  }, [location, category, geolocationDetails, loadingGeolocation, loadingFilters])

  return {}
}

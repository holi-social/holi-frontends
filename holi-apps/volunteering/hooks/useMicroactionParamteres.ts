import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useMemo } from 'react'

export const useMicroactionParameters = (pageSize: number, location?: GeolocationSuggestion) => {
  const parameters = useMemo(() => {
    const sortBy = ['_rand():desc']
    const filterBy = [
      'type:=[volunteering,task]',
      'commitment_duration:=[MINUTES_10to15,MINUTES_15to30,MINUTES_30to60]',
    ]

    const { latitude, longitude } = location?.coordinates || {}
    if (latitude && longitude) {
      filterBy.push(`location_lat_lng:(${latitude},${longitude},30 km)`)
    } else {
      filterBy.push('location_type:=[remote]')
    }

    return {
      filter_by: filterBy.join(' && '),
      sort_by: sortBy.join(','),
      per_page: pageSize,
    }
  }, [pageSize, location?.coordinates])

  return {
    parameters,
  }
}

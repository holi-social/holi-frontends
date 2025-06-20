import type { PlaceDetails } from '@holi/core/geolocation/typings'
import { useMemo } from 'react'

export const useMicroactionParameters = (pageSize: number, location?: PlaceDetails) => {
  const parameters = useMemo(() => {
    const sortBy = ['_rand():desc']
    const filterBy = [
      'type:=[volunteering,task]',
      'commitment_duration:=[MINUTES_10to15,MINUTES_15to30,MINUTES_30to60]',
    ]

    const { lat, lon } = location?.geolocation.properties || {}
    if (lat && lon) {
      filterBy.push(`location_lat_lng:(${lat},${lon},30 km) || location_type:=[remote]`)
    } else {
      filterBy.push('location_type:=[remote]')
    }

    return {
      filter_by: filterBy.join(' && '),
      sort_by: sortBy.join(','),
      per_page: pageSize,
    }
  }, [pageSize, location?.geolocation.properties])

  return {
    parameters,
  }
}

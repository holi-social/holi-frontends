import type { PlaceDetails } from '@holi/core/geolocation/typings'
import { isProduction } from '@holi/core/helpers/environment'
import type { SearchParams } from '@holi/core/typesense/types'
import { useMemo } from 'react'

// Temporarily use hard-coded task ids in production
const GOOD_DEEDS_PRODUCTION = [
  '08f77396-5baa-40f3-aa58-53665d704e9c',
  '09dd42fe-d3f1-4cfe-a802-6ac7bce00db4',
  '0f79cc2b-0e0a-4ad3-b8c8-2587cdaae04d',
  '0f79cc2b-0e0a-4ad3-b8c8-2587cdaae04d',
  'bbcc785a-4d87-44ed-a895-e09b69071338',
  'f26d83a8-90f4-42f3-9ba7-998b249956d1',
  '3cc4d1d1-25b6-4657-a0e3-0f21b5ba3276',
  'f8f2b6b6-123e-49e4-bfa4-c1b7c1c80d30',
  '646662e4-7bf2-4599-b231-e724457e137f',
  '2823f22c-316e-4329-968b-8f538f180afe',
  'f4c5f06b-ae21-47fa-b1f2-40133fb2dd1d',
  'a85e6c89-5fd7-4358-9764-297e87c6719e',
  '5a8fe9a8-793c-4015-a9f4-8f029165b513',
  '09717f4e-8a06-48b6-98f6-abb8495f382f',
  '783c2200-76b1-4ea8-9aad-14a474d3f4b8',
  '29194325-ee21-411d-8edc-576ca46cd782',
  'ba574809-f00b-4ae2-8dac-17bcaa6ae413',
  '882e0db0-e69a-4318-bba2-fc09fcb2241c',
  '1f946363-d968-4241-9a40-5b8d406f7dcd',
  'b77e2218-9fd3-4376-be10-03848d0189bd',
  '3cd856f9-0876-44d0-9dc3-4a9321697db4',
]

const getFilterParameters = (location?: PlaceDetails) => {
  if (isProduction) {
    const ids = GOOD_DEEDS_PRODUCTION.map((id) => `task_${id}`)
    return ['type:=[task]', `id:=[${ids.join(',')}]`]
  }

  const filterBy = ['type:=[volunteering,task]', 'commitment_duration:=[MINUTES_10to15,MINUTES_15to30,MINUTES_30to60]']

  const { lat, lon } = location?.geolocation.properties || {}
  if (lat && lon) {
    filterBy.push(`(location_lat_lng:(${lat},${lon},30 km) || location_type:=[remote])`)
  } else {
    filterBy.push('location_type:=[remote]')
  }
  return filterBy
}

export const useMicroactionParameters = (pageSize: number, location?: PlaceDetails): { parameters: SearchParams } => {
  const parameters = useMemo(() => {
    return {
      filter_by: getFilterParameters(location).join(' && '),
      sort_by: '_rand():desc',
      per_page: pageSize,
    }
  }, [pageSize, location])

  return {
    parameters,
  }
}

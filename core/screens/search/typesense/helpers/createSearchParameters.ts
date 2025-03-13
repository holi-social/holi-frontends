import type { SearchFilter } from '@holi/core/screens/search/typesense/types'
import type { SearchParams } from 'typesense/lib/Typesense/Documents'

export const INITIAL_PAGE = 1
export const PAGE_SIZE = 10

const searchFields = [
  'title_de',
  'title_en',
  'description_de',
  'description_en',
  'location',
  'user_full_name',
  'embedding',
]

const facetConfigurations: Record<string, { query_by: string; query_by_weights: string; vector_query: string }> = {
  volunteering: {
    query_by: searchFields.join(','),
    query_by_weights: '1,1,1,1,100,0,10',
    vector_query: 'embedding:([], k: 200, alpha:0.9, distance_threshold: 0.1)',
  },
  space: {
    query_by: searchFields.join(','),
    query_by_weights: '10,10,1,1,1,0,5',
    vector_query: 'embedding:([], k: 150, distance_threshold: 0.5)',
  },
  profile: {
    query_by: searchFields.join(','), // TODO(SF) why not only user name?
    query_by_weights: '0,0,0,0,0,10,0',
    vector_query: 'embedding:([], k: 100, distance_threshold: 0.0)',
  },
}

export const createSearchParameters = ({ facet, location, query }: SearchFilter, page: number): SearchParams => {
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

  // Add the location filter if geolocationDetails are set
  if (location && location.coordinates) {
    const { latitude, longitude } = location.coordinates

    const locationFilter = `location_lat_lng:(${latitude}, ${longitude}, 1 km)`

    // If we already have a facet filter, unify them with "&&"
    if (filter_by) {
      filter_by += ` && ${locationFilter}`
    } else {
      filter_by = locationFilter
    }

    // For sorting by distance
    sort_by = `location_lat_lng(${latitude}, ${longitude}):asc`
  }

  return {
    q: query || '*',
    query_by: config.query_by,
    query_by_weights: config.query_by_weights,
    vector_query: config.vector_query,
    ...(filter_by && { filter_by }),
    ...(sort_by && { sort_by }),
    page,
    per_page: PAGE_SIZE,
  }
}

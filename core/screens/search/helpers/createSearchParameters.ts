import type { SearchFilter } from '@holi/core/screens/search/types'
import type { TypesenseDocumentType } from '@holi/core/typesense/types'
import type { SearchParams } from 'typesense/lib/Typesense/Documents'

export const INITIAL_PAGE = 1
export const PAGE_SIZE = 10

const searchFields = ['title_de', 'title_en', 'description_de', 'description_en', 'location', 'embedding']

const profileSearchFields = ['user_full_name']

const facetConfigurations: { [key in TypesenseDocumentType]: SearchParams } = {
  volunteering: {
    filter_by: 'type:=volunteering',
    query_by: searchFields.join(','),
    query_by_weights: '1,1,1,1,100,10',
    vector_query: 'embedding:([], k: 200, alpha:0.9, distance_threshold: 0.9)',
  },
  space: {
    filter_by: 'type:=space',
    query_by: searchFields.join(','),
    query_by_weights: '10,10,1,1,1,5',
    vector_query: 'embedding:([], k: 150, distance_threshold: 0.5)',
  },
  profile: {
    filter_by: 'type:=profile',
    query_by: profileSearchFields.join(','),
    query_by_weights: '10',
  },
}

export const createSearchParameters = ({ facet, location, query }: SearchFilter, page: number): SearchParams => {
  const config = facetConfigurations[facet] ?? facetConfigurations.volunteering

  let sort_by: string | undefined = undefined
  let locationFilter = ''

  // Add the location filter if geolocationDetails are set
  if (location && location.coordinates && facet !== 'profile') {
    const { latitude, longitude } = location.coordinates

    locationFilter = `location_lat_lng:(${latitude}, ${longitude}, 30 km)`
    sort_by = `location_lat_lng(${latitude}, ${longitude}):asc`
  }

  const filter_by = locationFilter ? `${config.filter_by} && ${locationFilter}` : config.filter_by

  return {
    ...config,
    q: query || '*',
    filter_by,
    sort_by,
    page,
    per_page: PAGE_SIZE,
  }
}

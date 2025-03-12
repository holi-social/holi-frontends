import { typesenseApiKey, typesenseHost, typesensePort, typesenseProtocol } from '@holi/core/helpers/config'

import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter'

const searchFields = ['title_de', 'title_en', 'description_de', 'description_en', 'location', 'user_full_name']
const embeddingFields = ['embedding']

const facetConfigurations: Record<string, { query_by: string; query_by_weights: string; vector_query: string }> = {
  volunteering: {
    query_by: [...searchFields, ...embeddingFields].join(','),
    query_by_weights: '1,1,1,1,100,0,10',
    vector_query: 'embedding:([], k: 200, alpha:0.9, distance_threshold: 0.7)',
  },
  space: {
    query_by: [...searchFields, ...embeddingFields].join(','),
    query_by_weights: '10,10,1,1,1,0,5',
    vector_query: 'embedding:([], k: 150, distance_threshold: 0.5)',
  },
  profile: {
    query_by: [...searchFields, ...embeddingFields].join(','),
    query_by_weights: '0,0,0,0,0,10,0',
    vector_query: 'embedding:([], k: 100, distance_threshold: 0.0)',
  },
}

export const createTypesenseInstantSearchAdapter = (facet?: string, locationParam?: string) => {
  // Use the provided facet or fallback to a default ('volunteering')
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

  // Add the location filter if locationParam is set
  if (locationParam) {
    const [lat, lng] = locationParam.split(',').map(parseFloat)
    const locationFilter = `location_lat_lng:(${lat}, ${lng}, 30 km)`

    // If we already have a facet filter, unify them with "&&"
    if (filter_by) {
      filter_by += ` && ${locationFilter}`
    } else {
      filter_by = locationFilter
    }

    // For sorting by distance
    sort_by = `location_lat_lng(${lat}, ${lng}):asc`
  }

  return new TypesenseInstantSearchAdapter({
    server: {
      apiKey: typesenseApiKey,
      nodes: [
        {
          host: typesenseHost,
          port: typesensePort,
          protocol: typesenseProtocol,
        },
      ],
    },
    additionalSearchParameters: {
      query_by: config.query_by,
      query_by_weights: config.query_by_weights,
      vector_query: config.vector_query,
      ...(filter_by && { filter_by }),
      ...(sort_by && { sort_by }),
    },
  })
}

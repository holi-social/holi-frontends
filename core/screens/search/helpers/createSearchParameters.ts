import type { SearchFacet, SearchFilter } from '@holi/core/screens/search/types'
import type { SearchParams } from '@holi/core/typesense/types'

const PAGE_SIZE = 10

const searchFields = ['title_de', 'title_en', 'description_de', 'description_en', 'location', 'embedding']

const profileSearchFields = ['user_full_name']

const facetConfigurations: { [key in SearchFacet]: SearchParams } = {
  volunteering: {
    filter_by: 'type:=[volunteering,task]',
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

export const createSearchParameters = ({ facet, location, query }: SearchFilter): SearchParams => {
  const config = facetConfigurations[facet] ?? facetConfigurations.volunteering

  let sort_by: string | undefined = undefined
  let locationFilter = ''
  let nl_query = false
  let nl_model_id: string | undefined = undefined
  let nl_query_debug: boolean | undefined = undefined

  // Debug ALL search parameter creation attempts
  console.log('\n🔧 CREATE SEARCH PARAMETERS 🔧')
  console.log('Input - Query:', query)
  console.log('Input - Facet:', facet)
  console.log('Input - Location:', location)
  console.log('Input - Location coordinates:', location?.coordinates)

  // Add the location filter if geolocationDetails are set
  if (location && location.coordinates && facet !== 'profile') {
    const { latitude, longitude } = location.coordinates

    locationFilter = `location_lat_lng:(${latitude}, ${longitude}, 30 km)`
    sort_by = `location_lat_lng(${latitude}, ${longitude}):asc`
    
    console.log('✅ Using location coordinates, NLP disabled')
  } else {
    if (facet !== 'profile') {
      nl_query = true
      nl_model_id = 'gemini-model'
      nl_query_debug = true
      
      console.log('🤖 NLP enabled - no location coordinates provided')
      
      // Debug logging to terminal - for any query now (including empty)
      console.log('\n⚙️ SEARCH PARAMS DEBUG ⚙️')
      console.log('Query:', JSON.stringify(query))
      console.log('Query type:', typeof query)
      console.log('Query length:', query?.length || 0)
      console.log('Facet:', facet)
      console.log('Location provided:', !!location)
      console.log('Has coordinates:', !!(location?.coordinates))
      console.log('NL Query enabled:', nl_query)
      console.log('NL Model ID:', nl_model_id)
      console.log('NL Debug enabled:', nl_query_debug)
      console.log('Reason: No location coordinates provided, enabling NLP for location extraction')
      console.log('⚙️ END SEARCH PARAMS DEBUG ⚙️\n')
    } else {
      console.log('❌ NLP disabled - profile facet')
    }
  }

  const filter_by = locationFilter ? `${config.filter_by} && ${locationFilter}` : config.filter_by

  const result = {
    ...config,
    q: query || '*',
    filter_by,
    sort_by,
    per_page: PAGE_SIZE,
    nl_query,
    nl_model_id,
    nl_query_debug,
  }

  console.log('🔧 Final search parameters:', JSON.stringify(result, null, 2))
  console.log('🔧 END CREATE SEARCH PARAMETERS 🔧\n')

  return result
}

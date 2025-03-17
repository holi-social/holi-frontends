import { createSearchParameters } from '@holi/core/screens/search/typesense/helpers/createSearchParameters'

describe('createSearchParameters', () => {
  it('should create correct parameters to filter for volunteering', () => {
    const result = createSearchParameters({ facet: 'volunteering', query: 'nachhilfe' }, 1)

    expect(result).toEqual({
      q: 'nachhilfe',
      query_by: 'title_de,title_en,description_de,description_en,location,embedding',
      query_by_weights: '1,1,1,1,100,10',
      vector_query: 'embedding:([], k: 200, alpha:0.9, distance_threshold: 0.1)',
      filter_by: 'type:=[`volunteering`]',
      page: 1,
      per_page: 10,
    })
  })

  it('should create correct parameters to filter for spaces', () => {
    const result = createSearchParameters({ facet: 'space', query: 'Urban Gardening' }, 1)

    expect(result).toEqual({
      q: 'Urban Gardening',
      query_by: 'title_de,title_en,description_de,description_en,location,embedding',
      query_by_weights: '10,10,1,1,1,5',
      vector_query: 'embedding:([], k: 150, distance_threshold: 0.5)',
      filter_by: 'type:=[`space`]',
      page: 1,
      per_page: 10,
    })
  })

  it('should create correct parameters to filter for profiles', () => {
    const result = createSearchParameters({ facet: 'profile', query: 'Ada Lovelace' }, 1)

    expect(result).toEqual({
      q: 'Ada Lovelace',
      query_by: 'user_full_name',
      query_by_weights: '10',
      filter_by: 'type:=[`profile`]',
      page: 1,
      per_page: 10,
    })
  })

  it('should create correct parameters to filter by query and location', () => {
    const result = createSearchParameters(
      {
        facet: 'volunteering',
        query: 'nachhilfe',
        location: {
          id: '123',
          label: 'Hamburg, Germany',
          coordinates: { latitude: 52, longitude: 13 },
        },
      },
      1
    )

    expect(result).toEqual({
      q: 'nachhilfe',
      query_by: 'title_de,title_en,description_de,description_en,location,embedding',
      query_by_weights: '1,1,1,1,100,10',
      vector_query: 'embedding:([], k: 200, alpha:0.9, distance_threshold: 0.1)',
      filter_by: 'type:=[`volunteering`] && location_lat_lng:(52, 13, 30 km)',
      sort_by: 'location_lat_lng(52, 13):asc',
      page: 1,
      per_page: 10,
    })
  })

  it('should create correct parameters to filter by location only', () => {
    const result = createSearchParameters(
      {
        facet: 'volunteering',
        query: '',
        location: {
          id: '123',
          label: 'Hamburg, Germany',
          coordinates: { latitude: 52, longitude: 13 },
        },
      },
      1
    )

    expect(result).toEqual({
      q: '*',
      query_by: 'title_de,title_en,description_de,description_en,location,embedding',
      query_by_weights: '1,1,1,1,100,10',
      vector_query: 'embedding:([], k: 200, alpha:0.9, distance_threshold: 0.1)',
      filter_by: 'type:=[`volunteering`] && location_lat_lng:(52, 13, 30 km)',
      sort_by: 'location_lat_lng(52, 13):asc',
      page: 1,
      per_page: 10,
    })
  })

  it('should ignore location when filtering profiles', () => {
    const result = createSearchParameters(
      {
        facet: 'profile',
        query: 'Ada Lovelace',
        location: {
          id: '123',
          label: 'Hamburg, Germany',
          coordinates: { latitude: 52, longitude: 13 },
        },
      },
      1
    )

    expect(result).toEqual({
      q: 'Ada Lovelace',
      query_by: 'user_full_name',
      query_by_weights: '10',
      filter_by: 'type:=[`profile`]',
      page: 1,
      per_page: 10,
    })
  })

  it('should pass page paramter', () => {
    const result = createSearchParameters({ facet: 'volunteering', query: 'nachhilfe' }, 3)

    expect(result).toEqual({
      q: 'nachhilfe',
      query_by: 'title_de,title_en,description_de,description_en,location,embedding',
      query_by_weights: '1,1,1,1,100,10',
      vector_query: 'embedding:([], k: 200, alpha:0.9, distance_threshold: 0.1)',
      filter_by: 'type:=[`volunteering`]',
      page: 3,
      per_page: 10,
    })
  })
})

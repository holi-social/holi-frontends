import { isEmptyFilter } from '@holi/core/screens/search/typesense/helpers/isEmptyFilter'

describe('isEmptyFilter', () => {
  const location = {
    id: '123',
    label: 'Hamburg, Germany',
    coordinates: { latitude: 52, longitude: 13 },
  }
  const facets = ['volunteering', 'space', 'profile']

  it.each(facets)('should return true for filter without query and location for facet %s', (facet) => {
    const filter = {
      query: '',
      facet,
    }

    expect(isEmptyFilter(filter)).toBeTruthy()
  })

  it.each(facets)('should return false for filter with query for facet %s', (facet) => {
    const filter = {
      query: 'some query',
      facet,
    }

    expect(isEmptyFilter(filter)).toBeFalsy()
  })

  it.each(facets)('should return false for filter with query and location for facet %s', (facet) => {
    const filter = {
      query: 'some query',
      facet,
      location,
    }

    expect(isEmptyFilter(filter)).toBeFalsy()
  })

  const expectedEmptyForLocationOnly: { [key: string]: boolean } = {
    volunteering: false,
    space: false,
    profile: true,
  }
  it.each(facets)('should return correct value for filter with empty query but location for facet %s', (facet) => {
    const expectedEmpty = expectedEmptyForLocationOnly[facet] ?? false
    const filter = {
      query: '',
      facet,
      location,
    }

    expect(isEmptyFilter(filter)).toBe(expectedEmpty)
  })
})

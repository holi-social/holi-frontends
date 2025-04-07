import { isEmptyFilter } from '@holi/core/screens/search/helpers/isEmptyFilter'
import { SEARCH_HIT_TYPES_IN_ORDER } from '@holi/core/screens/search/types'
import type { TypesenseDocumentType } from '@holi/core/typesense/types'

describe('isEmptyFilter', () => {
  const location = {
    id: '123',
    label: 'Hamburg, Germany',
    coordinates: { latitude: 52, longitude: 13 },
  }

  it.each(SEARCH_HIT_TYPES_IN_ORDER)(
    'should return true for filter without query and location for facet %s',
    (facet) => {
      const filter = {
        query: '',
        facet,
      }

      expect(isEmptyFilter(filter)).toBeTruthy()
    }
  )

  it.each(SEARCH_HIT_TYPES_IN_ORDER)('should return false for filter with query for facet %s', (facet) => {
    const filter = {
      query: 'some query',
      facet,
    }

    expect(isEmptyFilter(filter)).toBeFalsy()
  })

  it.each(SEARCH_HIT_TYPES_IN_ORDER)('should return false for filter with query and location for facet %s', (facet) => {
    const filter = {
      query: 'some query',
      facet,
      location,
    }

    expect(isEmptyFilter(filter)).toBeFalsy()
  })

  const expectedEmptyForLocationOnly: { [key in TypesenseDocumentType]: boolean } = {
    volunteering: false,
    space: false,
    profile: true,
  }
  it.each(SEARCH_HIT_TYPES_IN_ORDER)(
    'should return correct value for filter with empty query but location for facet %s',
    (facet) => {
      const expectedEmpty = expectedEmptyForLocationOnly[facet] ?? false
      const filter = {
        query: '',
        facet,
        location,
      }

      expect(isEmptyFilter(filter)).toBe(expectedEmpty)
    }
  )
})

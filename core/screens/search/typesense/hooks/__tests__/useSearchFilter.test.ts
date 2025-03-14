import { useSearchFilter } from '@holi/core/screens/search/typesense/hooks/useSearchFilter'
import { act, renderHook } from '@testing-library/react-native'

describe('useSearchFilter', () => {
  it('should initialize with the correct default values', () => {
    const { result } = renderHook(() => useSearchFilter({}, jest.fn()))

    expect(result.current.filter).toEqual({
      query: '',
      facet: 'volunteering',
    })
  })

  it('should initialize with given initial values', () => {
    const { result } = renderHook(() =>
      useSearchFilter(
        {
          query: 'test query',
          facet: 'space',
        },
        jest.fn()
      )
    )

    expect(result.current.filter).toEqual({
      query: 'test query',
      facet: 'space',
    })
  })

  it('should update the filter when setQuery is called', () => {
    const onFilterChange = jest.fn()
    const expectedFilter = {
      query: 'new query',
      facet: 'volunteering',
    }
    const { result } = renderHook(() => useSearchFilter({ facet: 'volunteering' }, onFilterChange))

    act(() => {
      result.current.setQuery('new query')
    })

    expect(onFilterChange).toHaveBeenCalledWith(expectedFilter)
    expect(result.current.filter).toEqual(expectedFilter)
  })

  it('should update the filter when setFacet is called', () => {
    const onFilterChange = jest.fn()
    const expectedFilter = {
      query: '',
      facet: 'space',
    }
    const { result } = renderHook(() => useSearchFilter({ facet: 'volunteering' }, onFilterChange))

    act(() => {
      result.current.setFacet('space')
    })

    expect(onFilterChange).toHaveBeenCalledWith(expectedFilter)
    expect(result.current.filter).toEqual(expectedFilter)
  })

  it('should update the filter when setLocation is called', () => {
    const onFilterChange = jest.fn()
    const location = {
      id: '123',
      label: 'Hamburg, Germany',
      coordinates: { latitude: 52, longitude: 13 },
    }
    const expectedFilter = {
      query: '',
      facet: 'volunteering',
      location,
    }
    const { result } = renderHook(() => useSearchFilter({ facet: 'volunteering' }, onFilterChange))

    act(() => {
      result.current.setLocation(location)
    })

    expect(onFilterChange).toHaveBeenCalledWith(expectedFilter)
    expect(result.current.filter).toEqual(expectedFilter)
  })

  it('should return true for isFilterEmpty when there is no query or location', () => {
    const { result } = renderHook(() => useSearchFilter({ facet: 'volunteering' }, jest.fn()))

    expect(result.current.isFilterEmpty).toBeTruthy()
  })

  it('should return false for isFilterEmpty when there is a query', () => {
    const { result } = renderHook(() =>
      useSearchFilter(
        {
          query: 'test query',
          facet: 'volunteering',
        },
        jest.fn()
      )
    )

    expect(result.current.isFilterEmpty).toBeFalsy()
  })

  it('should return false for isFilterEmpty when there is a location', () => {
    const { result } = renderHook(() =>
      useSearchFilter(
        {
          location: {
            id: '123',
            label: 'Hamburg, Germany',
            coordinates: { latitude: 52, longitude: 13 },
          },
          facet: 'volunteering',
        },
        jest.fn()
      )
    )

    expect(result.current.isFilterEmpty).toBeFalsy()
  })

  it('should return true for isFilterEmpty when there only a location but the facet is profile', () => {
    const { result } = renderHook(() =>
      useSearchFilter(
        {
          location: {
            id: '123',
            label: 'Hamburg, Germany',
            coordinates: { latitude: 52, longitude: 13 },
          },
          facet: 'profile',
        },
        jest.fn()
      )
    )

    expect(result.current.isFilterEmpty).toBeTruthy()
  })
})

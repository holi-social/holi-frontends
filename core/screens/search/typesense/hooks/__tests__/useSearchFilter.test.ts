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

  it('should use volunteering as fallback if initial facet value is not valid', () => {
    const onFilterChange = jest.fn()
    const { result } = renderHook(() =>
      useSearchFilter(
        {
          query: 'test query',
          facet: 'unknown',
        },
        onFilterChange
      )
    )

    expect(result.current.filter).toEqual({
      query: 'test query',
      facet: 'volunteering',
    })
    expect(onFilterChange).toHaveBeenCalledWith({ facet: 'volunteering' })
  })

  it('should use volunteering as fallback if initial facet value is missing', () => {
    const onFilterChange = jest.fn()
    const { result } = renderHook(() =>
      useSearchFilter(
        {
          query: 'test query',
        },
        onFilterChange
      )
    )

    expect(result.current.filter).toEqual({
      query: 'test query',
      facet: 'volunteering',
    })
    expect(onFilterChange).toHaveBeenCalledWith({ facet: 'volunteering' })
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
})

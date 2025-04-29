import { useFilteredVolunteeringEngagementsTypesense } from '@holi-apps/volunteering/hooks/useFilteredVolunteeringsEngagementsTypesense'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'
import { renderHook } from '@testing-library/react-native'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

const mockUseTypesensePaginationQuery = jest.mocked(useTypesensePaginationQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationQuery', () => ({
  useTypesensePaginationQuery: jest.fn(),
}))

const mockUseOnRefresh = jest.mocked(useOnRefresh)
jest.mock('@holi/core/refreshing/hooks/useOnRefresh', () => ({
  useOnRefresh: jest.fn(),
}))

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

export const makeTypesenseEngagementHits = (length: number): SearchResponseHit<TypesenseDocument>[] =>
  Array.from({ length }, (_, i) => ({
    document: {
      id: i.toString(),
      title_de: `Titel ${i}`,
      type: 'volunteering',
    },
    highlight: {},
    text_match: 0,
  }))

describe('useFilteredVolunteeringEngagementsTypesense', () => {
  const searchResult = {
    state: {
      isLoading: false,
      data: makeTypesenseEngagementHits(10),
      canFetchMore: true,
      totalResults: 123,
      currentPage: 1,
      parameters: {},
    },
    isFetchingMore: false,
    fetchNextPage: jest.fn(),
    refetch: jest.fn(),
  }
  const filters: VolunteeringFilters = {
    topics: ['disability-inclusion'],
    skills: [],
  }
  const pageSize = 10

  beforeEach(() => {
    mockUseTypesensePaginationQuery.mockReturnValue(searchResult)
    mockUseErrorHandling.mockReturnValue({
      displayError: jest.fn(),
    })
  })

  it('should expose loading flag while loading resluts', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      ...searchResult,
      state: {
        ...searchResult.state,
        isLoading: true,
      },
    })

    const { result } = renderHook(() =>
      useFilteredVolunteeringEngagementsTypesense({ filters, loadingFilters: true, pageSize })
    )

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should pass on loading state of filters', () => {
    const { result } = renderHook(() =>
      useFilteredVolunteeringEngagementsTypesense({ filters, loadingFilters: true, pageSize })
    )

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should skip query execution while loading parameters', () => {
    renderHook(() => useFilteredVolunteeringEngagementsTypesense({ filters, loadingFilters: true, pageSize }))

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: {
        filter_by: 'type:volunteering&&(topics_v2:[disability-inclusion])',
        sort_by:
          '_vector_query(topics_skills_embedding_v2:([0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])):asc',
        per_page: 10,
      },
      skip: true,
      onError: expect.any(Function),
    })
  })

  it('should expose transformed search results', () => {
    const expectedEngagements = searchResult.state.data

    const { result } = renderHook(() => useFilteredVolunteeringEngagementsTypesense({ filters, pageSize }))

    expect(result.current.isLoading).toBeFalsy()
    const engagements = result.current.engagements
    expect(engagements).toHaveLength(expectedEngagements.length)
    for (let i = 0; i < engagements.length; i++) {
      expect(engagements[i].id).toEqual(i.toString())
      expect(engagements[i].title).toEqual(`Titel ${i}`)
    }
  })

  it('should expose flag if more results can be fetched', () => {
    const { result } = renderHook(() => useFilteredVolunteeringEngagementsTypesense({ filters, pageSize }))

    expect(result.current.canFetchMore).toBeTruthy()
  })

  it('should expose flag if nothing more can be fetched', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      ...searchResult,
      state: {
        ...searchResult.state,
        canFetchMore: false,
      },
    })

    const { result } = renderHook(() => useFilteredVolunteeringEngagementsTypesense({ filters, pageSize }))

    expect(result.current.canFetchMore).toBeFalsy()
  })

  it('should allow fetching more results', () => {
    const fetchNextPage = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      ...searchResult,
      fetchNextPage,
    })

    const { result } = renderHook(() => useFilteredVolunteeringEngagementsTypesense({ filters, pageSize }))

    result.current.fetchNextPage()

    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('should refetch results on refresh', () => {
    const refetch = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      ...searchResult,
      refetch,
    })

    renderHook(() => useFilteredVolunteeringEngagementsTypesense({ filters, pageSize }))

    expect(mockUseOnRefresh).toHaveBeenCalledWith(refetch)
  })

  it('should display error if fetching results fails', () => {
    const testError = new Error('Search error')
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })
    mockUseTypesensePaginationQuery.mockImplementation(({ onError }) => {
      onError?.(testError)
      return {
        state: {
          isLoading: false,
          data: [],
          totalResults: 0,
          canFetchMore: false,
          currentPage: 1,
          parameters: {},
        },
        isFetchingMore: false,
        fetchNextPage: jest.fn(),
        refetch: jest.fn(),
      }
    })

    renderHook(() => useFilteredVolunteeringEngagementsTypesense({ filters, pageSize }))

    expect(displayError).toHaveBeenCalledWith(testError, 'Error retrieving filtered volunteering engagements', {
      location: 'useFilteredVolunteeringEngagementsTypesense.useTypesensePaginationQuery',
    })
  })

  describe('query parameters', () => {
    const topics = ['housing', 'human-rights']
    const skills = ['translation', 'tutoring-coaching']
    const location: GeolocationSuggestion = {
      id: '123',
      label: 'Hamburg, Germany',
      coordinates: { latitude: 1, longitude: 2 },
    }

    it('should create correct parameters when filtering by topics only', () => {
      renderHook(() =>
        useFilteredVolunteeringEngagementsTypesense({
          filters: { topics },
          pageSize,
        })
      )

      expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
        parameters: {
          filter_by: 'type:volunteering&&(topics_v2:[housing,human-rights])',
          sort_by:
            '_vector_query(topics_skills_embedding_v2:([0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])):asc',
          per_page: 10,
        },
        skip: false,
        onError: expect.any(Function),
      })
    })

    it('should create correct parameters when filtering by skills only', () => {
      renderHook(() =>
        useFilteredVolunteeringEngagementsTypesense({
          filters: { skills },
          pageSize,
        })
      )

      expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
        parameters: {
          filter_by: 'type:volunteering&&(skills_v2:[translation,tutoring-coaching])',
          sort_by:
            '_vector_query(topics_skills_embedding_v2:([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1])):asc',
          per_page: 10,
        },
        skip: false,
        onError: expect.any(Function),
      })
    })

    it('should create correct parameters when filtering by location only', () => {
      renderHook(() =>
        useFilteredVolunteeringEngagementsTypesense({
          filters: { location },
          pageSize,
        })
      )

      expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
        parameters: {
          filter_by: 'type:volunteering&&location_lat_lng:(1,2,30 km)',
          sort_by: 'location_lat_lng(1,2,precision:5km):asc',
          per_page: 10,
        },
        skip: false,
        onError: expect.any(Function),
      })
    })

    it('should create correct parameters when filtering by topics and skills', () => {
      renderHook(() =>
        useFilteredVolunteeringEngagementsTypesense({
          filters: { topics, skills },
          pageSize,
        })
      )

      expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
        parameters: {
          filter_by: 'type:volunteering&&(topics_v2:[housing,human-rights]||skills_v2:[translation,tutoring-coaching])',
          sort_by:
            '_vector_query(topics_skills_embedding_v2:([0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1])):asc',
          per_page: 10,
        },
        skip: false,
        onError: expect.any(Function),
      })
    })

    it('should create correct parameters when filtering by topics, skills and location', () => {
      renderHook(() =>
        useFilteredVolunteeringEngagementsTypesense({
          filters: { topics, skills, location },
          pageSize,
        })
      )

      expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
        parameters: {
          filter_by:
            'type:volunteering&&(topics_v2:[housing,human-rights]||skills_v2:[translation,tutoring-coaching])&&location_lat_lng:(1,2,30 km)',
          sort_by:
            '_vector_query(topics_skills_embedding_v2:([0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1])):asc,location_lat_lng(1,2,precision:5km):asc',
          per_page: 10,
        },
        skip: false,
        onError: expect.any(Function),
      })
    })
  })
})

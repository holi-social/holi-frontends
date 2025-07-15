import { useFilteredVolunteeringEngagements } from '@holi-apps/volunteering/hooks/useFilteredVolunteeringEngagements'
import type { VolunteeringFilterKey, VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import type { SearchResponseHit } from '@holi/core/typesense/types'
import { renderHook } from '@testing-library/react-native'
import { buildTopicsAndSkillsEmbedding } from '@holi-apps/volunteering/helpers/buildTopicAndSkillsEmbedding'
import { fullFilters } from '@holi-apps/volunteering/__tests__/testData'

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

export const makeTypesenseEngagementHits = (length: number): SearchResponseHit[] =>
  Array.from(
    { length },
    (_, i) =>
      ({
        document: {
          id: i.toString(),
          title_de: `Titel ${i}`,
          type: 'volunteering',
        },
        highlight: {},
        text_match: 0,
      }) as SearchResponseHit
  )

describe('useFilteredVolunteeringEngagements', () => {
  const facetCounts = {
    topics_v2: {
      'migration-refugees': 1,
    },
    skills_v2: {
      fundraising: 2,
    },
    commitment_label: {
      recurring: 3,
    },
    commitment_duration: {
      DAYS_1: 4,
    },
  }
  const searchResult = {
    state: {
      isLoading: false,
      hits: makeTypesenseEngagementHits(10),
      canFetchMore: true,
      totalResults: 123,
      totalNrOfPages: 13,
      currentPage: 1,
      parameters: {},
      facetCounts,
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

    const { result } = renderHook(() => useFilteredVolunteeringEngagements({ filters, loadingFilters: true, pageSize }))

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should pass on loading state of filters', () => {
    const { result } = renderHook(() => useFilteredVolunteeringEngagements({ filters, loadingFilters: true, pageSize }))

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should skip query execution while loading parameters', () => {
    const topicsSkillsEmbedding = buildTopicsAndSkillsEmbedding(filters)

    renderHook(() => useFilteredVolunteeringEngagements({ filters, loadingFilters: true, pageSize }))

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: {
        filter_by: 'type:=[volunteering,task]&&topics_v2:=[disability-inclusion]',
        sort_by: `_vector_query(topics_skills_embedding_v2:(${JSON.stringify(topicsSkillsEmbedding)})):asc`,
        facet_by: 'topics_v2,skills_v2,commitment_label,commitment_duration',
        per_page: 10,
      },
      skip: true,
      onError: expect.any(Function),
    })
  })

  it('should expose transformed search results', () => {
    const expectedEngagements = searchResult.state.hits

    const { result } = renderHook(() => useFilteredVolunteeringEngagements({ filters, pageSize }))

    expect(result.current.isLoading).toBeFalsy()
    const engagements = result.current.engagements
    expect(engagements).toHaveLength(expectedEngagements.length)
    for (let i = 0; i < engagements.length; i++) {
      expect(engagements[i].id).toEqual(i.toString())
      expect(engagements[i].title).toEqual(`Titel ${i}`)
    }
    expect(result.current.facetCounts).toEqual(facetCounts)
  })

  it('should expose flag if more results can be fetched', () => {
    const { result } = renderHook(() => useFilteredVolunteeringEngagements({ filters, pageSize }))

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

    const { result } = renderHook(() => useFilteredVolunteeringEngagements({ filters, pageSize }))

    expect(result.current.canFetchMore).toBeFalsy()
  })

  it('should allow fetching more results', () => {
    const fetchNextPage = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      ...searchResult,
      fetchNextPage,
    })

    const { result } = renderHook(() => useFilteredVolunteeringEngagements({ filters, pageSize }))

    result.current.fetchNextPage()

    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('should refetch results on refresh', () => {
    const refetch = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      ...searchResult,
      refetch,
    })

    renderHook(() => useFilteredVolunteeringEngagements({ filters, pageSize }))

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
          hits: [],
          totalResults: 0,
          totalNrOfPages: 0,
          canFetchMore: false,
          currentPage: 1,
          parameters: {},
          facetCounts: {},
        },
        isFetchingMore: false,
        fetchNextPage: jest.fn(),
        refetch: jest.fn(),
      }
    })

    renderHook(() => useFilteredVolunteeringEngagements({ filters, pageSize }))

    expect(displayError).toHaveBeenCalledWith(testError, 'Error retrieving filtered volunteering engagements', {
      location: 'useFilteredVolunteeringEngagementsTypesense.useTypesensePaginationQuery',
    })
  })

  describe('query parameters', () => {
    const testDataFilters: {
      filterKey: VolunteeringFilterKey
      filterQuery: string
    }[] = [
      {
        filterKey: 'topics',
        filterQuery: 'topics_v2',
      },
      {
        filterKey: 'skills',
        filterQuery: 'skills_v2',
      },
      {
        filterKey: 'commitmentDurations',
        filterQuery: 'commitment_duration',
      },
      {
        filterKey: 'commitmentLabels',
        filterQuery: 'commitment_label',
      },
    ]

    it.each(testDataFilters)(
      'should create correct parameters when filtering by $filterKey only',
      ({ filterKey, filterQuery }) => {
        const values = fullFilters[filterKey] as string[]
        const topicsSkillsEmbedding = ['topics', 'skills'].includes(filterKey)
          ? buildTopicsAndSkillsEmbedding({ [filterKey]: values })
          : undefined

        renderHook(() =>
          useFilteredVolunteeringEngagements({
            filters: { [filterKey]: values },
            pageSize,
          })
        )

        expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
          parameters: {
            filter_by: `type:=[volunteering,task]&&${filterQuery}:=[${values.join(',')}]`,
            sort_by: topicsSkillsEmbedding
              ? `_vector_query(topics_skills_embedding_v2:(${JSON.stringify(topicsSkillsEmbedding)})):asc`
              : '',
            facet_by: 'topics_v2,skills_v2,commitment_label,commitment_duration',
            per_page: 10,
          },
          skip: false,
          onError: expect.any(Function),
        })
      }
    )

    it('should create correct parameters when filtering by location only', () => {
      renderHook(() =>
        useFilteredVolunteeringEngagements({
          filters: { location: fullFilters.location },
          pageSize,
        })
      )

      expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
        parameters: {
          filter_by: 'type:=[volunteering,task]&&location_lat_lng:(1,2,30 km)',
          sort_by: 'location_lat_lng(1,2,precision:5km):asc',
          facet_by: 'topics_v2,skills_v2,commitment_label,commitment_duration',
          per_page: 10,
        },
        skip: false,
        onError: expect.any(Function),
      })
    })

    it('should create correct parameters when filtering by topics and skills', () => {
      const filters = { topics: fullFilters.topics, skills: fullFilters.skills }
      const topicsSkillsEmbedding = buildTopicsAndSkillsEmbedding(filters)

      renderHook(() =>
        useFilteredVolunteeringEngagements({
          filters,
          pageSize,
        })
      )

      expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
        parameters: {
          filter_by:
            'type:=[volunteering,task]&&topics_v2:=[migration-refugees,mobility-transport]&&skills_v2:=[food-service,finances-taxes,fundraising]',
          sort_by: `_vector_query(topics_skills_embedding_v2:(${JSON.stringify(topicsSkillsEmbedding)})):asc`,
          facet_by: 'topics_v2,skills_v2,commitment_label,commitment_duration',
          per_page: 10,
        },
        skip: false,
        onError: expect.any(Function),
      })
    })

    it('should create correct parameters when filtering by all filters', () => {
      const topicsSkillsEmbedding = buildTopicsAndSkillsEmbedding(fullFilters)

      renderHook(() =>
        useFilteredVolunteeringEngagements({
          filters: fullFilters,
          pageSize,
        })
      )

      expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
        parameters: {
          filter_by:
            'type:=[volunteering,task]&&topics_v2:=[migration-refugees,mobility-transport]&&skills_v2:=[food-service,finances-taxes,fundraising]&&commitment_label:=[recurring]&&commitment_duration:=[DAYS_1]&&location_lat_lng:(1,2,30 km)',
          sort_by: `_vector_query(topics_skills_embedding_v2:(${JSON.stringify(topicsSkillsEmbedding)})):asc,location_lat_lng(1,2,precision:5km):asc`,
          facet_by: 'topics_v2,skills_v2,commitment_label,commitment_duration',
          per_page: 10,
        },
        skip: false,
        onError: expect.any(Function),
      })
    })
  })
})

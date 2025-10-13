import { fullFilters } from '@holi-apps/volunteering/__tests__/testData'
import { buildTopicsAndSkillsEmbedding } from '@holi-apps/volunteering/helpers/buildTopicAndSkillsEmbedding'
import { useFilteredVolunteeringEngagements } from '@holi-apps/volunteering/hooks/useFilteredVolunteeringEngagements'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import type { SearchResponseHit } from '@holi/core/typesense/types'
import { renderHook } from 'expo-router/testing-library'

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
  const searchResult = {
    isLoading: false,
    state: {
      hits: makeTypesenseEngagementHits(10),
      canFetchMore: true,
      totalResults: 123,
      totalNrOfPages: 13,
      currentPage: 1,
      parameters: {},
      facetCounts: {},
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
      isLoading: true,
      state: {
        ...searchResult.state,
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
        isLoading: false,
        state: {
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

  it('should query with the correct parameters', () => {
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
          'type:=[volunteering,task]&&topics_v2:=[migration-refugees,mobility-transport]&&skills_v2:=[food-service,finances-taxes,fundraising]&&commitment_label:=[recurring]&&commitment_duration:=[DAYS_1]&&location_lat_lng:(1,2,30 km)&&(location_type:=[onsite,hybrid] || (location_type:=[remote] && location:!=[Bundesweit,Germany-wide] && location:!=""))',
        sort_by: `_vector_query(topics_skills_embedding_v2:(${JSON.stringify(topicsSkillsEmbedding)})):asc,location_lat_lng(1,2,precision:5km):asc`,
        per_page: 10,
      },
      skip: false,
      onError: expect.any(Function),
    })
  })
})

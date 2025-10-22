/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from 'expo-router/testing-library'
import { useTypesense_MultiSearchQuery } from '@holi/api/graphql/graphql-codegen'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import {
  useTypesenseEnrichedData,
  type UseTypesenseEnrichedDataConfig,
} from '@holi/core/typesense/hooks/useTypesenseEnrichedData'
import type { useQuery } from '@apollo/client/react'

jest.mock('@holi/api/graphql/graphql-codegen')
jest.mock('@holi/core/screens/search/hooks/useUserLanguage')
jest.mock('@holi/core/typesense/helpers/localizeTypesenseDocument')

const mockUseTypesense_MultiSearchQuery = useTypesense_MultiSearchQuery as jest.MockedFunction<
  typeof useTypesense_MultiSearchQuery
>
const mockUseUserLanguage = useUserLanguage as jest.MockedFunction<typeof useUserLanguage>
const mockLocalizeTypesenseDocument = localizeTypesenseDocument as jest.MockedFunction<typeof localizeTypesenseDocument>

interface TestGraphQLItem {
  id: string
  externalId: string
  status: 'active' | 'inactive'
}

interface TestQueryData {
  testItems: {
    data: TestGraphQLItem[]
    totalResults: number
  }
}

const mockGraphQLItems: TestGraphQLItem[] = [
  { id: '1', externalId: 'ext-1', status: 'active' },
  { id: '2', externalId: 'ext-2', status: 'inactive' },
]

const mockTypesenseDocuments = [
  { id: 'test_ext-1', title: 'Test Item 1', description: 'Description 1' },
  { id: 'test_ext-2', title: 'Test Item 2', description: 'Description 2' },
]

const createMockGraphQLQuery = (overrides: any = {}): useQuery.Result<TestQueryData> =>
  ({
    data: { testItems: { data: mockGraphQLItems, totalResults: 10 } },
    loading: false,
    error: undefined,
    fetchMore: jest.fn(),
    refetch: jest.fn(),
    ...overrides,
  }) as any

const useTypesenseEnrichedDataWithTypes = (
  config: Omit<UseTypesenseEnrichedDataConfig<useQuery.Result<TestQueryData>, TestGraphQLItem, any>, 'graphqlQuery'> & {
    graphqlQuery: useQuery.Result<TestQueryData>
  }
) => useTypesenseEnrichedData<useQuery.Result<TestQueryData>, TestGraphQLItem>(config)

const dataExtractor = (data?: useQuery.Result<TestQueryData>['data']): TestQueryData['testItems'] =>
  // @ts-ignore unsure how to resolve this
  data?.testItems ? data?.testItems : { data: [], totalResults: 0 }

describe('useTypesenseEnrichedData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseUserLanguage.mockReturnValue('en')
    mockLocalizeTypesenseDocument.mockImplementation((doc) => doc as any)
    mockUseTypesense_MultiSearchQuery.mockReturnValue({
      data: {
        typesense_multiSearch: {
          results: [
            {
              __typename: 'Typesense_SearchResponseSuccess',
              hits: mockTypesenseDocuments.map((doc) => ({ document: doc })),
            },
          ],
        },
      },
      loading: false,
      error: undefined,
    } as any)
  })

  it('should merge graphql query and typesense data correctly', () => {
    const { result } = renderHook(() =>
      useTypesenseEnrichedDataWithTypes({
        graphqlQuery: createMockGraphQLQuery(),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
        itemNormalizer: (graphqlItem, typesenseDoc) => ({
          id: graphqlItem.id,
          title: typesenseDoc.title,
          status: graphqlItem.status,
          externalId: graphqlItem.externalId,
        }),
      })
    )
    expect(result.current.items).toHaveLength(2)
    expect(result.current.items[0]).toEqual({
      id: '1',
      title: 'Test Item 1',
      status: 'active',
      externalId: 'ext-1',
    })
    expect(result.current.totalResults).toBe(10)
    expect(result.current.isLoading).toBe(false)
  })

  it('should return raw grapthql data when no normalizer provided', () => {
    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery(),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
        skipMissingTypesenseData: false,
      })
    )
    expect(result.current.items).toEqual(mockGraphQLItems)
  })

  it('should skip items without typesense data when skipMissingTypesenseData is true', () => {
    mockUseTypesense_MultiSearchQuery.mockReturnValue({
      data: {
        typesense_multiSearch: {
          results: [
            {
              __typename: 'Typesense_SearchResponseSuccess',
              hits: [{ document: mockTypesenseDocuments[0] }],
            },
          ],
        },
      },
      loading: false,
      error: undefined,
    } as any)

    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery(),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
        skipMissingTypesenseData: true,
        itemNormalizer: (graphqlItem, typesenseDoc) => ({
          id: graphqlItem.id,
          title: typesenseDoc.title,
          status: graphqlItem.status,
          externalId: graphqlItem.externalId,
        }),
      })
    )
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].title).toBe('Test Item 1')
  })

  it('should handle loading states correctly', () => {
    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery({ loading: true }),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
      })
    )
    expect(result.current.isLoading).toBe(true)
  })

  it('should handle Typesense loading states correctly', () => {
    mockUseTypesense_MultiSearchQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any)

    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery(),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
      })
    )
    expect(result.current.isLoading).toBe(true)
  })

  it('should provide pagination state', () => {
    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery(),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
      })
    )
    expect(result.current.hasMore).toBe(true)
    expect(result.current.isFetchingMore).toBe(false)
    expect(result.current.totalResults).toBe(10)
  })

  it('should call fetchMore with correct variables', async () => {
    const mockFetchMore = jest.fn().mockResolvedValue({ data: {} })
    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery({ fetchMore: mockFetchMore }),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
        limit: 5,
      })
    )
    await result.current.fetchMore()
    expect(mockFetchMore).toHaveBeenCalledWith({
      variables: {
        offset: 2,
        limit: 5,
      },
    })
  })

  it('should not reset items during typesense loading transitions', () => {
    const { result, rerender } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery(),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
        itemNormalizer: (graphqlItem, typesenseDoc) => ({
          id: graphqlItem.id,
          title: typesenseDoc.title,
          status: graphqlItem.status,
          externalId: graphqlItem.externalId,
        }),
      })
    )
    const initialItems = result.current.items
    expect(initialItems).toHaveLength(2)

    mockUseTypesense_MultiSearchQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as any)
    rerender({})
    expect(result.current.items).toEqual(initialItems)
    expect(result.current.items).toHaveLength(2)
  })

  it('should handle graphql errors', () => {
    const apolloError = new Error('GraphQL Error')
    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery({ error: apolloError }),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
      })
    )
    expect(result.current.error).toEqual(apolloError)
  })

  it('should handle empty graphql data', () => {
    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery({ data: null }),
        dataExtractor,
        typesenseIdExtractor: () => '0',
        typesenseFilter: 'type:=[test]',
      })
    )
    expect(result.current.items).toEqual([])
    expect(result.current.totalResults).toBe(0)
    expect(result.current.hasMore).toBe(false)
  })

  it('should handle typesense errors', () => {
    mockUseTypesense_MultiSearchQuery.mockReturnValue({
      data: {
        typesense_multiSearch: {
          results: [
            {
              __typename: 'Typesense_SearchResponseError',
              error: 'Typesense Error',
            },
          ],
        },
      },
      loading: false,
      error: undefined,
    } as any)

    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery(),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
        itemNormalizer: (graphqlItem, typesenseDoc) => ({
          id: graphqlItem.id,
          title: typesenseDoc.title,
          status: graphqlItem.status,
          externalId: graphqlItem.externalId,
        }),
      })
    )
    expect(result.current.items).toEqual([])
  })

  it('should call refetch correctly', async () => {
    const mockRefetch = jest.fn().mockResolvedValue({ data: {} })
    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery({ refetch: mockRefetch }),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
      })
    )
    await result.current.refetch()
    expect(mockRefetch).toHaveBeenCalled()
  })

  it('should not fetch more when hasMore is false', async () => {
    const mockFetchMore = jest.fn()
    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery({
          data: { testItems: { data: mockGraphQLItems, totalResults: 2 } },
          fetchMore: mockFetchMore,
        }),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
      })
    )
    expect(result.current.hasMore).toBe(false)
    await result.current.fetchMore()
    expect(mockFetchMore).not.toHaveBeenCalled()
  })

  it('should not fetch more when already fetching', async () => {
    const mockFetchMore = jest.fn().mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)))
    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery({ fetchMore: mockFetchMore }),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
      })
    )

    let firstFetch = new Promise<void>(() => {})
    act(() => {
      firstFetch = result.current.fetchMore()
    })

    await result.current.fetchMore()
    expect(mockFetchMore).toHaveBeenCalledTimes(1)
    await firstFetch
  })

  it('should update isFetchingMore state correctly', async () => {
    let resolveFetch: () => void = () => {}
    const mockFetchMore = jest.fn().mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveFetch = () => resolve()
        })
    )
    const { result } = renderHook(() =>
      useTypesenseEnrichedData({
        graphqlQuery: createMockGraphQLQuery({ fetchMore: mockFetchMore }),
        dataExtractor,
        typesenseIdExtractor: (item) => `test_${item.externalId}`,
        typesenseFilter: 'type:=[test]',
      })
    )
    expect(result.current.isFetchingMore).toBe(false)

    let fetchPromise = new Promise<void>(() => {})
    act(() => {
      fetchPromise = result.current.fetchMore()
    })
    expect(result.current.isFetchingMore).toBe(true)
    resolveFetch()
    await act(async () => {
      await fetchPromise
    })

    expect(result.current.isFetchingMore).toBe(false)
  })
})

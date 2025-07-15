import React from 'react'
import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import {
  Typesense_MultiSearchDocument,
  type Typesense_SearchResponseHit,
  type Typesense_SearchResponse,
  type Typesense_SearchResponseError,
  type Typesense_Document,
  Typesense_DocumentType,
  type Typesense_MultiSearchResponse,
} from '@holi/api/graphql/graphql-codegen'
import {
  useTypesensePaginationQuery,
  type UseTypesensePaginationQueryOptions,
} from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { createCache } from '@holi/api/graphql/client'
import type { SearchParams } from '@holi/core/typesense/types'

const testParameters: SearchParams = {
  filter_by: 'type:volunteering',
}
const defaultParameters: SearchParams = {
  q: '*',
  per_page: 10,
  page: 1,
  exclude_fields: 'embedding,similarity_embedding,topics_skills_embedding_v2',
}

const createHits = (length: number): Typesense_SearchResponseHit[] =>
  Array.from({ length }, (_, i) => {
    const document: Typesense_Document = {
      __typename: 'Typesense_Document',
      id: i.toString(),
      type: Typesense_DocumentType.Volunteering,
      description_de: '',
      description_en: '',
      external_url: '',
      image_url: '',
      link_locators: {
        __typename: 'Typesense_DocumentLinkLocators',
        volunteering: i.toString(),
        profile: '',
        space: '',
        task: '',
      },
      location: '',
      location_lat_lng: [1, 2],
      organizer_image_url: '',
      organizer_name: '',
      skills_v2: [],
      source: '',
      title_de: '',
      title_en: '',
      topics_v2: [],
      user_full_name: '',
      commitment_duration: '',
      commitment_label: '',
      location_type: '',
    }
    return {
      __typename: 'Typesense_SearchResponseHit',
      document,
      highlight: undefined,
    }
  })
const testResponse: Typesense_SearchResponse = {
  found: 123,
  page: 1,
  hits: createHits(10),
  out_of: 1234,
  request_params: {},
  search_time_ms: 0,
  facet_counts: [],
  __typename: 'Typesense_SearchResponseSuccess',
}

const createSearchResultsMock = (result: Typesense_SearchResponse, searchParams: SearchParams = testParameters) => ({
  request: {
    query: Typesense_MultiSearchDocument,
    variables: {
      input: {
        searches: [
          {
            ...defaultParameters,
            ...searchParams,
          },
        ],
      },
    },
  },
  result: {
    data: {
      typesense_multiSearch: {
        results: [result],
        __typename: 'Typesense_MultiSearchResponse',
      },
    },
  },
})

const mockSearchError = [
  {
    request: {
      query: Typesense_MultiSearchDocument,
      variables: { input: { searches: [{ ...defaultParameters, ...testParameters }] } },
    },
    error: new Error('Test error'),
  },
]

describe('useTypesensePaginationQuery', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(async () => {
    await act(jest.runOnlyPendingTimersAsync)
    jest.useRealTimers()
  })

  const renderQueryHook = ({
    parameters = testParameters,
    onError,
    skip,
    response,
    mocks,
  }: Partial<UseTypesensePaginationQueryOptions> & {
    response?: Typesense_SearchResponse
    mocks?: MockedResponse[]
  } = {}) => {
    const mockedResponses = mocks ?? [createSearchResultsMock(response ?? testResponse, parameters)]
    return renderHook(() => useTypesensePaginationQuery({ parameters, onError, skip }), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mockedResponses} cache={createCache()}>
          {children}
        </MockedProvider>
      ),
    })
  }

  it('should expose loading state and hits', async () => {
    const { result } = renderQueryHook()

    expect(result.current.state.isLoading).toBeTruthy()
    expect(result.current.state.hits).toHaveLength(0)

    await act(jest.runAllTimersAsync)

    expect(result.current.state.isLoading).toBeFalsy()
    expect(result.current.state.hits).toHaveLength(10)
    expect(result.current.state.currentPage).toBe(1)
    expect(result.current.state.totalResults).toBe(123)
    expect(result.current.state.totalNrOfPages).toBe(13)
  })

  it('should call onError callback for graphQL error', async () => {
    const onError = jest.fn()

    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters: testParameters, onError }), {
      wrapper: ({ children }) => <MockedProvider mocks={mockSearchError}>{children}</MockedProvider>,
    })

    await act(jest.runOnlyPendingTimersAsync)

    expect(onError).toHaveBeenCalledWith(new Error('Test error'))
    expect(result.current.state.isLoading).toBeFalsy()
  })

  it('should call onError callback for search error response', async () => {
    const onError = jest.fn()
    const response: Typesense_SearchResponseError = {
      error: 'Test error',
      code: 123,
      __typename: 'Typesense_SearchResponseError',
    }

    const { result } = renderQueryHook({ onError, response })

    await act(jest.runOnlyPendingTimersAsync)

    expect(onError).toHaveBeenCalledWith('Test error')
    expect(result.current.state.isLoading).toBeFalsy()
  })

  it('canFetchMore should be true if fetching more is possible', async () => {
    const response = { ...testResponse, page: 12 }
    const { result } = renderQueryHook({ response })

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.canFetchMore).toBeTruthy()
  })

  it('canFetchMore should be false if fetching more is not possible', async () => {
    const response = { ...testResponse, page: 13, hits: createHits(3) }
    const { result } = renderQueryHook({ response })

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.canFetchMore).toBeFalsy()
  })

  it('canFetchMore should be false if fetching more is not possible (0 hits)', async () => {
    const response = { ...testResponse, found: 0, page: 1, hits: [] }
    const { result } = renderQueryHook({ response })

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.canFetchMore).toBeFalsy()
  })

  it('canFetchMore should be false if fetching more is not possible (last page)', async () => {
    const response = { ...testResponse, found: 120, page: 12, hits: createHits(10) }
    const { result } = renderQueryHook({ response })

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.canFetchMore).toBeFalsy()
  })

  it('should expose fetching more status', async () => {
    const allHits = createHits(20)
    const mocks = [
      createSearchResultsMock(testResponse),
      createSearchResultsMock(
        { ...testResponse, page: 2, hits: allHits.slice(10) },
        {
          ...testParameters,
          page: 2,
        }
      ),
    ]
    const { result } = renderQueryHook({ mocks })

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.isFetchingMore).toBeFalsy()

    await act(async () => {
      const promise = result.current.fetchNextPage()

      await waitFor(() => expect(result.current.isFetchingMore).toBeTruthy())

      await promise
    })

    expect(result.current.isFetchingMore).toBeFalsy()
  })

  it('should allow fetching more pages', async () => {
    const allHits = createHits(20)
    const mocks = [
      createSearchResultsMock(testResponse),
      createSearchResultsMock(
        { ...testResponse, page: 2, hits: allHits.slice(10) },
        {
          ...testParameters,
          page: 2,
        }
      ),
    ]

    const { result } = renderQueryHook({ mocks })

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    // Fetch second page
    await act(async () => {
      result.current.fetchNextPage()
      await jest.runOnlyPendingTimersAsync()
    })

    expect(result.current.state.hits).toHaveLength(20)
    expect(result.current.state.hits).toEqual(allHits)
  })

  it('should expose refetch function', async () => {
    const allHits = createHits(20)
    const mocks = [
      createSearchResultsMock(testResponse),
      createSearchResultsMock(
        { ...testResponse, page: 2, hits: allHits.slice(10) },
        {
          ...testParameters,
          page: 2,
        }
      ),
      createSearchResultsMock(testResponse),
    ]
    const { result } = renderQueryHook({ mocks })

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.hits).toHaveLength(10)

    // Fetch second page
    await act(async () => {
      result.current.fetchNextPage()
      await jest.runOnlyPendingTimersAsync()
    })

    expect(result.current.state.hits).toHaveLength(20)

    // Refetch: List should start with page 1 again
    await act(async () => {
      result.current.refetch()
      await jest.runOnlyPendingTimersAsync()
    })

    expect(result.current.state.hits).toHaveLength(10)
    expect(result.current.state.hits).toEqual(allHits.slice(0, 10))
  })

  it('should refetch on parameter change', async () => {
    const initialProps = { parameters: testParameters }
    const nextProps = { parameters: { ...testParameters, q: 'new query' } }
    const allHits = createHits(20)
    const mocks = [
      createSearchResultsMock(testResponse),
      createSearchResultsMock({ ...testResponse, page: 1, hits: allHits.slice(10) }, nextProps.parameters),
    ]
    const { result, rerender } = renderHook((props: typeof initialProps) => useTypesensePaginationQuery(props), {
      wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      initialProps,
    })

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    rerender(nextProps)

    expect(result.current.state.isLoading).toBeTruthy()

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.isLoading).toBeFalsy()

    // Expect only results of second request
    expect(result.current.state.hits).toHaveLength(10)
    expect(result.current.state.hits).toEqual(allHits.slice(10))
  })

  it('should not perform search if skip is set', async () => {
    const { result, rerender } = renderQueryHook({ skip: true, mocks: [] })

    expect(result.current.state.isLoading).toBeFalsy()
    expect(result.current.state.hits).toHaveLength(0)

    rerender({ parameters: { ...testParameters, q: 'new query' } })

    expect(result.current.state.isLoading).toBeFalsy()
    expect(result.current.state.hits).toHaveLength(0)
  })

  it('should not perform refetch if skip is set', async () => {
    const { result } = renderQueryHook({ skip: true, mocks: [] })

    await act(async () => {
      result.current.refetch()
      await jest.runOnlyPendingTimersAsync()
    })

    expect(result.current.state.isLoading).toBeFalsy()
    expect(result.current.state.hits).toHaveLength(0)
  })

  it('should transform facet counts', async () => {
    const actualFacetCounts = [
      {
        counts: [
          {
            count: 36,
            value: 'negotiable',
            highlighted: '',
          },
          {
            count: 33,
            value: 'one-time',
            highlighted: '',
          },
          {
            count: 28,
            value: 'recurring',
            highlighted: '',
          },
        ],
        field_name: 'commitment_label',
      },
      {
        counts: [
          {
            count: 42,
            value: 'HOURS_1to2',
            highlighted: '',
          },
          {
            count: 29,
            value: 'HOURS_2to4',
            highlighted: '',
          },
          {
            count: 31,
            value: 'HOURS_4to6',
            highlighted: '',
          },
        ],
        field_name: 'commitment_duration',
      },
    ]
    const expectedFacetCounts = {
      commitment_label: {
        negotiable: 36,
        'one-time': 33,
        recurring: 28,
      },
      commitment_duration: {
        HOURS_1to2: 42,
        HOURS_2to4: 29,
        HOURS_4to6: 31,
      },
    }

    const response: Typesense_MultiSearchResponse['results'][number] = {
      ...testResponse,
      facet_counts: actualFacetCounts,
    }
    const { result } = renderQueryHook({ response })

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.facetCounts).toEqual(expectedFacetCounts)
  })
})

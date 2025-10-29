import React from 'react'
import type { MockLink } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing/react'
import {
  Typesense_MultiSearchDocument,
  type Typesense_SearchResponse,
  type Typesense_SearchResponseError,
  type Typesense_MultiSearchResponse,
} from '@holi/api/graphql/graphql-codegen'
import {
  useTypesensePaginationMultiQuery,
  type UseTypesensePaginationMultiQueryOptions,
} from '@holi/core/typesense/hooks/useTypesensePaginationMultiQuery'
import { act, renderHook, waitFor } from 'expo-router/testing-library'
import { createCache } from '@holi/api/graphql/client'
import type { SearchParams } from '@holi/core/typesense/types'
import { createHits, testState } from '@holi/core/typesense/hooks/__tests__/testData'
import { CombinedProtocolErrors } from '@apollo/client'

const testParameterList: SearchParams[] = [
  {
    filter_by: 'type:volunteering',
  },
  {
    filter_by: 'type:task',
  },
]
const defaultParameters: SearchParams = {
  q: '*',
  per_page: 10,
  page: 1,
  exclude_fields: 'embedding,similarity_embedding,topics_skills_embedding_v2',
}

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

const createSearchResultsMock = (
  results: Typesense_SearchResponse[],
  searches: SearchParams[] = testParameterList
) => ({
  request: {
    query: Typesense_MultiSearchDocument,
    variables: {
      input: {
        searches: searches.map((searchParams) => ({
          ...defaultParameters,
          ...searchParams,
        })),
      },
    },
  },
  result: {
    data: {
      typesense_multiSearch: {
        results,
        __typename: 'Typesense_MultiSearchResponse',
      },
    },
  },
})

const mockSearchError = [
  {
    request: {
      query: Typesense_MultiSearchDocument,
      variables: {
        input: {
          searches: testParameterList.map((searchParams) => ({
            ...defaultParameters,
            ...searchParams,
          })),
        },
      },
    },
    error: new CombinedProtocolErrors([]),
  },
]

describe('useTypesensePaginationMultiQuery', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(async () => {
    await act(jest.runOnlyPendingTimersAsync)
    jest.useRealTimers()
  })

  const renderQueryHook = ({
    parameterList = testParameterList,
    onError,
    skip,
    responses,
    mocks,
  }: Partial<UseTypesensePaginationMultiQueryOptions> & {
    responses?: Typesense_SearchResponse[]
    mocks?: MockLink.MockedResponse[]
  } = {}) => {
    const mockedResponses = mocks ?? [createSearchResultsMock(responses ?? [testResponse, testResponse], parameterList)]
    return renderHook(() => useTypesensePaginationMultiQuery({ parameterList, onError, skip }), {
      wrapper: ({ children }) => (
        <MockedProvider mocks={mockedResponses} cache={createCache()}>
          {children}
        </MockedProvider>
      ),
    })
  }

  it('should expose loading state and hits', async () => {
    const { result } = renderQueryHook()

    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.states).toHaveLength(2)
    expect(result.current.states[0].hits).toHaveLength(0)
    expect(result.current.states[1].hits).toHaveLength(0)

    await act(jest.runAllTimersAsync)

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.states).toHaveLength(2)
    expect(result.current.states[0]).toEqual({
      ...testState,
      parameters: testParameterList[0],
    })
    expect(result.current.states[1]).toEqual({
      ...testState,
      parameters: testParameterList[1],
    })
  })

  it('should call onError callback for graphQL error', async () => {
    const onError = jest.fn()

    const { result } = renderHook(
      () => useTypesensePaginationMultiQuery({ parameterList: testParameterList, onError }),
      {
        wrapper: ({ children }) => <MockedProvider mocks={mockSearchError}>{children}</MockedProvider>,
      }
    )

    await act(jest.runOnlyPendingTimersAsync)

    expect(onError).toHaveBeenCalledWith(new CombinedProtocolErrors([]))
    expect(result.current.isLoading).toBeFalsy()
  })

  it('should call onError callback for first search error response', async () => {
    const onError = jest.fn()
    const response: Typesense_SearchResponseError = {
      error: 'Test error',
      code: 123,
      __typename: 'Typesense_SearchResponseError',
    }

    const { result } = renderQueryHook({ onError, responses: [response, { ...response, error: 'Another test error' }] })

    await act(jest.runOnlyPendingTimersAsync)

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(new Error('Test error'))
    expect(result.current.isLoading).toBeFalsy()
  })

  it('canFetchMore should be true if fetching more is possible', async () => {
    const response = { ...testResponse, page: 12 }
    const { result } = renderQueryHook({ responses: [response, testResponse] })

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.states[0].canFetchMore).toBeTruthy()
  })

  it('canFetchMore should be false if fetching more is not possible', async () => {
    const response = { ...testResponse, page: 13, hits: createHits(3) }
    const { result } = renderQueryHook({ responses: [response, testResponse] })

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.states[0].canFetchMore).toBeFalsy()
  })

  it('canFetchMore should be false if fetching more is not possible (0 hits)', async () => {
    const response = { ...testResponse, found: 0, page: 1, hits: [] }
    const { result } = renderQueryHook({ responses: [response, testResponse] })

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.states[0].canFetchMore).toBeFalsy()
  })

  it('canFetchMore should be false if fetching more is not possible (last page)', async () => {
    const response = { ...testResponse, found: 120, page: 12, hits: createHits(10) }
    const { result } = renderQueryHook({ responses: [response, testResponse] })

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.states[0].canFetchMore).toBeFalsy()
  })

  it('should expose fetching more status', async () => {
    const allHits = createHits(20)
    const mocks = [
      createSearchResultsMock([testResponse, testResponse]),
      createSearchResultsMock(
        [{ ...testResponse, page: 2, hits: allHits.slice(10) }, testResponse],
        testParameterList.map((parameters) => ({
          ...parameters,
          page: 2,
        }))
      ),
    ]
    const { result } = renderQueryHook({ mocks })

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.isFetchingMore).toBeFalsy()

    await act(async () => {
      const promise = result.current.fetchNextPages()

      await waitFor(() => expect(result.current.isFetchingMore).toBeTruthy())

      await promise
    })

    expect(result.current.isFetchingMore).toBeFalsy()
  })

  it('should allow fetching more pages', async () => {
    const allHits = createHits(20)
    const mocks = [
      createSearchResultsMock([testResponse, testResponse]),
      createSearchResultsMock(
        [{ ...testResponse, page: 2, hits: allHits.slice(10) }, testResponse],
        testParameterList.map((parameters) => ({
          ...parameters,
          page: 2,
        }))
      ),
    ]

    const { result } = renderQueryHook({ mocks })

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    // Fetch second page
    await act(async () => {
      result.current.fetchNextPages()
    })

    await waitFor(() => expect(result.current.states[0].hits).toHaveLength(20))
    expect(result.current.states[0].hits).toEqual(allHits)
  })

  it('should expose refetch function', async () => {
    const allHits = createHits(20)
    const mocks = [
      createSearchResultsMock([testResponse, testResponse]),
      createSearchResultsMock(
        [{ ...testResponse, page: 2, hits: allHits.slice(10) }, testResponse],
        testParameterList.map((parameters) => ({
          ...parameters,
          page: 2,
        }))
      ),
      createSearchResultsMock([testResponse, testResponse]),
    ]
    const { result } = renderQueryHook({ mocks })

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.states[0].hits).toHaveLength(10)

    // Fetch second page
    await act(async () => {
      result.current.fetchNextPages()
    })

    await waitFor(() => expect(result.current.states[0].hits).toHaveLength(20))

    // Refetch: List should start with page 1 again
    await act(async () => {
      result.current.refetch()
    })

    await waitFor(() => expect(result.current.states[0].hits).toHaveLength(10))
    expect(result.current.states[0].hits).toEqual(allHits.slice(0, 10))
  })

  it('should refetch on parameter change', async () => {
    const initialProps = { parameterList: testParameterList }
    const nextProps = { parameterList: [{ ...testParameterList[0], q: 'new query' }, testParameterList[1]] }
    const allHits = createHits(20)
    const mocks = [
      createSearchResultsMock([testResponse, testResponse]),
      createSearchResultsMock(
        [{ ...testResponse, page: 1, hits: allHits.slice(10) }, testResponse],
        nextProps.parameterList
      ),
    ]
    const { result, rerender } = renderHook((props: typeof initialProps) => useTypesensePaginationMultiQuery(props), {
      wrapper: ({ children }) => <MockedProvider mocks={mocks}>{children}</MockedProvider>,
      initialProps,
    })

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    rerender(nextProps)

    expect(result.current.isLoading).toBeTruthy()

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.isLoading).toBeFalsy()

    // Expect only results of second request
    expect(result.current.states[0].hits).toHaveLength(10)
    expect(result.current.states[0].hits).toEqual(allHits.slice(10))
  })

  it('should not perform search if skip is set', async () => {
    const { result, rerender } = renderQueryHook({ skip: true, mocks: [] })

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.states[0].hits).toHaveLength(0)

    rerender({ parameterList: [{ ...testParameterList[0], q: 'new query' }, testParameterList[1]] })

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.states[0].hits).toHaveLength(0)
  })

  it('should not perform refetch if skip is set', async () => {
    const { result } = renderQueryHook({ skip: true, mocks: [] })

    await act(async () => {
      result.current.refetch()
      await jest.runOnlyPendingTimersAsync()
    })

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.states[0].hits).toHaveLength(0)
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
    const { result } = renderQueryHook({ responses: [response, testResponse] })

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.states[0].facetCounts).toEqual(expectedFacetCounts)
  })
})

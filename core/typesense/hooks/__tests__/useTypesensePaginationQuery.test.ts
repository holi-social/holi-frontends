import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import type { SearchParams, SearchResponse, SearchResponseHit } from 'typesense/lib/Typesense/Documents'

const mockSearch = jest.fn()
jest.mock('@holi/core/typesense/helpers/createTypesenseClient', () => ({
  createTypesenseClient: () => ({
    multiSearch: (parameters: SearchParams) => mockSearch(parameters),
  }),
}))

const parameters: SearchParams = {
  filter_by: 'type:volunteering',
}

const createHits = (length: number) =>
  Array.from(
    { length },
    (_, i) =>
      ({
        document: {
          id: i.toString(),
          type: 'volunteering',
        },
      }) as SearchResponseHit<TypesenseDocument>
  )

describe('useTypesensePaginationQuery', () => {
  const mockSearchResults = (result: Partial<SearchResponse<TypesenseDocument>>) =>
    mockSearch.mockResolvedValue({ results: [result] })

  beforeEach(() => {
    jest.useFakeTimers()
    mockSearchResults({ found: 123, page: 1, hits: createHits(10) })
  })

  afterEach(async () => {
    await act(jest.runOnlyPendingTimersAsync)
    jest.useRealTimers()
  })

  it('should expose loading state and data', async () => {
    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters }))

    expect(result.current.state.isLoading).toBeTruthy()
    expect(result.current.state.data).toHaveLength(0)

    await act(jest.runAllTimersAsync)

    expect(result.current.state.isLoading).toBeFalsy()
    expect(result.current.state.data).toHaveLength(10)
    expect(result.current.state.currentPage).toBe(1)
    expect(result.current.state.totalResults).toBe(123)
  })

  it('should perform request with the correct parameters', async () => {
    const parameters = {
      q: 'some query',
      filter_by: 'type:volunteering',
      per_page: 5,
    }
    renderHook(() => useTypesensePaginationQuery({ parameters }))

    expect(mockSearch).toHaveBeenCalledWith([
      {
        ...parameters,
        page: 1,
      },
    ])

    await act(jest.runOnlyPendingTimersAsync)
  })

  it('should use default parameters if not specified', async () => {
    renderHook(() => useTypesensePaginationQuery({ parameters }))

    expect(mockSearch).toHaveBeenCalledWith([
      {
        ...parameters,
        q: '*',
        per_page: 10,
        page: 1,
      },
    ])

    await act(jest.runOnlyPendingTimersAsync)
  })

  it('should call onError callback', async () => {
    mockSearch.mockRejectedValue(new Error('Test error'))
    const onError = jest.fn()

    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters, onError }))

    await act(jest.runOnlyPendingTimersAsync)

    expect(onError).toHaveBeenCalledWith(new Error('Test error'))
    expect(result.current.state.isLoading).toBeFalsy()
  })

  it('canFetchMore should be true if fetching more is possible', async () => {
    mockSearchResults({ found: 123, page: 12, hits: createHits(10) })

    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters }))

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.canFetchMore).toBeTruthy()
  })

  it('canFetchMore should be false if fetching more is not possible', async () => {
    mockSearchResults({ found: 123, page: 13, hits: createHits(3) })

    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters }))

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.canFetchMore).toBeFalsy()
  })

  it('canFetchMore should be false if fetching more is not possible (0 hits)', async () => {
    mockSearchResults({ found: 0, page: 1, hits: [] })

    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters }))

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.canFetchMore).toBeFalsy()
  })

  it('canFetchMore should be false if fetching more is not possible (last page)', async () => {
    mockSearchResults({ found: 120, page: 12, hits: createHits(10) })

    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters }))

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.canFetchMore).toBeFalsy()
  })

  it('should expose fetching more status', async () => {
    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters }))

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
    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters }))

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.data).toHaveLength(10)

    mockSearchResults({ found: 123, page: 2, hits: createHits(10) })

    await act(() => result.current.fetchNextPage())

    expect(result.current.state.data).toHaveLength(20)
    expect(mockSearch).toHaveBeenCalledTimes(2)
    expect(mockSearch).toHaveBeenCalledWith([
      {
        ...parameters,
        q: '*',
        per_page: 10,
        page: 2,
      },
    ])
  })

  it('should expose refetch function', async () => {
    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters }))

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.data).toHaveLength(10)

    await act(() => result.current.refetch)

    expect(result.current.state.data).toHaveLength(10)
    expect(mockSearch).toHaveBeenCalledWith([
      {
        ...parameters,
        q: '*',
        per_page: 10,
        page: 1,
      },
    ])
  })

  it('should refetch on parameter change', async () => {
    const initialProps = { parameters }

    const { rerender } = renderHook((props: typeof initialProps) => useTypesensePaginationQuery(props), {
      initialProps,
    })

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    mockSearch.mockClear()

    rerender({ parameters: { ...parameters, q: 'new query' } })

    expect(mockSearch).toHaveBeenCalledWith([
      {
        ...parameters,
        per_page: 10,
        page: 1,
        q: 'new query',
      },
    ])

    await act(jest.runOnlyPendingTimersAsync)
  })

  it('should not refetch if currently loading and parameters did not change', async () => {
    const initialProps = { parameters }

    const { rerender } = renderHook((props: typeof initialProps) => useTypesensePaginationQuery(props), {
      initialProps,
    })

    // Rerender with same parameters before awaiting initial fetch
    rerender({ parameters })

    expect(mockSearch).toHaveBeenCalledTimes(1)

    await act(jest.runOnlyPendingTimersAsync)
  })

  it('should dismiss results if parameters did change', async () => {
    const newParameters = { ...parameters, q: 'new query' }
    // Delay initial request
    mockSearch.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(() => resolve({ found: 123, page: 1, hits: createHits(10) }), 1000))
    )

    const { result, rerender } = renderHook((props) => useTypesensePaginationQuery(props), {
      initialProps: { parameters },
    })

    // Wait until the initial request is in progress
    expect(mockSearch).toHaveBeenCalled()
    expect(result.current.state.isLoading).toBeTruthy()

    // Rerender with new parameters before awaiting initial fetch
    mockSearchResults({ found: 123, page: 1, hits: createHits(3) })
    rerender({ parameters: newParameters })

    // Await both requests
    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.parameters).toEqual(newParameters)
    expect(result.current.state.data).toHaveLength(3)
    expect(mockSearch).toHaveBeenCalledTimes(2)
  })

  it('should not perform search if skip is set', async () => {
    const { result, rerender } = renderHook(() => useTypesensePaginationQuery({ parameters, skip: true }))

    expect(result.current.state.isLoading).toBeFalsy()
    expect(result.current.state.data).toHaveLength(0)
    expect(mockSearch).not.toHaveBeenCalled()

    rerender({ parameters: { ...parameters, q: 'new query' } })

    expect(mockSearch).not.toHaveBeenCalled()
  })
})

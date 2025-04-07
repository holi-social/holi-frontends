import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import type { SearchParams } from 'typesense/lib/Typesense/Documents'

const mockSearch = jest.fn()
jest.mock('@holi/core/typesense/helpers/createTypesenseClient', () => ({
  createTypesenseClient: () => ({
    search: (parameters: SearchParams) => mockSearch(parameters),
  }),
}))

const parameters: SearchParams = {
  filter_by: 'type:volunteering',
}

const createHits = (length: number) =>
  Array.from({ length }, (_, i) => ({
    document: {
      id: i.toString(),
      type: 'volunteering',
    },
  }))

describe('useTypesensePaginationQuery', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockSearch.mockResolvedValue({ found: 123, page: 1, hits: createHits(10) })
  })

  afterEach(async () => {
    await act(jest.runOnlyPendingTimersAsync)
    jest.useRealTimers()
  })

  it('should expose loading state and data', async () => {
    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters }))

    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.state.data).toHaveLength(0)

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.isLoading).toBeFalsy()
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

    expect(mockSearch).toHaveBeenCalledWith({
      ...parameters,
      page: 1,
    })

    await act(jest.runOnlyPendingTimersAsync)
  })

  it('should use default parameters if not specified', async () => {
    renderHook(() => useTypesensePaginationQuery({ parameters }))

    expect(mockSearch).toHaveBeenCalledWith({
      ...parameters,
      q: '*',
      per_page: 10,
      page: 1,
    })

    await act(jest.runOnlyPendingTimersAsync)
  })

  it('should call onError callback', async () => {
    mockSearch.mockRejectedValue(new Error('Test error'))
    const onError = jest.fn()

    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters, onError }))

    await act(jest.runOnlyPendingTimersAsync)

    expect(onError).toHaveBeenCalledWith(new Error('Test error'))
    expect(result.current.isLoading).toBeFalsy()
  })

  it('canFetchMore should be true if fetching more is possible', async () => {
    mockSearch.mockResolvedValue({ found: 123, page: 12, hits: createHits(10) })

    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters }))

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.canFetchMore).toBeTruthy()
  })

  it('canFetchMore should be false if fetching more is not possible', async () => {
    mockSearch.mockResolvedValue({ found: 123, page: 13, hits: createHits(3) })

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

    mockSearch.mockResolvedValue({ found: 123, page: 2, hits: createHits(10) })

    await act(() => result.current.fetchNextPage())

    expect(result.current.state.data).toHaveLength(20)
    expect(mockSearch).toHaveBeenCalledTimes(2)
    expect(mockSearch).toHaveBeenCalledWith({
      ...parameters,
      q: '*',
      per_page: 10,
      page: 2,
    })
  })

  it('should expose refetch function', async () => {
    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters }))

    // Await initial fetch
    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.state.data).toHaveLength(10)

    await act(() => result.current.refetch)

    expect(result.current.state.data).toHaveLength(10)
    expect(mockSearch).toHaveBeenCalledWith({
      ...parameters,
      q: '*',
      per_page: 10,
      page: 1,
    })
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

    expect(mockSearch).toHaveBeenCalledWith({
      ...parameters,
      per_page: 10,
      page: 1,
      q: 'new query',
    })

    await act(jest.runOnlyPendingTimersAsync)
  })
})

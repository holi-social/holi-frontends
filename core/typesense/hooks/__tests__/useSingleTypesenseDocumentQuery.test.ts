import { useSingleTypesenseDocumentQuery } from '@holi/core/typesense/hooks/useSingleTypesenseDocumentQuery'
import type { TypesenseDocumentType } from '@holi/core/typesense/types'
import { act, renderHook } from '@testing-library/react-native'
import type { SearchParams } from 'typesense/lib/Typesense/Documents'

const mockSearch = jest.fn()
jest.mock('@holi/core/typesense/helpers/createTypesenseClient', () => ({
  createTypesenseClient: () => ({
    search: (parameters: SearchParams) => mockSearch(parameters),
  }),
}))

const hit = {
  document: {
    id: '123',
    type: 'volunteering',
  },
}

describe('useSingleTypesenseDocumentQuery', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockSearch.mockResolvedValue({ found: 1, page: 1, hits: [hit] })
  })

  afterEach(async () => {
    await act(jest.runOnlyPendingTimersAsync)
    jest.useRealTimers()
  })

  it('should expose loading state and document', async () => {
    const { result } = renderHook(() => useSingleTypesenseDocumentQuery('123', 'volunteering'))

    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.document).toBeUndefined()

    await act(jest.runOnlyPendingTimersAsync)

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.document).toEqual(hit.document)
  })

  it('should perform search with the correct paramters', () => {
    renderHook(() => useSingleTypesenseDocumentQuery('123', 'volunteering'))

    expect(mockSearch).toHaveBeenCalledWith({
      q: '*',
      filter_by: 'id:volunteering_123 && type:volunteering',
      per_page: 1,
    })
  })

  it('should allow refresh', async () => {
    const { result } = renderHook(() => useSingleTypesenseDocumentQuery('123', 'volunteering'))

    // Await initial request
    await act(jest.runOnlyPendingTimersAsync)

    mockSearch.mockClear()

    act(() => {
      result.current.refresh()
    })

    expect(mockSearch).toHaveBeenCalled()
  })

  it('should refetch on parameter change', async () => {
    const initialProps = {
      id: '123',
      documentType: 'volunteering' as TypesenseDocumentType,
    }
    const { rerender } = renderHook(
      (props: typeof initialProps) => useSingleTypesenseDocumentQuery(props.id, props.documentType),
      { initialProps }
    )

    // Await initial request
    await act(jest.runOnlyPendingTimersAsync)

    mockSearch.mockClear()

    rerender({ id: '456', documentType: 'space' })

    expect(mockSearch).toHaveBeenCalledWith({
      q: '*',
      filter_by: 'id:space_456 && type:space',
      per_page: 1,
    })
  })

  it('should call onError callback', async () => {
    mockSearch.mockRejectedValue(new Error('Test error'))
    const onError = jest.fn()
    const { result } = renderHook(() => useSingleTypesenseDocumentQuery('123', 'volunteering', { onError }))

    await act(jest.runOnlyPendingTimersAsync)

    expect(onError).toHaveBeenCalledWith(new Error('Test error'))
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.document).toBeUndefined()
  })

  it('should call onNotFound callback', async () => {
    mockSearch.mockResolvedValue({ found: 0, page: 1, hits: [] })
    const onNotFound = jest.fn()
    const { result } = renderHook(() => useSingleTypesenseDocumentQuery('123', 'volunteering', { onNotFound }))

    await act(jest.runOnlyPendingTimersAsync)

    expect(onNotFound).toHaveBeenCalled()
    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.document).toBeUndefined()
  })
})

import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { renderHook } from '@testing-library/react-native'
import {
  useTypesensePaginationMultiQuery,
  type UseTypesensePaginationMultiQueryHook,
} from '@holi/core/typesense/hooks/useTypesensePaginationMultiQuery'
import type { SearchParams } from '@holi/core/typesense/types'
import { testState } from '@holi/core/typesense/hooks/__tests__/testData'

const mockUseTypesensePaginationMultiQuery = jest.mocked(useTypesensePaginationMultiQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationMultiQuery', () => ({
  useTypesensePaginationMultiQuery: jest.fn(),
}))

const testParameters: SearchParams = {
  filter_by: 'type:volunteering',
}

describe('useTypesensePaginationQuery', () => {
  const mockMultiQueryResponse = (response: Partial<UseTypesensePaginationMultiQueryHook> = {}) => {
    mockUseTypesensePaginationMultiQuery.mockReturnValue({
      isLoading: true,
      isFetchingMore: true,
      states: [testState],
      fetchNextPages: jest.fn(),
      refetch: jest.fn(),
      ...response,
    })
  }
  beforeEach(() => {
    mockMultiQueryResponse()
  })

  it('should return single result of multi query response', async () => {
    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters: testParameters }))

    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.state).toEqual(testState)
  })

  it('should expose function to fetch next page', async () => {
    const fetchNextPages = jest.fn()
    mockMultiQueryResponse({ fetchNextPages })

    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters: testParameters }))

    result.current.fetchNextPage()

    expect(fetchNextPages).toHaveBeenCalled()
  })

  it('should expose function to refetch results', async () => {
    const refetch = jest.fn()
    mockMultiQueryResponse({ refetch })

    const { result } = renderHook(() => useTypesensePaginationQuery({ parameters: testParameters }))

    result.current.refetch()

    expect(refetch).toHaveBeenCalled()
  })

  it('should call multi query hook with correct parameters', () => {
    const onError = jest.fn()
    renderHook(() => useTypesensePaginationQuery({ parameters: testParameters, skip: true, onError }))

    expect(mockUseTypesensePaginationMultiQuery).toHaveBeenCalledWith({
      parameterList: [testParameters],
      skip: true,
      onError,
    })
  })
})

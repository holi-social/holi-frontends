import AsyncStore from '@react-native-async-storage/async-storage'
import { act, renderHook, waitFor } from '@testing-library/react-native'

import { useFirstVisitContentSelection } from '@holi/core/screens/onboarding/hooks/useFirstVisitContentSelection'

jest.useFakeTimers()

describe('useFirstVisitContentSelection', () => {
  const mockGetItem = jest.fn()
  const mockSetItem = jest.fn()

  beforeEach(() => {
    mockGetItem.mockResolvedValue(undefined)
    jest.spyOn(AsyncStore, 'getItem').mockImplementation(mockGetItem)
    jest.spyOn(AsyncStore, 'setItem').mockImplementation(mockSetItem)
  })

  it('should load content selection from async storage', async () => {
    mockGetItem.mockResolvedValue('VOLUNTEERING')

    const { result } = renderHook(() => useFirstVisitContentSelection())

    // Loading state is null
    expect(result.current.selectedContentType).toBeNull()
    expect(result.current.isLoading).toBeTruthy()

    expect(mockGetItem).toHaveBeenCalled()

    await waitFor(() => expect(result.current.selectedContentType).toEqual('VOLUNTEERING'))
    expect(result.current.isLoading).toBeFalsy()
  })

  it('should store content selection in async storage', async () => {
    const { result } = renderHook(() => useFirstVisitContentSelection())

    await act(() => result.current.selectContentType('DONATIONS'))

    expect(mockSetItem).toHaveBeenCalledWith(expect.any(String), 'DONATIONS')
  })

  it('should update content selection when storing', async () => {
    const { result } = renderHook(() => useFirstVisitContentSelection())

    // Await initialization
    await waitFor(() => expect(result.current.isLoading).toBeFalsy())

    await act(() => result.current.selectContentType('POSTS'))

    await waitFor(() => expect(result.current.selectedContentType).toEqual('POSTS'))
  })

  const testCasesRoutes = [
    { contentType: 'CHALLENGES', expectedRoute: '/act?section=CHALLENGES' },
    { contentType: 'DONATIONS', expectedRoute: '/act?section=DONATIONS' },
    { contentType: 'VOLUNTEERING', expectedRoute: '/act?section=VOLUNTEERING' },
    { contentType: 'SPACES', expectedRoute: '/spaces' },
    { contentType: 'HOME', expectedRoute: '/' },
    { contentType: 'invalid', expectedRoute: '/' },
  ]
  it.each(testCasesRoutes)(
    'should expose route $expectedRoute for content type $contentType',
    async ({ contentType, expectedRoute }) => {
      const { result } = renderHook(() => useFirstVisitContentSelection())

      // Await initialization
      await waitFor(() => expect(result.current.isLoading).toBeFalsy())

      await act(() => result.current.selectContentType(contentType))

      await waitFor(() => expect(result.current.routeForSelectedContentType).toEqual(expectedRoute))
    }
  )
})

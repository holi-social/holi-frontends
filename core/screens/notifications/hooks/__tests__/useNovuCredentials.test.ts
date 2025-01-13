import { renderHook, waitFor } from '@testing-library/react-native'
import axios from 'axios'

import { novuCredentialsUrl } from '@holi/core/screens/notifications/config'
import { useNovuCredentials } from '@holi/core/screens/notifications/hooks/useNovuCredentials'

jest.mock('axios')

describe('useNovuCredentials', () => {
  const mockGet = axios.get as jest.Mock

  it('only returns loading state when userId is not provided', () => {
    const { result } = renderHook(() => useNovuCredentials())

    expect(mockGet).not.toHaveBeenCalled()

    expect(result.current.hmacHash).toBeNull()
    expect(result.current.loading).toBe(true)
  })

  it('calls the credentials api when userId is provided', async () => {
    const mockResponse = { data: { hmacHash: 'someHmacHash' } }
    mockGet.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useNovuCredentials('someUserId'))

    await waitFor(() =>
      expect(axios.get).toHaveBeenCalledWith(novuCredentialsUrl, {
        withCredentials: true,
        headers: { Authorization: 'Bearer session_token_stub', 'X-Session-Token': 'session_token_stub' },
      })
    )
    expect(result.current.hmacHash).toBe('someHmacHash')
    expect(result.current.loading).toBe(false)
  })

  it("on error, it doesn't initialize but swallows it", async () => {
    mockGet.mockRejectedValue({ error: true })

    let result: { current: { hmacHash: string | null; loading: boolean } }
    expect(() => {
      result = renderHook(() => useNovuCredentials('someUserId')).result
    }).not.toThrow()

    await waitFor(() => {
      expect(result.current.hmacHash).toBe(null)
      expect(result.current.loading).toBe(true)
    })
  })
})

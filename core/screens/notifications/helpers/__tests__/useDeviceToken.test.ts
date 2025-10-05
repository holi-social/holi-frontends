import { act, renderHook } from 'expo-router/testing-library'
import { addPushTokenListener, getDevicePushTokenAsync } from 'expo-notifications'

import {
  initDeviceToken,
  subscribeToDeviceTokenChanges,
  useDeviceToken,
} from '@holi/core/screens/notifications/helpers/useDeviceToken'

const mockGetDevicePushTokenAsync = getDevicePushTokenAsync as jest.Mock
const mockAddPushTokenListener = addPushTokenListener as jest.Mock
jest.mock('expo-notifications', () => ({
  getDevicePushTokenAsync: jest.fn(),
  addPushTokenListener: jest.fn(),
}))

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

describe('useDeviceToken', () => {
  const testDeviceToken = 'some_token'

  it('should require initialization', () => {
    const { result } = renderHook(useDeviceToken)

    expect(result.current.deviceToken).toBeUndefined()
    expect(result.current.deviceTokenInitialized).toBeFalsy()
  })

  it('should handle errors when token retrieval fails', async () => {
    const testError = new Error('Test')
    mockGetDevicePushTokenAsync.mockRejectedValue(testError)
    const { result } = renderHook(useDeviceToken)

    await act(initDeviceToken)

    expect(result.current.deviceToken).toBeUndefined()
    expect(result.current.deviceTokenInitialized).toBeTruthy()
    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledWith('[initDeviceToken] Error retrieving device token', testError, {})
  })

  it('should expose device token after successful initialization', async () => {
    mockGetDevicePushTokenAsync.mockResolvedValue({ data: testDeviceToken })
    const { result } = renderHook(useDeviceToken)

    await act(initDeviceToken)

    expect(result.current.deviceToken).toEqual(testDeviceToken)
    expect(result.current.deviceTokenInitialized).toBeTruthy()
  })

  it('should subscribe to device token changes', async () => {
    const newDeviceToken = 'new_token'
    mockGetDevicePushTokenAsync.mockResolvedValue({ data: testDeviceToken })
    mockAddPushTokenListener.mockImplementation((listener) => listener({ data: newDeviceToken }))
    const { result } = renderHook(useDeviceToken)

    await act(initDeviceToken)

    expect(result.current.deviceToken).toEqual(testDeviceToken)

    await act(() => {
      subscribeToDeviceTokenChanges()
    })

    expect(result.current.deviceToken).toEqual(newDeviceToken)
  })
})

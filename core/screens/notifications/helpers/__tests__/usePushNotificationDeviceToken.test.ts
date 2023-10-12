import { act, renderHook } from '@testing-library/react-native'
import { getDevicePushTokenAsync } from 'expo-notifications'

import {
  initPushNotificationDeviceToken,
  usePushNotificationDeviceToken,
} from '@holi/core/screens/notifications/helpers/usePushNotificationDeviceToken'

const mockGetDevicePushTokenAsync = getDevicePushTokenAsync as jest.Mock
jest.mock('expo-notifications', () => ({
  getDevicePushTokenAsync: jest.fn(),
}))

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

describe('usePushNotificationDeviceToken', () => {
  const testDeviceToken = 'some_token'

  it('should require initialization', () => {
    const { result } = renderHook(usePushNotificationDeviceToken)

    expect(result.current.deviceToken).toBeUndefined()
    expect(result.current.deviceTokenInitialized).toBeFalsy()
  })

  it('should handle errors when token retrieval fails', async () => {
    const testError = new Error('Test')
    mockGetDevicePushTokenAsync.mockRejectedValue(testError)
    const { result } = renderHook(usePushNotificationDeviceToken)

    await act(initPushNotificationDeviceToken)

    expect(result.current.deviceToken).toBeUndefined()
    expect(result.current.deviceTokenInitialized).toBeTruthy()
    // eslint-disable-next-line no-console
    expect(console.warn).toHaveBeenCalledWith(
      '[initPushNotificationDeviceToken] Error retrieving device token',
      testError,
      {}
    )
  })

  it('should expose device token after successful initialization', async () => {
    mockGetDevicePushTokenAsync.mockResolvedValue({ data: testDeviceToken })
    const { result } = renderHook(usePushNotificationDeviceToken)

    await act(initPushNotificationDeviceToken)

    expect(result.current.deviceToken).toEqual(testDeviceToken)
    expect(result.current.deviceTokenInitialized).toBeTruthy()
  })
})

import { MockedProvider } from '@apollo/client/testing'
import { act, render } from '@testing-library/react-native'
import React from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import PushNotificationDeviceRegistration from '@holi/core/screens/notifications/components/PushNotificationDeviceRegistration'
import { getPushNotificationDeviceToken } from '@holi/core/screens/notifications/helpers/getPushNotificationDeviceToken'
import { initPushNotificationDeviceToken } from '@holi/core/screens/notifications/helpers/usePushNotificationDeviceToken'
import { registerDeviceMutation } from '@holi/core/screens/notifications/mutations'

const loggedIn = () => ({ isLoggedIn: true })
const loggedOut = () => ({ isLoggedIn: false })
const useAuthMock = useAuth as jest.Mock

const mockGetPushNotificationDeviceToken = getPushNotificationDeviceToken as jest.Mock

jest.mock('@holi/core/auth/helpers/useAuth', () => ({
  useAuth: jest.fn(),
}))
jest.mock('@holi/core/screens/notifications/helpers/getPushNotificationDeviceToken', () => ({
  getPushNotificationDeviceToken: jest.fn(),
}))

const testDeviceToken = 'some_token'

const registerDeviceRequest = {
  request: {
    query: registerDeviceMutation,
    variables: {
      input: {
        token: testDeviceToken,
        deviceType: 'IOS',
      },
    },
  },
  result: {
    data: {
      registerDevice: {
        success: true,
      },
    },
  },
}
const MOCKS = [registerDeviceRequest]

describe('PushNotificationDeviceRegistration', () => {
  beforeEach(async () => {
    mockGetPushNotificationDeviceToken.mockResolvedValue(testDeviceToken)
    await initPushNotificationDeviceToken()
  })

  it('should do nothing if no user is logged in', () => {
    useAuthMock.mockImplementation(loggedOut)

    const { toJSON } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <PushNotificationDeviceRegistration />
      </MockedProvider>
    )

    // TODO: check that mutation was really not called
    expect(toJSON()).toBeNull()
  })

  it('should register device token for logged in user', async () => {
    useAuthMock.mockImplementation(loggedIn)

    const { toJSON } = render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <PushNotificationDeviceRegistration />
      </MockedProvider>
    )

    // TODO: check that mutation was actually called
    await act(() => expect(toJSON()).toBeNull())
  })
})

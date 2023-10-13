import { MockedProvider } from '@apollo/client/testing'
import { act, render } from '@testing-library/react-native'
import React from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import DeviceRegistration from '@holi/core/screens/notifications/components/DeviceRegistration'
import { getDeviceToken } from '@holi/core/screens/notifications/helpers/getDeviceToken'
import { initDeviceToken } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { registerDeviceMutation } from '@holi/core/screens/notifications/mutations'

const loggedIn = () => ({ isLoggedIn: true })
const loggedOut = () => ({ isLoggedIn: false })
const useAuthMock = useAuth as jest.Mock

const mockGetDeviceToken = getDeviceToken as jest.Mock

jest.mock('@holi/core/auth/helpers/useAuth', () => ({
  useAuth: jest.fn(),
}))
jest.mock('@holi/core/screens/notifications/helpers/getDeviceToken', () => ({
  getDeviceToken: jest.fn(),
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

describe('DeviceRegistration', () => {
  beforeEach(async () => {
    mockGetDeviceToken.mockResolvedValue(testDeviceToken)
    await initDeviceToken()
  })

  it('should do nothing if no user is logged in', () => {
    useAuthMock.mockImplementation(loggedOut)

    const { toJSON } = render(
      <MockedProvider mocks={[]} addTypename={false}>
        <DeviceRegistration />
      </MockedProvider>
    )

    // TODO: check that mutation was really not called
    expect(toJSON()).toBeNull()
  })

  it('should register device token for logged in user', async () => {
    useAuthMock.mockImplementation(loggedIn)

    const { toJSON } = render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <DeviceRegistration />
      </MockedProvider>
    )

    // TODO: check that mutation was actually called
    await act(() => expect(toJSON()).toBeNull())
  })
})

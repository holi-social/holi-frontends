import { MockedProvider } from '@apollo/client/testing/react'
import { act, render } from '@testing-library/react-native'
import React from 'react'

import { type LoginState, useLoginState } from '@holi/core/auth/loginState'
import DeviceRegistration from '@holi/core/screens/notifications/components/DeviceRegistration'
import { getDeviceToken } from '@holi/core/screens/notifications/helpers/getDeviceToken'
import { initDeviceToken } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { registerDeviceMutation } from '@holi/core/screens/notifications/mutations'

const loggedIn = (): LoginState => ({
  isUnknown: false,
  isLoggedOut: false,
  isLoggedIn: true,
  userId: '123',
})
const loggedOut = (): LoginState => ({
  isUnknown: false,
  isLoggedOut: true,
  isLoggedIn: false,
})

const useLoginStateMock = useLoginState as jest.Mock

const mockGetDeviceToken = getDeviceToken as jest.Mock

jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: jest.fn(),
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
    useLoginStateMock.mockImplementation(loggedOut)

    const { toJSON } = render(
      <MockedProvider mocks={[]}>
        <DeviceRegistration />
      </MockedProvider>
    )

    // TODO: check that mutation was really not called
    expect(toJSON()).toBeNull()
  })

  it('should register device token for logged in user', async () => {
    useLoginStateMock.mockImplementation(loggedIn)

    const { toJSON } = render(
      <MockedProvider mocks={MOCKS}>
        <DeviceRegistration />
      </MockedProvider>
    )

    // TODO: check that mutation was actually called
    await act(() => expect(toJSON()).toBeNull())
  })
})

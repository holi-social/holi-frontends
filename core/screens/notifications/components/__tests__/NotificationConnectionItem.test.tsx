import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'

import NotificationConnectionItem from '@holi/core/screens/notifications/components/NotificationConnectionItem'
import { notificationConnectionRequest } from '@holi/core/screens/notifications/components/seedData'
import { updateConnectionWithUserMutation } from '@holi/core/screens/userprofile/queries'

const MOCKS = [
  {
    request: {
      query: updateConnectionWithUserMutation,
      variables: {
        input: {
          userId: notificationConnectionRequest.options.user.id,
          action: 'CONNECT',
        },
      },
    },
    result: {
      data: {
        updateConnectionWithUser: () => Promise.resolve({}),
      },
    },
  },
  {
    request: {
      query: updateConnectionWithUserMutation,
      variables: {
        input: {
          userId: notificationConnectionRequest.options.user.id,
          action: 'DISCONNECT',
        },
      },
    },
    result: {
      data: {
        updateConnectionWithUser: () => Promise.resolve({}),
      },
    },
  },
]

describe('NotificationConnectionItem.tsx', () => {
  beforeEach(() => {
    jest.useRealTimers()
  })

  it('matches snapshot', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-04'))

    render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <NotificationConnectionItem notification={notificationConnectionRequest} />
      </MockedProvider>
    )

    expect(screen).toMatchSnapshot()
  })

  it('renders loader after ignoring a connection request', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <NotificationConnectionItem notification={notificationConnectionRequest} />
      </MockedProvider>
    )

    fireEvent(getByTestId('ignore-connection-request-button'), 'click')

    expect(getByTestId('connection-notification-loader-indicator')).toBeDefined()

    await waitForElementToBeRemoved(() => getByTestId('connection-notification-loader-indicator'))
  })

  it('renders loader after accepting a connection request', async () => {
    const { getByTestId } = render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <NotificationConnectionItem notification={notificationConnectionRequest} />
      </MockedProvider>
    )

    fireEvent(getByTestId('accept-connection-request-button'), 'click')

    expect(getByTestId('connection-notification-loader-indicator')).toBeDefined()

    await waitForElementToBeRemoved(() => getByTestId('connection-notification-loader-indicator'))
  })
})

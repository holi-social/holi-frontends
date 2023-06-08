import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import NotificationSpaceConnectionItem from '@holi/core/screens/notifications/components/NotificationSpaceConnectionItem'
import { notificationSpaceConnectionRequest } from '@holi/core/screens/notifications/components/seedData'
import { updateSpaceUserConnectionMutation } from '@holi/core/screens/spaces/details/mutations'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

const acceptRequest = {
  request: {
    query: updateSpaceUserConnectionMutation,
    variables: {
      connectAction: SpaceConnectionAction.CONNECT,
      connectionType: SpaceConnectionType.MEMBER,
      userId: notificationSpaceConnectionRequest.options.user.id,
      spaceId: notificationSpaceConnectionRequest.options.space.id,
    },
  },
  newData: jest.fn(() => {
    return {}
  }),
}
const declineRequest = {
  request: {
    query: updateSpaceUserConnectionMutation,
    variables: {
      connectAction: SpaceConnectionAction.DISCONNECT,
      connectionType: SpaceConnectionType.MEMBERSHIP_REQUESTOR,
      userId: notificationSpaceConnectionRequest.options.user.id,
      spaceId: notificationSpaceConnectionRequest.options.space.id,
    },
  },
  newData: jest.fn(() => {
    return {}
  }),
}
const MOCKS = [acceptRequest, declineRequest]

describe('NotificationSpaceConnectionItem.tsx', () => {
  beforeEach(() => {
    jest.useRealTimers()
  })

  it('matches snapshot', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-04'))

    const tree = renderer
      .create(
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <NotificationSpaceConnectionItem notification={notificationSpaceConnectionRequest} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders loader after ignoring a connection request', async () => {
    const { getByTestId } = render(
      <ToastProvider>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <NotificationSpaceConnectionItem notification={notificationSpaceConnectionRequest} />
        </MockedProvider>
      </ToastProvider>
    )

    fireEvent(getByTestId('ignore-connection-request-button'), 'click')
    expect(declineRequest.newData).toHaveBeenCalled()
    expect(getByTestId('connection-notification-loader-indicator')).toBeDefined()

    await waitForElementToBeRemoved(() => getByTestId('connection-notification-loader-indicator'))
  })

  it('renders loader after accepting a connection request', async () => {
    const { getByTestId } = render(
      <ToastProvider>
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <NotificationSpaceConnectionItem notification={notificationSpaceConnectionRequest} />
        </MockedProvider>
      </ToastProvider>
    )

    fireEvent(getByTestId('accept-connection-request-button'), 'click')
    expect(acceptRequest.newData).toHaveBeenCalled()
    expect(getByTestId('connection-notification-loader-indicator')).toBeDefined()

    await waitForElementToBeRemoved(() => getByTestId('connection-notification-loader-indicator'))
  })
})

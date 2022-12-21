import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import NotificationConnectionItem from '@holi/core/screens/notifications/components/NotificationConnectionItem'
import { notificationConnectionRequest } from '@holi/core/screens/notifications/components/seedData'
import { updateConnectionWithUserMutation } from '@holi/core/screens/userprofile/queries'

const MOCKS = [
  {
    request: {
      query: updateConnectionWithUserMutation,
      variables: {
        userId: notificationConnectionRequest.options.user.id,
        action: 'CONNECT',
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
  it('matches snapshot', () => {
    const tree = renderer
      .create(
        <MockedProvider mocks={MOCKS} addTypename={false}>
          <NotificationConnectionItem notification={notificationConnectionRequest} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders loader after buttons pressed', async () => {
    const { getByRole, getByTestId } = render(
      <MockedProvider mocks={MOCKS} addTypename={false}>
        <NotificationConnectionItem notification={notificationConnectionRequest} />
      </MockedProvider>
    )

    await fireEvent(
      getByRole('button', {
        name: /notifications.connection.ignore/i,
      }),
      'click'
    )

    await waitForElementToBeRemoved(() => getByTestId('loader'))

    await fireEvent(
      getByRole('button', {
        name: /notifications.connection.accept/i,
      }),
      'click'
    )

    await waitForElementToBeRemoved(() => getByTestId('loader'))
  })
})

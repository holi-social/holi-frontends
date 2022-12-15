import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import * as React from 'react'

import UserConnectionButtons from '@holi/core/screens/userprofile/components/UserConnectionButtons'
import { updateConnectionWithUserMutation } from '@holi/core/screens/userprofile/queries'
import { UpdateConnectionWithUserActions, User, UserConnectionStatus } from '@holi/core/screens/userprofile/types'

const connectActionMutation = {
  request: {
    query: updateConnectionWithUserMutation,
    variables: {
      input: {
        userId: '1',
        action: UpdateConnectionWithUserActions.CONNECT,
      },
    },
  },
  result: jest.fn(() => ({ some: 'data' })),
}

const disconnectActionMutation = {
  request: {
    query: updateConnectionWithUserMutation,
    variables: {
      input: {
        userId: '1',
        action: UpdateConnectionWithUserActions.DISCONNECT,
      },
    },
  },
  result: jest.fn(() => ({ some: 'data' })),
}

const mocks = [connectActionMutation, disconnectActionMutation]

describe('UserConnectionButtons', () => {
  it('renders the request button and calls the mutation', async () => {
    const user = userWith({ connectionStatusToMyself: UserConnectionStatus.NOT_CONNECTED })

    const { getByTestId, queryByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserConnectionButtons user={user} />
      </MockedProvider>
    )

    expect(queryByTestId('user-connection-button-IGNORE')).toBeNull
    fireEvent.press(getByTestId('user-connection-button-NOT_CONNECTED'))

    await waitFor(() => {
      expect(connectActionMutation.result).toHaveBeenCalled()
    })
  })

  it('renders the primary and secondary buttons for pending confirmations', async () => {
    const user = userWith({ connectionStatusToMyself: UserConnectionStatus.PENDING_CONFIRMATION })

    const { getByTestId } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <UserConnectionButtons user={user} />
      </MockedProvider>
    )

    const primary = getByTestId('user-connection-button-PENDING_CONFIRMATION')
    const secondary = getByTestId('user-connection-button-IGNORE')

    expect(primary).toBeVisible

    fireEvent.press(primary)

    await waitFor(() => {
      expect(connectActionMutation.result).toHaveBeenCalled()
    })

    expect(secondary).toBeVisible
    fireEvent.press(secondary)

    await waitFor(() => {
      expect(disconnectActionMutation.result).toHaveBeenCalled()
    })
  })
})

const userWith = (overrides: Partial<User>): User => ({
  id: '1',
  firstName: 'Some',
  lastName: 'Body',
  fullName: 'Some Body',
  avatar: 'https://www.example.com/avatar.jpg',
  avatarLabel: 'SB',
  avatarDefaultColor: '#FFFFFF',
  interests: [
    { id: 'ANIMAL_WELFARE', title: 'Animal welfare' },
    { id: 'ENVIRONMENTAL_PROTECTION', title: 'Environmental Protection' },
  ],
  ...overrides,
})

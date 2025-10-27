import type { MockLink } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import SpaceInviteView from '@holi/core/screens/spaces/details/components/SpaceInviteView'
import { HoliToastType, ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import {
  UpdateConnectionAction,
  SpaceUserConnectionType,
  UsersByNameWithSpaceConnectionDocument,
  UpdateSpaceUserConnectionDocument,
  InviteToSpaceByEmailDocument,
} from '@holi/api/graphql/graphql-codegen'

// prevent logging about incomplete apollo mocks,
// because we didn't flesh out the response data
global.console.error = jest.fn()
global.console.warn = jest.fn()

const spaceId = 'space1'
const userId = 'user1'
const userSearchRequest = {
  query: UsersByNameWithSpaceConnectionDocument,
  variables: {
    substring: 'foobar',
    spaceId,
    offset: 0,
    limit: 10,
  },
}
const userSearchSuccessMock = {
  request: userSearchRequest,
  result: {
    data: {
      userByName: {
        totalResults: 1,
        data: [
          {
            id: userId,
            identity: userId,
            avatarDefaultColor: '#000000',
            avatarLabel: 'TU',
            fullName: 'Test User',
            connectionStatusToSpace: [],
          },
        ],
      },
    },
  },
}
const emailInviteRequest = {
  query: InviteToSpaceByEmailDocument,
  variables: {
    email: 'foo@bar.com',
    spaceId,
  },
}
const emailInviteSuccessMock = {
  request: emailInviteRequest,
  result: {
    data: {},
  },
}
const emailInviteErrorMock = {
  request: emailInviteRequest,
  error: new HoliError('Test error'),
}
const inviteMutationRequest = {
  query: UpdateSpaceUserConnectionDocument,
  variables: {
    connectAction: UpdateConnectionAction.Connect,
    connectionType: SpaceUserConnectionType.MembershipInvitee,
    userId,
    spaceId,
  },
}
export const inviteMutationSuccessMock = {
  request: inviteMutationRequest,
  result: {
    data: {},
  },
}

const renderComponent = (mocks: MockLink.MockedResponse[] = [userSearchSuccessMock]) =>
  render(
    <ToastProvider>
      <MockedProvider mocks={mocks} defaultOptions={{ mutate: { errorPolicy: 'all' } }}>
        <SpaceInviteView spaceId={spaceId} idOrName={''} />
      </MockedProvider>
    </ToastProvider>
  )

const enterSearchTerm = (input: string) => fireEvent(screen.getByTestId('space-invite-user-input'), 'onChange', input)

describe('SpaceInviteView', () => {
  it('searches for users by name', async () => {
    renderComponent()

    enterSearchTerm('foobar')

    await waitFor(() => screen.findByText('Test User'))
  })

  it('disables button to invite by email if input is not a valid email', async () => {
    renderComponent()

    const emailInviteButton = screen.getByTestId('space-invite-form-save-btn')
    expect(emailInviteButton).toBeDisabled()

    enterSearchTerm('foobar')
    expect(emailInviteButton).toBeDisabled()

    enterSearchTerm('foo@bar.com')
    expect(emailInviteButton).not.toBeDisabled()
  })

  it('invites user by email', async () => {
    renderComponent([emailInviteSuccessMock])

    enterSearchTerm('foo@bar.com')
    fireEvent.press(screen.getByTestId('space-invite-form-save-btn'))
    await waitFor(() => expect(global.mockOpenToast).toHaveBeenCalled())

    expect(global.mockOpenToast).toHaveBeenCalledWith('spaces.invite.success', HoliToastType.SUCCESS)
    // Expect input to be cleared
    expect(screen.getByTestId('space-invite-user-input').children[0]).toHaveProp('value', '')
  })

  it('displays error when invite fails', async () => {
    renderComponent([emailInviteErrorMock])

    enterSearchTerm('foo@bar.com')
    fireEvent.press(screen.getByTestId('space-invite-form-save-btn'))
    await waitFor(() => expect(global.mockOpenToast).toHaveBeenCalled())

    expect(global.mockOpenToast).toHaveBeenCalledWith('global.technicalError', HoliToastType.ERROR, {})
  })
})

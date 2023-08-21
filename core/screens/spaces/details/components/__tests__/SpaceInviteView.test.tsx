import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import SpaceInviteView from '@holi/core/screens/spaces/details/components/SpaceInviteView'
import {
  inviteToSpaceByEmailMutation,
  updateSpaceUserConnectionMutation,
} from '@holi/core/screens/spaces/details/mutations'
import { usersByNameWithSpaceConnectionQuery } from '@holi/core/screens/spaces/details/queries'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { HoliToastType, ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

const spaceId = 'space1'
const userId = 'user1'
const userSearchRequest = {
  query: usersByNameWithSpaceConnectionQuery,
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
const userSearchErrorMock = {
  request: userSearchRequest,
  error: new HoliError('Test error'),
}
const emailInviteRequest = {
  query: inviteToSpaceByEmailMutation,
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
const invitateMutationRequest = {
  query: updateSpaceUserConnectionMutation,
  variables: {
    connectAction: SpaceConnectionAction.CONNECT,
    connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
    userId,
    spaceId,
  },
}
export const inviteMutationSuccessMock = {
  request: invitateMutationRequest,
  result: {
    data: {},
  },
}

const renderComponent = (mocks: MockedResponse[] = [userSearchSuccessMock]) =>
  render(
    <ToastProvider>
      <MockedProvider mocks={mocks}>
        <SpaceInviteView spaceId={spaceId} />
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

  it('handles error during user search', async () => {
    renderComponent([userSearchErrorMock])

    enterSearchTerm('foobar')
    await waitFor(() => expect(global.mockOpenToast).toHaveBeenCalled())

    expect(global.mockOpenToast).toHaveBeenCalledWith(
      'global.technicalError',
      HoliToastType.ERROR,
      undefined,
      undefined
    )
  })

  it('clears input after user invite', async () => {
    renderComponent([userSearchSuccessMock, inviteMutationSuccessMock])

    enterSearchTerm('foobar')
    await waitFor(() => screen.findByTestId('btn-to-invite'))

    fireEvent.press(screen.getByTestId('btn-to-invite'))
    await waitFor(() => expect(global.mockOpenToast).toHaveBeenCalled())

    expect(screen.getByTestId('space-invite-user-input').children[0]).toHaveProp('value', '')
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

    expect(global.mockOpenToast).toHaveBeenCalledWith(
      'global.technicalError',
      HoliToastType.ERROR,
      undefined,
      undefined
    )
  })
})

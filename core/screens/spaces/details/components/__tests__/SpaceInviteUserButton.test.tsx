import type { MockLink } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing/react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import type { User } from '@holi/core/domain/shared/types'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import SpaceInviteUserButton from '@holi/core/screens/spaces/details/components/SpaceInviteUserButton'
import { HoliToastType, ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import {
  UpdateConnectionAction,
  SpaceUserConnectionType,
  UpdateSpaceUserConnectionDocument,
} from '@holi/api/graphql/graphql-codegen'

// prevent logging about incomplete apollo mocks,
// because we didn't flesh out the response data
global.console.error = jest.fn()
global.console.warn = jest.fn()

const spaceId = 'space1'
const user: User = {
  id: 'user1',
  identity: 'user1',
  avatarDefaultColor: '#000000',
  avatarLabel: 'TU',
  fullName: 'Test user',
  connectionStatusToSpace: [],
}
const inviteMutationRequest = {
  query: UpdateSpaceUserConnectionDocument,
  variables: {
    connectAction: UpdateConnectionAction.Connect,
    connectionType: SpaceUserConnectionType.MembershipInvitee,
    userId: user.id,
    spaceId: spaceId,
  },
}
const inviteMutationSuccessMock = {
  request: inviteMutationRequest,
  result: {
    data: {},
  },
}
const inviteMutationErrorMock = {
  request: inviteMutationRequest,
  error: new HoliError('Test error'),
}

const acceptMembershipRequest = {
  query: UpdateSpaceUserConnectionDocument,
  variables: {
    connectAction: UpdateConnectionAction.Connect,
    connectionType: SpaceUserConnectionType.Member,
    userId: user.id,
    spaceId: spaceId,
  },
}
const acceptMembershipRequestSuccessMock = {
  request: acceptMembershipRequest,
  result: {
    data: {},
  },
}
const acceptMembershipRequestErrorMock = {
  request: acceptMembershipRequest,
  error: new HoliError('Test error'),
}

const renderComponent = ({
  mocks,
  connectionStatusToSpace,
  onInviteHandled,
}: {
  mocks?: MockLink.MockedResponse[]
  connectionStatusToSpace?: SpaceUserConnectionType[]
  onInviteHandled?: () => void
} = {}) =>
  render(
    <ToastProvider>
      <MockedProvider mocks={mocks || [inviteMutationSuccessMock]} defaultOptions={{ mutate: { errorPolicy: 'all' } }}>
        <SpaceInviteUserButton
          user={{ ...user, connectionStatusToSpace: connectionStatusToSpace || [] }}
          spaceId={spaceId}
          onInviteHandled={onInviteHandled || jest.fn()}
        />
      </MockedProvider>
    </ToastProvider>
  )

describe('SpaceInviteUserButton', () => {
  it('displays nothing if the user is already a member', () => {
    const { toJSON } = renderComponent({ connectionStatusToSpace: [SpaceUserConnectionType.Member] })
    expect(toJSON()).toMatchSnapshot()
  })

  it('displays status if the user is already invited', () => {
    const { toJSON } = renderComponent({ connectionStatusToSpace: [SpaceUserConnectionType.MembershipInvitee] })
    expect(toJSON()).toMatchSnapshot()
  })

  it('displays button if the user can be invited', () => {
    const { toJSON } = renderComponent()
    expect(toJSON()).toMatchSnapshot()
  })

  it('invites user on button press', async () => {
    const onInviteHandled = jest.fn()
    renderComponent({ onInviteHandled })

    fireEvent.press(screen.getByTestId('btn-to-invite'))
    await waitFor(() => expect(global.mockOpenToast).toHaveBeenCalled())

    expect(global.mockOpenToast).toHaveBeenCalledWith('spaces.invite.user.success', HoliToastType.SUCCESS)
    expect(onInviteHandled).toHaveBeenCalled()
  })

  it('displays toast in case of error during invite', async () => {
    renderComponent({ mocks: [inviteMutationErrorMock] })

    fireEvent.press(screen.getByTestId('btn-to-invite'))
    await waitFor(() => expect(global.mockOpenToast).toHaveBeenCalled())

    expect(global.mockOpenToast).toHaveBeenCalledWith('global.technicalError', HoliToastType.ERROR, {})
  })

  it('displays button if the user already requested membership', () => {
    const { toJSON } = renderComponent({ connectionStatusToSpace: [SpaceUserConnectionType.MembershipRequestor] })
    expect(toJSON()).toMatchSnapshot()
  })

  it('accepts membership request on button press if the user already requested membership', async () => {
    const onInviteHandled = jest.fn()
    renderComponent({
      connectionStatusToSpace: [SpaceUserConnectionType.MembershipRequestor],
      mocks: [acceptMembershipRequestSuccessMock],
      onInviteHandled,
    })

    fireEvent.press(screen.getByTestId('btn-to-invite'))
    await waitFor(() => expect(global.mockOpenToast).toHaveBeenCalled())

    expect(global.mockOpenToast).toHaveBeenCalledWith('spaces.invite.user.request.accepted', HoliToastType.SUCCESS)
    expect(onInviteHandled).toHaveBeenCalled()
  })

  it('displays toast in case of error during membership update', async () => {
    renderComponent({
      mocks: [acceptMembershipRequestErrorMock],
      connectionStatusToSpace: [SpaceUserConnectionType.MembershipRequestor],
    })

    fireEvent.press(screen.getByTestId('btn-to-invite'))
    await waitFor(() => expect(global.mockOpenToast).toHaveBeenCalled())

    expect(global.mockOpenToast).toHaveBeenCalledWith('global.technicalError', HoliToastType.ERROR, {})
  })
})

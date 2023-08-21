import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import SpaceInviteUserButton from '@holi/core/screens/spaces/details/components/SpaceInviteUserButton'
import { updateSpaceUserConnectionMutation } from '@holi/core/screens/spaces/details/mutations'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliToastType, ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

const spaceId = 'space1'
const user: User = {
  id: 'user1',
  identity: 'user1',
  avatarDefaultColor: '#000000',
  avatarLabel: 'TU',
  fullName: 'Test user',
  connectionStatusToSpace: [],
}
const invitateMutationRequest = {
  query: updateSpaceUserConnectionMutation,
  variables: {
    connectAction: SpaceConnectionAction.CONNECT,
    connectionType: SpaceConnectionType.MEMBERSHIP_INVITEE,
    userId: user.id,
    spaceId: spaceId,
  },
}
const inviteMutationSuccessMock = {
  request: invitateMutationRequest,
  result: {
    data: {},
  },
}
const inviteMutationErrorMock = {
  request: invitateMutationRequest,
  error: new HoliError('Test error'),
}

const acceptMembershipRequest = {
  query: updateSpaceUserConnectionMutation,
  variables: {
    connectAction: SpaceConnectionAction.CONNECT,
    connectionType: SpaceConnectionType.MEMBER,
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
  mocks?: MockedResponse[]
  connectionStatusToSpace?: SpaceConnectionType[]
  onInviteHandled?: () => void
} = {}) =>
  render(
    <ToastProvider>
      <MockedProvider mocks={mocks || [inviteMutationSuccessMock]} addTypename={false}>
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
    const { toJSON } = renderComponent({ connectionStatusToSpace: [SpaceConnectionType.MEMBER] })
    expect(toJSON()).toMatchSnapshot()
  })

  it('displays status if the user is already invited', () => {
    const { toJSON } = renderComponent({ connectionStatusToSpace: [SpaceConnectionType.MEMBERSHIP_INVITEE] })
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

    expect(global.mockOpenToast).toHaveBeenCalledWith(
      'global.technicalError',
      HoliToastType.ERROR,
      undefined,
      undefined
    )
  })

  it('displays button if the user already requested membership', () => {
    const { toJSON } = renderComponent({ connectionStatusToSpace: [SpaceConnectionType.MEMBERSHIP_REQUESTOR] })
    expect(toJSON()).toMatchSnapshot()
  })

  it('accepts membership request on button press if the user already requested membership', async () => {
    const onInviteHandled = jest.fn()
    renderComponent({
      connectionStatusToSpace: [SpaceConnectionType.MEMBERSHIP_REQUESTOR],
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
      connectionStatusToSpace: [SpaceConnectionType.MEMBERSHIP_REQUESTOR],
    })

    fireEvent.press(screen.getByTestId('btn-to-invite'))
    await waitFor(() => expect(global.mockOpenToast).toHaveBeenCalled())

    expect(global.mockOpenToast).toHaveBeenCalledWith(
      'global.technicalError',
      HoliToastType.ERROR,
      undefined,
      undefined
    )
  })
})

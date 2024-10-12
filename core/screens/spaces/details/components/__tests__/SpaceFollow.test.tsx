import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { LoginState } from '@holi/core/auth/loginState'
import { authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceDetails from '@holi/core/screens/spaces/details/SpaceDetails'
import SpaceFollow from '@holi/core/screens/spaces/details/components/SpaceFollow'
import { updateSpaceUserConnectionMutation } from '@holi/core/screens/spaces/details/mutations'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'

jest.mock('@holi/core/navigation/hooks/useParam')

jest.mock('@holi/core/auth/loginState', () => ({
  useLoginState: (): LoginState => ({ isUnknown: false, isLoggedIn: true, isLoggedOut: false, userId: '123' }),
  setUserLoggedOut: jest.fn(),
}))

jest.mock('@holi/core/errors/hooks/useErrorHandling', () => ({
  useErrorHandling: () => ({
    displayError: jest.fn(),
  }),
}))

const authenticatedUserRequest = {
  request: {
    query: authenticatedUserV2Query,
  },
  result: {
    data: {
      authenticatedUserV2: {
        id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0',
        avatar: 'https://ik.imagekit.io/holidev/avatar/5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0_eEx60YjuIa.jpg',
        fullName: 'EE. Visited',
        firstName: 'EE.',
        lastName: 'Visited',
        aboutMe: "I'm the User that is visited in E2E tests!",
        avatarDefaultColor: '#7571EC',
        avatarLabel: 'EV',
      },
    },
  },
}

const SPACE_ID = '1'
const followSpaceMutation = {
  request: {
    query: updateSpaceUserConnectionMutation,
    variables: {
      connectAction: SpaceConnectionAction.CONNECT,
      connectionType: SpaceConnectionType.FOLLOWER,
      spaceId: SPACE_ID,
    },
  },
  newData: jest.fn(() => {
    return {
      data: {
        updateSpaceUserConnection: {
          ...space,
          id: SPACE_ID,
          connectionStatusToMyself: [SpaceConnectionType.FOLLOWER],
        },
      },
    }
  }),
}

const unfollowSpaceMutation = {
  request: {
    query: updateSpaceUserConnectionMutation,
    variables: {
      connectAction: SpaceConnectionAction.DISCONNECT,
      connectionType: SpaceConnectionType.FOLLOWER,
      spaceId: SPACE_ID,
    },
  },
  newData: jest.fn(() => {
    return {
      data: {
        updateSpaceUserConnection: {
          ...space,
          id: SPACE_ID,
          connectionStatusToMyself: [],
        },
      },
    }
  }),
}

const spaceByIdRequest = {
  request: {
    query: spaceByIdQuery,
    variables: {
      idOrName: SPACE_ID,
    },
  },
  result: {
    data: {
      spaceById: {
        ...space,
        id: SPACE_ID,
        connectionStatusToMyself: [],
        __typename: 'Space',
      },
    },
  },
}

const spaceByIdRequestFollowing = {
  ...spaceByIdRequest,
  result: {
    data: {
      spaceById: {
        ...space,
        id: SPACE_ID,
        connectionStatusToMyself: [SpaceConnectionType.FOLLOWER],
        __typename: 'Space',
      },
    },
  },
}

const MOCKS_NOT_FOLLOWING = [authenticatedUserRequest, spaceByIdRequest, followSpaceMutation]
const MOCKS_FOLLOWING = [authenticatedUserRequest, spaceByIdRequestFollowing, unfollowSpaceMutation]

// TODO: re-enable with HOLI-4898
xdescribe('Space follow button', () => {
  beforeEach(() => {
    mockParameters({ spaceIdOrName: SPACE_ID })
  })

  it('shows follow button, when not logged in', async () => {
    const aSpace = {
      ...space,
      connectionStatusToMyself: [],
    }
    render(
      <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
        <SpaceFollow space={aSpace} />
      </MockedProvider>
    )

    expect(await screen.findByText('spaces.follow.btn.follow'))
  })

  it('shows follow button, when logged in but not following', async () => {
    const aSpace = {
      ...space,
      connectionStatusToMyself: [],
    }
    render(
      <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
        <SpaceFollow space={aSpace} />
      </MockedProvider>
    )

    expect(await screen.findByText('spaces.follow.btn.follow'))
  })

  it('shows button with text "already following", when user is already following', async () => {
    const aSpace = {
      ...space,
      connectionStatusToMyself: [SpaceConnectionType.FOLLOWER],
    }
    render(
      <MockedProvider mocks={[authenticatedUserRequest]} addTypename={false}>
        <SpaceFollow space={aSpace} />
      </MockedProvider>
    )

    expect(await screen.findByText('spaces.follow.btn.following'))
  })

  it('changes the button text after clicking follow-button', async () => {
    render(
      <MockedProvider mocks={MOCKS_NOT_FOLLOWING} addTypename={false}>
        <SpaceDetails />
      </MockedProvider>
    )

    expect(await screen.findByText('spaces.follow.btn.follow'))
    await waitFor(() => expect(screen.getByTestId('follow-btn')).not.toBeDisabled(), {
      timeout: 5000,
    })
    fireEvent.press(await screen.getByTestId('follow-btn'))
    expect(await followSpaceMutation.newData).toHaveBeenCalled()
  })

  it('it shows already following button', async () => {
    render(
      <MockedProvider mocks={MOCKS_FOLLOWING} addTypename={false}>
        <SpaceDetails />
      </MockedProvider>
    )

    expect(await screen.findByText('spaces.follow.btn.following'))
    await waitFor(() => expect(screen.getByTestId('unfollow-btn')).not.toBeDisabled(), {
      timeout: 5000,
    })
    fireEvent.press(await screen.findByTestId('unfollow-btn'))
    expect(await screen.findByTestId('unfollow-confirm-confirmation-dialog'))
    fireEvent.press(await screen.findByTestId('unfollow-confirm-confirmation-confirm'))
    expect(await unfollowSpaceMutation.newData).toHaveBeenCalled()
  })
})

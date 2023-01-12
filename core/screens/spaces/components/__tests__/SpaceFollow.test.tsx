import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import SpaceDetails from '@holi/core/screens/spaces/SpaceDetails'
import SpaceFollow from '@holi/core/screens/spaces/components/SpaceFollow'
import { space } from '@holi/core/screens/spaces/components/__tests__/testData'
import { joinSpaceMutation, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'

const SPACE_ID = '1'
const followSpaceMutation = {
  request: {
    query: joinSpaceMutation,
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
    query: joinSpaceMutation,
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
      id: SPACE_ID,
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

const MOCKS_NOT_FOLLOWING = [spaceByIdRequest, followSpaceMutation]
const MOCKS_FOLLOWING = [spaceByIdRequestFollowing, unfollowSpaceMutation]

jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: () => [SPACE_ID, jest.fn()],
}))

describe('Space follow button', () => {
  it('shows follow button, when not logged in', async () => {
    const aSpace = {
      ...space,
      connectionStatusToMyself: [],
    }
    render(
      <AuthContext.Provider
        value={{
          isLoading: false,
          isLoggedIn: false,
          userId: '123',
          setUserLoggedIn: jest.fn(),
          setUserLoggedOut: jest.fn(),
        }}
      >
        <MockedProvider mocks={[]} addTypename={false}>
          <SpaceFollow space={aSpace} />
        </MockedProvider>
      </AuthContext.Provider>
    )

    expect(await screen.findByText('spaces.follow.btn.follow'))
  })

  it('shows follow button, when logged in but not following', async () => {
    const aSpace = {
      ...space,
      connectionStatusToMyself: [SpaceConnectionType.MEMBERSHIP_REQUESTOR],
    }
    render(
      <AuthContext.Provider
        value={{
          isLoading: false,
          isLoggedIn: true,
          userId: '123',
          setUserLoggedIn: jest.fn(),
          setUserLoggedOut: jest.fn(),
        }}
      >
        <MockedProvider mocks={[]} addTypename={false}>
          <SpaceFollow space={aSpace} />
        </MockedProvider>
      </AuthContext.Provider>
    )

    expect(await screen.findByText('spaces.follow.btn.follow'))
  })

  it('shows button with text "already following", when user is already following', async () => {
    const aSpace = {
      ...space,
      connectionStatusToMyself: [SpaceConnectionType.FOLLOWER],
    }
    render(
      <AuthContext.Provider
        value={{
          isLoading: false,
          isLoggedIn: true,
          userId: '123',
          setUserLoggedIn: jest.fn(),
          setUserLoggedOut: jest.fn(),
        }}
      >
        <MockedProvider mocks={[]} addTypename={false}>
          <SpaceFollow space={aSpace} />
        </MockedProvider>
      </AuthContext.Provider>
    )

    expect(await screen.findByText('spaces.follow.btn.unfollow'))
  })

  it('changes the button text after clicking follow-button', async () => {
    const aSpace = {
      ...space,
      connectionStatusToMyself: [],
    }
    render(
      <AuthContext.Provider
        value={{
          isLoading: false,
          isLoggedIn: true,
          userId: '123',
          setUserLoggedIn: jest.fn(),
          setUserLoggedOut: jest.fn(),
        }}
      >
        <MockedProvider mocks={MOCKS_NOT_FOLLOWING} addTypename={false}>
          <SpaceDetails space={aSpace} />
        </MockedProvider>
      </AuthContext.Provider>
    )

    expect(await screen.findByText('spaces.follow.btn.follow'))
    fireEvent.press(await screen.findByTestId('follow-btn'))
    expect(await followSpaceMutation.newData).toHaveBeenCalled()
  })

  it('it shows already following button', async () => {
    const aSpace = {
      ...space,
      connectionStatusToMyself: [],
    }
    render(
      <AuthContext.Provider
        value={{
          isLoading: false,
          isLoggedIn: true,
          userId: '123',
          setUserLoggedIn: jest.fn(),
          setUserLoggedOut: jest.fn(),
        }}
      >
        <MockedProvider mocks={MOCKS_FOLLOWING} addTypename={false}>
          <SpaceDetails space={aSpace} />
        </MockedProvider>
      </AuthContext.Provider>
    )

    expect(await screen.findByText('spaces.follow.btn.unfollow'))
    fireEvent.press(await screen.findByTestId('unfollow-btn'))
    expect(await screen.findByTestId('unfollow-confirm-confirmation-dialog'))
    fireEvent.press(await screen.findByTestId('unfollow-confirm-confirmation-confirm'))
    expect(await unfollowSpaceMutation.newData).toHaveBeenCalled()
  })
})

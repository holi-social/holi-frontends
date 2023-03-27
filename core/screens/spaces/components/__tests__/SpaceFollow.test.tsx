import { MockedProvider } from '@apollo/client/testing'
import { fireEvent, render, screen } from '@testing-library/react-native'
import React from 'react'

import SpaceDetails from '@holi/core/screens/spaces/SpaceDetails'
import SpaceFollow from '@holi/core/screens/spaces/components/SpaceFollow'
import { space } from '@holi/core/screens/spaces/components/__tests__/testData'
import { spaceByIdQuery, updateSpaceUserConnectionMutation } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionAction, SpaceConnectionType } from '@holi/core/screens/spaces/types'

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

const MOCKS_NOT_FOLLOWING = [spaceByIdRequest, followSpaceMutation]
const MOCKS_FOLLOWING = [spaceByIdRequestFollowing, unfollowSpaceMutation]

// Mock useAuth and useLoggedInUser hooks
interface UseAuthReturn {
  userId: string | null
  isLoggedIn: boolean
}

interface UseLoggedInUserReturn {
  name?: string
}

interface GetMockOptionsReturn {
  useAuth: UseAuthReturn
  useLoggedInUser: UseLoggedInUserReturn
}

let isLoggedIn = true

export const setIsLogin = (value: boolean) => (isLoggedIn = value)

const getMockOptions = (): GetMockOptionsReturn => {
  return isLoggedIn
    ? {
        useAuth: {
          userId: 'some_id',
          isLoggedIn: true,
        },
        useLoggedInUser: {
          name: 'user_name',
        },
      }
    : {
        useAuth: {
          userId: null,
          isLoggedIn: false,
        },
        useLoggedInUser: {},
      }
}

jest.mock('@holi/core/auth/helpers/useAuth', () => {
  return {
    useAuth: () => getMockOptions().useAuth,
  }
})

jest.mock('@holi/core/screens/userprofile/UserContextProvider', () => {
  return {
    useLoggedInUser: () => getMockOptions().useLoggedInUser,
  }
})

jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: () => [SPACE_ID, jest.fn()],
}))

describe('Space follow button', () => {
  it('shows follow button, when not logged in', async () => {
    isLoggedIn = false

    const aSpace = {
      ...space,
      connectionStatusToMyself: [],
    }
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SpaceFollow space={aSpace} />
      </MockedProvider>
    )

    expect(await screen.findByText('spaces.follow.btn.follow'))
  })

  it('shows follow button, when logged in but not following', async () => {
    isLoggedIn = true

    const aSpace = {
      ...space,
      connectionStatusToMyself: [],
    }
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SpaceFollow space={aSpace} />
      </MockedProvider>
    )

    expect(await screen.findByText('spaces.follow.btn.follow'))
  })

  it('shows button with text "already following", when user is already following', async () => {
    isLoggedIn = true

    const aSpace = {
      ...space,
      connectionStatusToMyself: [SpaceConnectionType.FOLLOWER],
    }
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <SpaceFollow space={aSpace} />
      </MockedProvider>
    )

    expect(await screen.findByText('spaces.follow.btn.unfollow'))
  })

  it('changes the button text after clicking follow-button', async () => {
    isLoggedIn = true

    render(
      <MockedProvider mocks={MOCKS_NOT_FOLLOWING} addTypename={false}>
        <SpaceDetails />
      </MockedProvider>
    )

    expect(await screen.findByText('spaces.follow.btn.follow'))
    fireEvent.press(await screen.findByTestId('follow-btn'))
    expect(await followSpaceMutation.newData).toHaveBeenCalled()
  })

  it('it shows already following button', async () => {
    isLoggedIn = true

    render(
      <MockedProvider mocks={MOCKS_FOLLOWING} addTypename={false}>
        <SpaceDetails />
      </MockedProvider>
    )

    expect(await screen.findByText('spaces.follow.btn.unfollow'))
    fireEvent.press(await screen.findByTestId('unfollow-btn'))
    expect(await screen.findByTestId('unfollow-confirm-confirmation-dialog'))
    fireEvent.press(await screen.findByTestId('unfollow-confirm-confirmation-confirm'))
    expect(await unfollowSpaceMutation.newData).toHaveBeenCalled()
  })
})

import { ApolloError } from '@apollo/client'
import { GraphQLErrors } from '@apollo/client/errors'
import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import { act } from 'react-test-renderer'

import { createCache } from '@holi/api/graphql/client'
import { userByIdQuery } from '@holi/core/domain/shared/queries'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { pagedInvites, pagedMembershipRequests, space, user } from '@holi/core/screens/spaces/__tests__/testData'
import {
  spaceInvitesQuery,
  spaceMembersQuery,
  spaceMembershipRequestsQuery,
} from '@holi/core/screens/spaces/details/queries'
import EditSpaceCollaborators from '@holi/core/screens/spaces/edit/components/EditSpaceCollaborators'
import { spaceMembershipByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'

const spaceForAdmin = {
  ...space,
  connectionStatusToMyself: [SpaceConnectionType.ADMINISTRATOR, SpaceConnectionType.MEMBER],
}
const createMocksForSpace = (spaceById = spaceForAdmin) => {
  const spaceByIdRequest = {
    request: {
      query: spaceMembershipByIdQuery,
      variables: {
        idOrName: spaceById.name,
      },
    },
    result: {
      data: {
        spaceById,
      },
    },
  }

  const spaceMembersBySpaceIdRequest = {
    request: {
      query: spaceMembersQuery,
      variables: {
        offset: 0,
        limit: 20,
        idOrName: spaceById.name,
      },
    },
    result: {
      data: {
        spaceById,
      },
    },
  }

  const spaceMembershipRequestsBySpaceIdRequest = {
    request: {
      query: spaceMembershipRequestsQuery,
      variables: {
        offset: 0,
        limit: 20,
        idOrName: spaceById.name,
      },
    },
    result: {
      data: {
        spaceById,
      },
    },
  }

  const spaceInvitesBySpaceIdRequest = {
    request: {
      query: spaceInvitesQuery,
      variables: {
        offset: 0,
        limit: 20,
        idOrName: spaceById.name,
      },
    },
    result: {
      data: {
        spaceById,
      },
    },
  }

  // Space membership requests and invites are queried twice
  return [
    spaceByIdRequest,
    spaceMembersBySpaceIdRequest,
    spaceMembershipRequestsBySpaceIdRequest,
    spaceMembershipRequestsBySpaceIdRequest,
    spaceInvitesBySpaceIdRequest,
    spaceInvitesBySpaceIdRequest,
  ]
}

jest.useFakeTimers()

jest.mock('@holi/core/navigation/hooks/useParam')

describe('EditSpaceCollaborators', () => {
  const spaceWithMembershipRequestsAndInvites = {
    ...spaceForAdmin,
    membershipRequests: pagedMembershipRequests,
    invites: pagedInvites,
  }

  it('renders correctly', async () => {
    mockParameters({ spaceIdOrName: space.name })
    render(
      <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )
    await act(async () => {
      await waitFor(() => screen.getAllByTestId('spaces-collaborators-item'))
    })
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with pending requests', async () => {
    mockParameters({ spaceIdOrName: space.name })
    render(
      <MockedProvider mocks={createMocksForSpace(spaceWithMembershipRequestsAndInvites)} cache={createCache()}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )
    await act(async () => {
      await waitFor(() => screen.getAllByTestId('spaces-collaborators-item'))
      await waitFor(() => screen.getAllByTestId('space-pending-request-item'))
    })
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('selects the pending tab if the corresponding query parameter is passed', async () => {
    mockParameters({
      spaceIdOrName: space.name,
      tab: 'pending',
    })
    render(
      <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )
    await act(async () => {
      await waitFor(() => screen.getByTestId('collaborator-tabs-button-1-active'))
    })
  })

  it('opens the modal for a user request if the corresponding parameter is passed', async () => {
    const userId = 'requesting-user-1'
    const userByIdRequest = {
      request: {
        query: userByIdQuery,
        variables: {
          userId,
        },
      },
      data: { userById: user },
    }
    const mocks = [...createMocksForSpace(spaceWithMembershipRequestsAndInvites), userByIdRequest]

    mockParameters({
      spaceIdOrName: space.name,
      tab: 'pending',
      userId: 'requesting-user-1',
    })
    render(
      <MockedProvider mocks={mocks} cache={createCache()}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )
    await act(async () => {
      await waitFor(() => screen.getAllByTestId('space-pending-request-item'))
      await waitFor(() => screen.getByTestId('space-collaborators-permissions-modal-backdrop'))
    })
  })

  it('does not open the modal for an unknown user', async () => {
    const userId = 'unknown-user'
    const userByIdRequestNotFound = {
      request: {
        query: userByIdQuery,
        variables: {
          userId,
        },
      },
      error: new ApolloError({
        graphQLErrors: [{ extensions: { code: 'NOT_FOUND' } }] as unknown as GraphQLErrors,
      }),
    }
    const mocks = [...createMocksForSpace(spaceWithMembershipRequestsAndInvites), userByIdRequestNotFound]

    mockParameters({
      spaceIdOrName: space.name,
      tab: 'pending',
      userId,
    })
    render(
      <MockedProvider mocks={mocks} cache={createCache()}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )
    await act(async () => {
      await waitFor(() => screen.getAllByTestId('space-pending-request-item'))
    })
    expect(screen.queryByTestId('space-collaborators-permissions-modal-backdrop')).toBeFalsy()
  })

  it('refreshes members and requests if the refresh parameter is passed', async () => {
    const cache = createCache()

    // Setup: send less members and membership requests after refresh
    const initialMembers = spaceWithMembershipRequestsAndInvites.members
    const newMemberCount = initialMembers.totalResults - 1
    const initialMembershipRequests = spaceWithMembershipRequestsAndInvites.membershipRequests
    const newMembershipRequestsCount = initialMembershipRequests.totalResults - 1
    const initialInvites = spaceWithMembershipRequestsAndInvites.invites
    const newInvitesCount = initialInvites.totalResults - 1
    const spaceWithLessMembersAndRequests = {
      ...spaceWithMembershipRequestsAndInvites,
      members: {
        ...initialMembers,
        totalResults: newMemberCount,
        data: initialMembers.data.slice(0, newMemberCount),
      },
      membershipRequests: {
        ...initialMembershipRequests,
        totalResults: newMembershipRequestsCount,
        data: initialMembershipRequests.data.slice(0, newMembershipRequestsCount),
      },
      invites: {
        ...initialInvites,
        totalResults: newInvitesCount,
        data: initialInvites.data.slice(0, newInvitesCount),
      },
    }
    const initialMocks = createMocksForSpace(spaceWithMembershipRequestsAndInvites)
    const refreshMocks = createMocksForSpace(spaceWithLessMembersAndRequests)
    const mocks = [...initialMocks, ...refreshMocks]
    const crateComponent = () => (
      <MockedProvider mocks={mocks} cache={cache}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )

    // Initial render
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name })
    const { rerender } = render(crateComponent())

    // Expect initial members and membership requests in the beginning
    await act(async () => {
      await waitFor(() => expect(screen.getAllByTestId('spaces-collaborators-item').length).toBe(newMemberCount + 1))
      await waitFor(() =>
        expect(screen.getAllByTestId('space-pending-request-item').length).toBe(newMembershipRequestsCount + 1)
      )
      await waitFor(() => expect(screen.getAllByTestId('space-invite-item').length).toBe(newInvitesCount + 1))
    })
    expect(mockUseUpdateParams).not.toHaveBeenCalled()

    // Pass new params and force rerender
    mockParameters({ spaceIdOrName: space.name, refresh: 'true' })
    rerender(crateComponent())

    // Expect parameter to have been reset after refresh
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenCalledWith({ refresh: undefined }))

    // Expect less members, membership requests and invites
    await act(async () => {
      await waitFor(() => expect(screen.getAllByTestId('spaces-collaborators-item').length).toBe(newMemberCount))
      await waitFor(() =>
        expect(screen.getAllByTestId('space-pending-request-item').length).toBe(newMembershipRequestsCount)
      )
      await waitFor(() => expect(screen.getAllByTestId('space-invite-item').length).toBe(newInvitesCount))
    })
  })
})

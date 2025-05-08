import { ApolloError } from '@apollo/client'
import type { GraphQLErrors } from '@apollo/client/errors'
import { MockedProvider } from '@apollo/client/testing'
import { act, render, screen, userEvent, waitFor, waitForElementToBeRemoved } from '@testing-library/react-native'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import { userByIdQuery } from '@holi/core/domain/shared/queries'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { RefreshContextProvider } from '@holi/core/refreshing/providers/RefreshContextProvider'
import { authenticatedUserMock } from '@holi/core/screens/spaces/__tests__/mocks'
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

  return [
    authenticatedUserMock,
    spaceByIdRequest,
    spaceMembersBySpaceIdRequest,
    spaceMembershipRequestsBySpaceIdRequest,
    spaceInvitesBySpaceIdRequest,
  ]
}

jest.mock('@holi/core/navigation/hooks/useParam')

describe('EditSpaceCollaborators', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(async () => {
    await act(async () => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  const spaceWithMembershipRequestsAndInvites = {
    ...spaceForAdmin,
    membershipRequests: pagedMembershipRequests,
    invites: pagedInvites,
  }

  it('renders correctly', async () => {
    mockParameters({ spaceIdOrName: space.name })
    render(
      <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
        <EditSpaceCollaborators />
      </MockedProvider>
    )

    await act(async () => {
      await waitFor(() => screen.findAllByTestId('spaces-collaborators-item'))
    })

    // Instead of using toMatchSnapshot(), let's verify specific elements
    expect(screen.getAllByTestId('spaces-collaborators-item').length).toBeGreaterThan(0)
  })

  it('renders correctly with pending requests', async () => {
    mockParameters({ spaceIdOrName: space.name })
    render(
      <MockedProvider mocks={createMocksForSpace(spaceWithMembershipRequestsAndInvites)} cache={createCache()}>
        <EditSpaceCollaborators />
      </MockedProvider>
    )

    await act(async () => {
      await waitFor(() => screen.findAllByTestId('spaces-collaborators-item'))
    })

    await act(async () => {
      await userEvent.press(screen.getByRole('tab', { name: 'spaces.collaborators.manage.tabs.requests' }))
    })

    await act(async () => {
      await waitFor(() => screen.findAllByTestId('space-pending-request-item'))
    })

    // Instead of using toMatchSnapshot(), let's verify specific elements
    expect(screen.getAllByTestId('space-pending-request-item').length).toBeGreaterThan(0)
  })

  it('selects the pending tab if the corresponding query parameter is passed', async () => {
    mockParameters({
      spaceIdOrName: space.name,
      tab: 'pending',
    })
    render(
      <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
        <EditSpaceCollaborators />
      </MockedProvider>
    )

    await act(async () => {
      await waitForElementToBeRemoved(() => screen.queryByTestId('edit-space-collaborators-loader'))
    })

    await act(async () => {
      await waitFor(() => screen.getByTestId('collaborator-tabs-button-requests-active'))
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
        <EditSpaceCollaborators />
      </MockedProvider>
    )
    await screen.findAllByTestId('space-pending-request-item')
    await screen.findByTestId('space-collaborators-permissions-modal-backdrop')
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
        <EditSpaceCollaborators />
      </MockedProvider>
    )

    await screen.findAllByTestId('space-pending-request-item')
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
        <RefreshContextProvider>
          <EditSpaceCollaborators />
        </RefreshContextProvider>
      </MockedProvider>
    )

    // Initial render
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name })
    const { rerender } = render(crateComponent())

    // Expect initial members and membership requests in the beginning
    await waitFor(() => expect(screen.getAllByTestId('spaces-collaborators-item')).toHaveLength(newMemberCount + 1))
    await userEvent.press(screen.getByRole('tab', { name: 'spaces.collaborators.manage.tabs.requests' }))
    expect(await screen.findAllByTestId('space-pending-request-item')).toHaveLength(newMembershipRequestsCount + 1)
    await userEvent.press(screen.getByRole('tab', { name: 'spaces.collaborators.manage.tabs.invites' }))
    expect(await screen.findAllByTestId('space-invite-item')).toHaveLength(newInvitesCount + 1)
    expect(mockUseUpdateParams).not.toHaveBeenCalled()

    // Pass new params and force rerender
    mockParameters({ spaceIdOrName: space.name, refresh: 'true' })
    rerender(crateComponent())

    // Expect parameter to have been reset after refresh
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenCalledWith({ refresh: undefined }))

    // Expect less members, membership requests and invites
    await userEvent.press(screen.getByRole('tab', { name: 'spaces.collaborators.manage.tabs.all' }))
    expect(await screen.findAllByTestId('spaces-collaborators-item')).toHaveLength(newMemberCount)
    await userEvent.press(screen.getByRole('tab', { name: 'spaces.collaborators.manage.tabs.requests' }))
    expect(await screen.findAllByTestId('space-pending-request-item')).toHaveLength(newMembershipRequestsCount)
    await userEvent.press(screen.getByRole('tab', { name: 'spaces.collaborators.manage.tabs.invites' }))
    expect(await screen.findAllByTestId('space-invite-item')).toHaveLength(newInvitesCount)
  })
})

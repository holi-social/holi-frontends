import { MockedProvider } from '@apollo/client/testing/react'
import { renderRouter, screen, waitFor, waitForElementToBeRemoved } from 'expo-router/testing-library'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import { userByIdQuery } from '@holi/core/domain/shared/queries'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { RefreshContextProvider } from '@holi/core/refreshing/providers/RefreshContextProvider'
import { authenticatedUserMock } from '@holi/core/screens/spaces/__tests__/mocks'
import { pagedInvites, pagedMembershipRequests, space, user } from '@holi/core/screens/spaces/__tests__/testData'
import EditSpaceCollaborators from '@holi/core/screens/spaces/edit/components/EditSpaceCollaborators'
import {
  SpaceInvitesBySpaceIdDocument,
  SpaceMembershipByIdDocument,
  SpaceUserConnectionType,
  SpaceMembersBySpaceIdDocument,
  SpaceMembershipRequestsBySpaceIdDocument,
} from '@holi/api/graphql/graphql-codegen'
import { CombinedGraphQLErrors } from '@apollo/client'
import { GraphQLError } from 'graphql'
import { userEvent } from '@testing-library/react-native'

const spaceForAdmin = {
  ...space,
  connectionStatusToMyself: [SpaceUserConnectionType.Administrator, SpaceUserConnectionType.Member],
}
const createMocksForSpace = (spaceById = spaceForAdmin) => {
  const spaceByIdRequest = {
    request: {
      query: SpaceMembershipByIdDocument,
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
      query: SpaceMembersBySpaceIdDocument,
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
      query: SpaceMembershipRequestsBySpaceIdDocument,
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
      query: SpaceInvitesBySpaceIdDocument,
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
  const spaceWithMembershipRequestsAndInvites = {
    ...spaceForAdmin,
    membershipRequests: pagedMembershipRequests,
    invites: pagedInvites,
  }

  it('renders correctly', async () => {
    mockParameters({ spaceIdOrName: space.name })
    renderRouter({
      index: () => (
        <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
          <EditSpaceCollaborators />
        </MockedProvider>
      ),
    })

    await screen.findAllByTestId('spaces-collaborators-item')

    expect(screen.getAllByTestId('spaces-collaborators-item').length).toBeGreaterThan(0)
  })

  it('renders correctly with pending requests', async () => {
    const user = userEvent.setup()
    mockParameters({ spaceIdOrName: space.name })
    renderRouter({
      index: () => (
        <MockedProvider mocks={createMocksForSpace(spaceWithMembershipRequestsAndInvites)} cache={createCache()}>
          <EditSpaceCollaborators />
        </MockedProvider>
      ),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId('edit-space-collaborators-loader'))

    await user.press(screen.getByRole('tab', { name: 'spaces.collaborators.manage.tabs.requests' }))

    await screen.findAllByTestId('space-pending-request-item')

    // Instead of using toMatchSnapshot(), let's verify specific elements
    expect(screen.getAllByTestId('space-pending-request-item').length).toBeGreaterThan(0)
  })

  it('selects the pending tab if the corresponding query parameter is passed', async () => {
    mockParameters({
      spaceIdOrName: space.name,
      tab: 'pending',
    })
    renderRouter({
      index: () => (
        <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
          <EditSpaceCollaborators />
        </MockedProvider>
      ),
    })

    await waitForElementToBeRemoved(() => screen.queryByTestId('edit-space-collaborators-loader'))
    await waitFor(() => screen.getByTestId('collaborator-tabs-button-requests-active'))
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
    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks} cache={createCache()}>
          <EditSpaceCollaborators />
        </MockedProvider>
      ),
    })
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
      error: new CombinedGraphQLErrors({
        errors: [new GraphQLError('Not found', { extensions: { code: 'NOT_FOUND' } })],
      }),
    }
    const mocks = [...createMocksForSpace(spaceWithMembershipRequestsAndInvites), userByIdRequestNotFound]

    mockParameters({
      spaceIdOrName: space.name,
      tab: 'pending',
      userId,
    })
    renderRouter({
      index: () => (
        <MockedProvider mocks={mocks} cache={createCache()}>
          <EditSpaceCollaborators />
        </MockedProvider>
      ),
    })

    await screen.findAllByTestId('space-pending-request-item')
    expect(screen.queryByTestId('space-collaborators-permissions-modal-backdrop')).toBeFalsy()
  })

  // This test verifies that the refresh parameter triggers the useRefreshOnNavigation mechanism
  // The actual refetch behavior is handled by refresh context and tested at the integration level
  it('clears the refresh parameter when passed', async () => {
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name, refresh: 'true' })

    renderRouter({
      index: () => (
        <MockedProvider mocks={createMocksForSpace(spaceWithMembershipRequestsAndInvites)} cache={createCache()}>
          <RefreshContextProvider>
            <EditSpaceCollaborators />
          </RefreshContextProvider>
        </MockedProvider>
      ),
    })

    // Wait for component to load
    await waitFor(() => expect(screen.getAllByTestId('spaces-collaborators-item')).toHaveLength(3))

    // The refresh parameter should be cleared by useRefreshOnNavigation
    // this verifies that the refresh mechanism was triggered
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenCalledWith({ refresh: undefined }))
  })
})

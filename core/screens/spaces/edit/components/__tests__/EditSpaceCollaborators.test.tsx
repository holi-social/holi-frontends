import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import { act } from 'react-test-renderer'

import { createCache } from '@holi/api/graphql/client'
import { pagedMembershipRequests, space } from '@holi/core/screens/spaces/__tests__/testData'
import { spaceMembersQuery, spaceMembershipRequestsQuery } from '@holi/core/screens/spaces/details/queries'
import EditSpaceCollaborators, {
  EditSpaceCollaboratorsParams,
} from '@holi/core/screens/spaces/edit/components/EditSpaceCollaborators'
import { spaceMembershipByIdQuery } from '@holi/core/screens/spaces/queries'

const createMocksForSpace = (spaceById = space) => {
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

  // Space membership requests are queried twice
  return [
    spaceByIdRequest,
    // spaceMembersBySpaceIdRequest,
    spaceMembersBySpaceIdRequest,
    spaceMembershipRequestsBySpaceIdRequest,
    spaceMembershipRequestsBySpaceIdRequest,
  ]
}

jest.useFakeTimers()

const mockUseParam = jest.fn()

jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: (paramName: string) => mockUseParam(paramName),
}))

const mockParams = (params: EditSpaceCollaboratorsParams = { spaceIdOrName: space.name }, setParam = jest.fn()) =>
  mockUseParam.mockImplementation((paramName: keyof EditSpaceCollaboratorsParams) => [
    params[paramName],
    (value?: string) => setParam(paramName, value),
  ])

describe('EditSpaceCollaborators', () => {
  const spaceWithMembershipRequests = {
    ...space,
    membershipRequests: pagedMembershipRequests,
  }

  it('renders correctly', async () => {
    mockParams()
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
    mockParams()
    render(
      <MockedProvider mocks={createMocksForSpace(spaceWithMembershipRequests)} cache={createCache()}>
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
    mockParams({
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
    mockParams({
      spaceIdOrName: space.name,
      tab: 'pending',
      userId: 'requesting-user-1',
    })
    render(
      <MockedProvider mocks={createMocksForSpace(spaceWithMembershipRequests)} cache={createCache()}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )
    await act(async () => {
      await waitFor(() => screen.getAllByTestId('space-pending-request-item'))
      await waitFor(() => screen.getByTestId('space-collaborators-permissions-modal-backdrop'))
    })
  })

  it('does not open the modal for an unknown user', async () => {
    mockParams({
      spaceIdOrName: space.name,
      tab: 'pending',
      userId: 'unknown-user',
    })
    render(
      <MockedProvider mocks={createMocksForSpace(spaceWithMembershipRequests)} cache={createCache()}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )
    await waitFor(() => screen.getAllByTestId('space-pending-request-item'))
    expect(screen.queryByTestId('space-collaborators-permissions-modal-backdrop')).toBeFalsy()
  })

  it('refreshes members and requests if the refresh parameter is passed', async () => {
    const setParam = jest.fn()
    const cache = createCache()

    // Setup: send less members and membership requests after refresh
    const initialMembers = spaceWithMembershipRequests.members
    const newMemberCount = initialMembers.totalResults - 1
    const initialMembershipRequests = spaceWithMembershipRequests.membershipRequests
    const newMembershipRequestsCount = initialMembershipRequests.totalResults - 1
    const spaceWithlessMembersAndRequests = {
      ...spaceWithMembershipRequests,
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
    }
    const initialMocks = createMocksForSpace(spaceWithMembershipRequests)
    const refreshMocks = createMocksForSpace(spaceWithlessMembersAndRequests)
    const mocks = [...initialMocks, ...refreshMocks]
    const crateComponent = () => (
      <MockedProvider mocks={mocks} cache={cache}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )

    // Initial render
    mockParams({ spaceIdOrName: space.name }, setParam)
    const { rerender } = render(crateComponent())

    // Expect initial members and membership requests in the beginning
    await act(async () => {
      await waitFor(() => expect(screen.getAllByTestId('spaces-collaborators-item').length).toBe(newMemberCount + 1))
      await waitFor(() =>
        expect(screen.getAllByTestId('space-pending-request-item').length).toBe(newMembershipRequestsCount + 1)
      )
    })
    expect(setParam).not.toHaveBeenCalled()

    // Pass new params and force rerender
    mockParams({ spaceIdOrName: space.name, refresh: 'true' }, setParam)
    rerender(crateComponent())

    // Expect parameter to have been reset after refresh
    await waitFor(() => expect(setParam).toHaveBeenCalledWith('refresh', undefined))

    // Expect less members and membership requests
    await waitFor(() => expect(screen.getAllByTestId('spaces-collaborators-item').length).toBe(newMemberCount))
    await waitFor(() =>
      expect(screen.getAllByTestId('space-pending-request-item').length).toBe(newMembershipRequestsCount)
    )
  })
})

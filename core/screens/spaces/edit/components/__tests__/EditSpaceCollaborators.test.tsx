import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import { pagedMembershipRequests, space } from '@holi/core/screens/spaces/__tests__/testData'
import { spaceMembersQuery, spaceMembershipRequestsQuery } from '@holi/core/screens/spaces/details/queries'
import EditSpaceCollaborators, {
  EditSpaceCollaboratorsParams,
} from '@holi/core/screens/spaces/edit/components/EditSpaceCollaborators'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'

const createMocksForSpace = (spaceById = space) => {
  const spaceByIdRequest = {
    request: {
      query: spaceByIdQuery,
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

  // Space members and membership requests are queried twice
  return [
    spaceByIdRequest,
    spaceMembersBySpaceIdRequest,
    spaceMembersBySpaceIdRequest,
    spaceMembershipRequestsBySpaceIdRequest,
    spaceMembershipRequestsBySpaceIdRequest,
  ]
}

const mockUseParam = jest.fn()

jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: (paramName: string) => mockUseParam(paramName),
}))

const mockParams = (params: EditSpaceCollaboratorsParams = { spaceIdOrName: space.name }) =>
  mockUseParam.mockImplementation((paramName: keyof EditSpaceCollaboratorsParams) => [params[paramName]])

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
    await waitFor(() => screen.getAllByTestId('spaces-collaborators-item'))
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with pending requests', async () => {
    mockParams()
    render(
      <MockedProvider mocks={createMocksForSpace(spaceWithMembershipRequests)} cache={createCache()}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )
    await waitFor(() => screen.getAllByTestId('spaces-collaborators-item'))
    await waitFor(() => screen.getAllByTestId('space-pending-request-item'))
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
    await waitFor(() => screen.getByTestId('collaborator-tabs-button-1-active'))
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
    await waitFor(() => screen.getAllByTestId('space-pending-request-item'))
    await waitFor(() => screen.getByTestId('space-collaborators-permissions-modal-backdrop'))
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
})

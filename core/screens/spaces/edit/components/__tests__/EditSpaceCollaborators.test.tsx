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

  return [spaceByIdRequest, spaceMembersBySpaceIdRequest, spaceMembershipRequestsBySpaceIdRequest]
}

const mockUseParam = jest.fn()

jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: (paramName: string) => mockUseParam(paramName),
}))

const mockParams = (params: EditSpaceCollaboratorsParams = { spaceIdOrName: space.name }) =>
  mockUseParam.mockImplementation((paramName: keyof EditSpaceCollaboratorsParams) => [params[paramName]])

describe('EditSpaceCollaborators', () => {
  it('renders correctly', async () => {
    mockParams()
    render(
      <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )
    await waitFor(() => screen.getByTestId('collaborator-tabs'))
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with pending requests', async () => {
    mockParams()
    const spaceWithMembershipRequests = {
      ...space,
      membershipRequests: pagedMembershipRequests,
    }
    render(
      <MockedProvider mocks={createMocksForSpace(spaceWithMembershipRequests)} cache={createCache()}>
        <EditSpaceCollaborators spaceIdOrName={space.name} />
      </MockedProvider>
    )
    await waitFor(() => screen.getAllByTestId('space-pending-request-item'))
    expect(screen.toJSON()).toMatchSnapshot()
  })
})

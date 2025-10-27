import { MockedProvider } from '@apollo/client/testing'
import { act, renderRouter, screen, waitFor } from 'expo-router/testing-library'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import type { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { APPOINTMENT_STATUS_TYPE, appointmentsBySpaceIdQuery } from '@holi/core/screens/appointments/queries'
import { createSpaceList, space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceDetails from '@holi/core/screens/spaces/details/SpaceDetails'
import {
  SpaceByIdDocument,
  SpacePostsBySpaceIdDocument,
  SpaceUserConnectionType,
} from '@holi/api/graphql/graphql-codegen'
import { authenticatedUserMock } from '@holi/core/screens/spaces/__tests__/mocks'

const createMocksForSpace = (spaceById = space) => {
  const spaceByIdRequest = {
    request: {
      query: SpaceByIdDocument,
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

  const spacePostsRequest = {
    request: {
      query: SpacePostsBySpaceIdDocument,
      variables: {
        offset: 0,
        limit: 10,
        idOrName: spaceById.name,
        visibility: 'ALL',
      },
    },
    result: {
      data: {
        spaceById,
      },
    },
  }

  const appointmentsRequest = {
    request: {
      query: appointmentsBySpaceIdQuery,
      variables: {
        offset: 0,
        limit: 10,
        spaceId: spaceById.id,
        statusType: APPOINTMENT_STATUS_TYPE.UPCOMING,
      },
    },
    result: {
      data: {
        appointments: {
          totalResults: 0,
          data: [],
        },
      },
    },
  }

  return [authenticatedUserMock, spaceByIdRequest, spacePostsRequest, appointmentsRequest]
}

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: FeatureFlagKey) => mockUseFeatureFlag(flag),
}))

jest.useFakeTimers()

jest.mock('@holi/core/navigation/hooks/useParam')

describe('SpaceDetails', () => {
  const spaceForMember = {
    ...space,
    connectionStatusToMyself: [SpaceUserConnectionType.Member],
    parentSpace: createSpaceList()[0],
  }

  beforeEach(() => {
    // jest.useFakeTimers()
    mockUseFeatureFlag.mockReturnValue(['on', undefined])
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('selects info tab for non-members', async () => {
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name })
    renderRouter({
      index: () => (
        <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
          <SpaceDetails spaceIdOrName={space.name} />
        </MockedProvider>
      ),
    })

    await screen.queryByText(space.title)
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'info' }))
  })

  it('selects involvement tab for members if involvement content exists', async () => {
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name })
    renderRouter({
      index: () => (
        <MockedProvider mocks={createMocksForSpace(spaceForMember)} cache={createCache()}>
          <SpaceDetails spaceIdOrName={space.name} />
        </MockedProvider>
      ),
    })

    await screen.queryByText(space.title)
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenLastCalledWith({ tab: 'involvement' }))
  })

  it('selects updates tab for members if no involvement content exists', async () => {
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name })
    const spaceForMemberWithoutInvolvement = {
      ...spaceForMember,
      tasks: [],
    }
    renderRouter({
      index: () => (
        <MockedProvider mocks={createMocksForSpace(spaceForMemberWithoutInvolvement)} cache={createCache()}>
          <SpaceDetails spaceIdOrName={space.name} />
        </MockedProvider>
      ),
    })

    await screen.queryByText(space.title)
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'updates' }))
  })

  // This test verifies that the useRefreshOnNavigation hook properly clears the refresh parameter
  // Testing the actual refetch behavior requires simulating navigation state changes which is
  // difficult with the current expo-router testing utilities
  it('clears the refresh parameter when passed', async () => {
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name, refresh: 'true' })

    renderRouter({
      index: () => (
        <MockedProvider mocks={createMocksForSpace(space)}>
          <SpaceDetails />
        </MockedProvider>
      ),
    })

    // The refresh parameter should be cleared by useRefreshOnNavigation
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenCalledWith({ refresh: undefined }))
  })
})

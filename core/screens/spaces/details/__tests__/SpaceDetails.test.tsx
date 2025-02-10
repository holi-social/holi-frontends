import { MockedProvider } from '@apollo/client/testing'
import { act, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import type { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { APPOINTMENT_STATUS_TYPE, appointmentsBySpaceIdQuery } from '@holi/core/screens/appointments/queries'
import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceDetails from '@holi/core/screens/spaces/details/SpaceDetails'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'

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

  const spacePostsRequest = {
    request: {
      query: spacePostsQuery,
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

  return [spaceByIdRequest, spacePostsRequest, appointmentsRequest]
}

const mockUseFeatureFlag = jest.fn()
jest.mock('@holi/core/featureFlags/hooks/useFeatureFlag', () => ({
  useFeatureFlag: (flag: FeatureFlagKey) => mockUseFeatureFlag(flag),
}))

jest.mock('@holi/core/navigation/hooks/useParam')

describe('SpaceDetails', () => {
  const spaceForMember = {
    ...space,
    connectionStatusToMyself: [SpaceConnectionType.MEMBER],
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseFeatureFlag.mockReturnValue(['on', undefined])
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('selects info tab for non-members', async () => {
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name })
    render(
      <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
        <SpaceDetails spaceIdOrName={space.name} />
      </MockedProvider>
    )

    await screen.queryByText(space.title)
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'info' }))
  })

  it('selects involvement tab for members if involvement content exists', async () => {
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name })
    render(
      <MockedProvider mocks={createMocksForSpace(spaceForMember)} cache={createCache()}>
        <SpaceDetails spaceIdOrName={space.name} />
      </MockedProvider>
    )

    await screen.queryByText(space.title)
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'involvement' }))
  })

  it('selects updates tab for members if no involvement content exists', async () => {
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name })
    const spaceForMemberWithoutInvolvement = {
      ...spaceForMember,
      tasks: [],
    }
    render(
      <MockedProvider mocks={createMocksForSpace(spaceForMemberWithoutInvolvement)} cache={createCache()}>
        <SpaceDetails spaceIdOrName={space.name} />
      </MockedProvider>
    )

    await screen.queryByText(space.title)
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'updates' }))
  })

  // FIXME: it seems the mockUseUpdateParams does not trigger a rerender anymore
  it.skip('refreshes the space if the refresh parameter is passed', async () => {
    const cache = createCache()

    // Setup: send a different title after refresh
    const newTitle = 'New title'
    const updatedSpace = {
      ...space,
      title: newTitle,
    }
    const mocks = [...createMocksForSpace(space), ...createMocksForSpace(updatedSpace)]
    const crateComponent = () => (
      <MockedProvider mocks={mocks} cache={cache}>
        <SpaceDetails spaceIdOrName={space.name} />
      </MockedProvider>
    )

    // Initial render
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name })
    const { rerender } = render(crateComponent())

    // Expect initial title
    await screen.queryByText(space.title)

    expect(mockUseUpdateParams).toHaveBeenCalledTimes(1)
    expect(mockUseUpdateParams).toHaveBeenCalledWith({
      tab: 'info',
    })

    // Pass new params and force rerender
    mockParameters({ spaceIdOrName: space.name, refresh: true })
    rerender(crateComponent())

    // Expect parameter to have been reset after refresh
    expect(mockUseUpdateParams).toHaveBeenCalledTimes(2)
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenCalledWith({ refresh: undefined }))

    // Expect a new title
    expect(await screen.queryByText(newTitle)).toBeOnTheScreen()
  })
})

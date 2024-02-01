import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import { act } from 'react-test-renderer'

import { createCache } from '@holi/api/graphql/client'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { FeatureToggleStatus, featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'
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

  const featureTogglesRequest = {
    request: {
      query: featureTogglesQuery,
    },
    result: {
      data: {
        featureToggles: [
          {
            name: FeatureToggleName.STORAGE,
            status: FeatureToggleStatus.PRODUCTION,
            __typename: 'FeatureToggle',
          },
        ],
      },
    },
  }

  return [spaceByIdRequest, spacePostsRequest, featureTogglesRequest]
}

jest.useFakeTimers()

jest.mock('@holi/core/navigation/hooks/useParam')

describe('SpaceDetails', () => {
  const spaceForMember = {
    ...space,
    connectionStatusToMyself: [SpaceConnectionType.MEMBER],
  }

  it('renders correctly', async () => {
    mockParameters({ spaceIdOrName: space.name })
    render(
      <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
        <SpaceDetails spaceIdOrName={space.name} />
      </MockedProvider>
    )

    await act(async () => {
      jest.runAllTimers()
      await waitFor(() => screen.getByText(space.title))
    })

    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('selects info tab for non-members', async () => {
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name })
    render(
      <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
        <SpaceDetails spaceIdOrName={space.name} />
      </MockedProvider>
    )

    await act(async () => {
      jest.runAllTimers()
      await waitFor(() => screen.getByText(space.title))
    })

    expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'info' })
  })

  it('selects involvement tab for members if involvement content exists', async () => {
    const { mockUseUpdateParams } = mockParameters({ spaceIdOrName: space.name })
    render(
      <MockedProvider mocks={createMocksForSpace(spaceForMember)} cache={createCache()}>
        <SpaceDetails spaceIdOrName={space.name} />
      </MockedProvider>
    )

    await act(async () => {
      jest.runAllTimers()
      await waitFor(() => screen.getByText(space.title))
    })

    expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'involvement' })
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

    await act(async () => {
      jest.runAllTimers()
      await waitFor(() => screen.getByText(space.title))
    })

    expect(mockUseUpdateParams).toHaveBeenCalledWith({ tab: 'updates' })
  })

  it('refreshes the space if the refresh parameter is passed', async () => {
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
    await act(async () => {
      await waitFor(() => screen.getByText(space.title))
    })
    expect(mockUseUpdateParams).toHaveBeenCalledTimes(1)
    expect(mockUseUpdateParams).toHaveBeenCalledWith({
      tab: 'info',
    })

    // Pass new params and force rerender
    mockParameters({ spaceIdOrName: space.name, refresh: true })
    rerender(crateComponent())

    // Expect parameter to have been reset after refresh
    await waitFor(() => expect(mockUseUpdateParams).toHaveBeenCalledWith({ refresh: undefined }))

    // Expect a new title
    await act(async () => {
      await waitFor(() => screen.getByText(newTitle))
    })
  })
})

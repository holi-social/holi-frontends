import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react-native'
import React, { useState } from 'react'
import { act } from 'react-test-renderer'

import { createCache } from '@holi/api/graphql/client'
import { FeatureToggleName } from '@holi/core/helpers/useFeatureToggle'
import { FeatureToggleStatus, featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'
import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceDetails, { SpaceDetailsParams } from '@holi/core/screens/spaces/details/SpaceDetails'
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

const mockUseParam = jest.fn()

jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: (paramName: string) => mockUseParam(paramName),
}))

const mockParams = (params: SpaceDetailsParams = { spaceIdOrName: space.name }) => {
  const setParamMocks = {
    tab: jest.fn(),
    refresh: jest.fn(),
    spaceIdOrName: jest.fn(),
  }
  mockUseParam.mockImplementation((paramName: keyof SpaceDetailsParams) => {
    const [param, setParam] = useState(params[paramName])
    return [param, setParamMocks[paramName].mockImplementation(setParam)]
  })
  return setParamMocks
}

describe('SpaceDetails', () => {
  const spaceForMember = {
    ...space,
    connectionStatusToMyself: [SpaceConnectionType.MEMBER],
  }

  it('renders correctly', async () => {
    mockParams()
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
    const setParamMocks = mockParams()
    render(
      <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
        <SpaceDetails spaceIdOrName={space.name} />
      </MockedProvider>
    )

    await act(async () => {
      jest.runAllTimers()
      await waitFor(() => screen.getByText(space.title))
    })

    expect(setParamMocks['tab']).toHaveBeenCalledWith('info')
  })

  it('selects involvement tab for members if involvement content exists', async () => {
    const setParamMocks = mockParams()
    render(
      <MockedProvider mocks={createMocksForSpace(spaceForMember)} cache={createCache()}>
        <SpaceDetails spaceIdOrName={space.name} />
      </MockedProvider>
    )

    await act(async () => {
      jest.runAllTimers()
      await waitFor(() => screen.getByText(space.title))
    })

    expect(setParamMocks['tab']).toHaveBeenCalledWith('involvement')
  })

  it('selects updates tab for members if no involvement content exists', async () => {
    const setParamMocks = mockParams()
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

    expect(setParamMocks['tab']).toHaveBeenCalledWith('updates')
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
    const setParamMocks = mockParams({ spaceIdOrName: space.name })
    const { rerender } = render(crateComponent())

    // Expect initial title
    await act(async () => {
      await waitFor(() => screen.getByText(space.title))
    })
    expect(setParamMocks['refresh']).not.toHaveBeenCalled()

    // Pass new params and force rerender
    act(() => setParamMocks['refresh']('true'))
    rerender(crateComponent())

    // Expect parameter to have been reset after refresh
    await waitFor(() => expect(setParamMocks['refresh']).toHaveBeenCalledWith(undefined))

    // Expect a new title
    await act(async () => {
      await waitFor(() => screen.getByText(newTitle))
    })
  })
})

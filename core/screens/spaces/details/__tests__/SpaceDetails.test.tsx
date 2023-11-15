import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'
import { act } from 'react-test-renderer'

import { createCache } from '@holi/api/graphql/client'
import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceDetails, { SpaceDetailsParams } from '@holi/core/screens/spaces/details/SpaceDetails'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
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

  return [spaceByIdRequest, spacePostsRequest]
}

jest.useFakeTimers()

const mockUseParam = jest.fn()

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)

jest.mock('@holi/core/navigation/hooks/useParam', () => () => ({
  useParam: (paramName: string) => mockUseParam(paramName),
}))

const mockParams = (params: SpaceDetailsParams = { spaceIdOrName: space.name }, setParam = jest.fn()) =>
  mockUseParam.mockImplementation((paramName: keyof SpaceDetailsParams) => [
    params[paramName],
    (value?: string) => setParam(paramName, value),
  ])

describe('SpaceDetails', () => {
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

  it('refreshes the space if the refresh parameter is passed', async () => {
    const setParam = jest.fn()
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
    mockParams({ spaceIdOrName: space.name }, setParam)
    const { rerender } = render(crateComponent())

    // Expect initial title
    await act(async () => {
      await waitFor(() => screen.getByText(space.title))
    })
    expect(setParam).not.toHaveBeenCalled()

    // Pass new params and force rerender
    mockParams({ spaceIdOrName: space.name, refresh: 'true' }, setParam)
    rerender(crateComponent())

    // Expect parameter to have been reset after refresh
    await waitFor(() => expect(setParam).toHaveBeenCalledWith('refresh', undefined))

    // Expect a new title
    await act(async () => {
      await waitFor(() => screen.getByText(newTitle))
    })
  })
})

import { MockedProvider } from '@apollo/client/testing'
import { cleanup, render } from '@testing-library/react-native'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceDetailView from '@holi/core/screens/spaces/details/components/SpaceDetailView'
import { spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { spacePostsQuery } from '@holi/core/screens/spaces/updates/queries'

jest.useFakeTimers()

const spaceByIdRequest = {
  request: {
    query: spaceByIdQuery,
    variables: {
      idOrName: space.name,
    },
  },
  result: {
    data: {
      spaceById: space,
    },
  },
}

const spacePostsRequest = {
  request: {
    query: spacePostsQuery,
    variables: {
      offset: 0,
      limit: 10,
      idOrName: space.name,
      visibility: 'ALL',
    },
  },
  result: {
    data: {
      spaceById: space,
    },
  },
}

const mocks = [spaceByIdRequest, spacePostsRequest]

describe('SpaceDetailView', () => {
  it('renders correctly', () => {
    const { getByText, getAllByText } = render(
      <MockedProvider mocks={mocks} cache={createCache()}>
        <SpaceDetailView space={space} onChangeTabIndex={() => null} />
      </MockedProvider>
    )

    expect(getByText('Space title')).toBeDefined()
    expect(getByText('Space description')).toBeDefined()
    // Only two tasks are displayed, but more are available
    expect(getAllByText('Task title').length).toBe(2)
    expect(getByText('spaces.global.seeAllButton.label')).toBeDefined()

    cleanup()
  })
})

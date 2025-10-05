import { MockedProvider } from '@apollo/client/testing'
import { act, renderRouter, screen, userEvent } from 'expo-router/testing-library'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import { APPOINTMENT_STATUS_TYPE, appointmentsBySpaceIdQuery } from '@holi/core/screens/appointments/queries'
import { authenticatedUserMock } from '@holi/core/screens/spaces/__tests__/mocks'
import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceDetailView from '@holi/core/screens/spaces/details/components/SpaceDetailView'
import { SpaceByIdDocument, SpacePostsBySpaceIdDocument } from '@holi/api/graphql/graphql-codegen'

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

const SpaceDetailWrapper = () => {
  const [activeTab, setActiveTab] = React.useState('info')
  return <SpaceDetailView space={space} activeTab={activeTab} onTabChange={setActiveTab} />
}

describe('SpaceDetailView', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('renders correctly', async () => {
    renderRouter({
      index: () => (
        <MockedProvider mocks={createMocksForSpace()} cache={createCache()}>
          <SpaceDetailWrapper />
        </MockedProvider>
      ),
    })

    expect(screen.getByText('Space title')).toBeDefined()
    expect(screen.getByText('Space description')).toBeDefined()

    await userEvent.press(screen.getByRole('tab', { name: 'spaces.tab.action' }))
    // Only two tasks are displayed, but more are available
    expect(await screen.findAllByText('Task title')).toHaveLength(2)
    expect(await screen.findByText('spaces.global.seeAllButton.label')).toBeDefined()
  })
})

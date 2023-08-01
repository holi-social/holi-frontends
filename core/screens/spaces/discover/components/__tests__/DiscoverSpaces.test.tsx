import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import {
  authenticatedUserMock,
  defaultLocationDetailsMock,
  mySpacesWithEmptyResultMock,
  sdgsMock,
  skillsMock,
  topicsMock,
} from '@holi/core/screens/spaces/__tests__/mocks'
import { authenticatedUser, spacesGroups } from '@holi/core/screens/spaces/__tests__/testData'
import DiscoverSpaces from '@holi/core/screens/spaces/discover/components/DiscoverSpaces'
import { discoverSpacesQuery } from '@holi/core/screens/spaces/discover/queries'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

const discoverSpacesUserSpecificMock = {
  request: {
    query: discoverSpacesQuery,
    variables: {
      topicIds: [],
      skillIds: [],
      limit: 10,
    },
  },
  result: {
    data: {
      discoverSpaces: [],
    },
  },
}

const discoverSpacesDefaultMock = {
  request: {
    query: discoverSpacesQuery,
    variables: {
      topicIds: ['ANIMAL_WELFARE'],
      geolocation: {},
      limit: 10,
    },
  },
  result: {
    data: {
      discoverSpaces: spacesGroups,
    },
  },
}

const BASE_MOCKS = [authenticatedUserMock, mySpacesWithEmptyResultMock, topicsMock, skillsMock, sdgsMock]
const MOCKS = [...BASE_MOCKS, defaultLocationDetailsMock, discoverSpacesUserSpecificMock, discoverSpacesDefaultMock]

// note: this test has been slimmed down since the component was refactored
//       feel free to add more tests again (see history)
describe('DiscoverSpaces', () => {
  const renderDiscoverSpaces = (mocks: MockedResponse[]) =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ToastProvider>
          <SpaceTermContextProvider>
            <DiscoverSpaces user={authenticatedUser} />
          </SpaceTermContextProvider>
        </ToastProvider>
      </MockedProvider>
    )

  it('displays loading screen while loading', async () => {
    renderDiscoverSpaces(MOCKS)

    expect(await screen.findByTestId('spaces-group-slider-skeletons'))
  })

  it('displays discover-spaces-view', async () => {
    renderDiscoverSpaces(MOCKS)

    expect(await screen.findByTestId('discover-spaces-header'))
  })
})

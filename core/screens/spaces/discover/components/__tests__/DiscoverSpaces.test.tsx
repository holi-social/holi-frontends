import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { cleanup, renderRouter, screen } from 'expo-router/testing-library'
import React from 'react'

import {
  authenticatedUserMock,
  defaultLocationDetailsMock,
  mySpacesWithEmptyResultMock,
} from '@holi/core/screens/spaces/__tests__/mocks'
import { spacesGroups } from '@holi/core/screens/spaces/__tests__/testData'
import DiscoverSpaces from '@holi/core/screens/spaces/discover/components/DiscoverSpaces'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import { DiscoverSpacesDefaultTopicsDocument, DiscoverSpacesDocument } from '@holi/api/graphql/graphql-codegen'

const discoverSpacesUserSpecificMock = {
  request: {
    query: DiscoverSpacesDocument,
    variables: {
      topicsV2: [],
      skillsV2: [],
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
    query: DiscoverSpacesDocument,
    variables: {
      topicsV2: ['animal-welfare'],
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

const defaultTopicsMock = {
  request: {
    query: DiscoverSpacesDefaultTopicsDocument,
  },
  result: {
    data: {
      discoverSpacesDefaultTopicsV2: ['animal-welfare', 'housing'],
    },
  },
}
const BASE_MOCKS = [authenticatedUserMock, mySpacesWithEmptyResultMock, defaultTopicsMock]
const MOCKS = [...BASE_MOCKS, defaultLocationDetailsMock, discoverSpacesUserSpecificMock, discoverSpacesDefaultMock]

// note: this test has been slimmed down since the component was refactored
//       feel free to add more tests again (see history)

const renderDiscoverSpaces = (mocks: MockedResponse[]) =>
  renderRouter({
    index: () => (
      <MockedProvider mocks={mocks} addTypename={false}>
        <ToastProvider>
          <DiscoverSpaces />
        </ToastProvider>
      </MockedProvider>
    ),
  })

describe('DiscoverSpaces', () => {
  it('displays loading screen while loading', async () => {
    renderDiscoverSpaces(MOCKS)

    expect(await screen.findByTestId('spaces-group-slider-skeletons')).toBeOnTheScreen()
  })

  // solve act() wrap warning
  // https://github.com/testing-library/react-testing-library/issues/1216#issuecomment-1595684566
  afterEach(cleanup)
})

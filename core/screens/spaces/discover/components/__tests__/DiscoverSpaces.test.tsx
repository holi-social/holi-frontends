import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { geoPlaceDetailsQuery } from '@holi/core/location/queries'
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
import { DEFAULT_LOCATION_ID } from '@holi/core/screens/spaces/helpers/defaultFilters'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { discoverSpacesQuery } from '@holi/core/screens/spaces/queries'
import { HoliToastType, ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

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

const discoverSpacesUserSpecificErrorMock = {
  request: {
    query: discoverSpacesQuery,
    variables: {
      topicIds: [],
      skillIds: [],
      limit: 10,
    },
  },
  error: new Error('Test error'),
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

const discoverSpacesDefaultErrorMock = {
  request: {
    query: discoverSpacesQuery,
    variables: {
      topicIds: ['ANIMAL_WELFARE'],
      geolocation: {},
      limit: 10,
    },
  },
  error: new Error('Test error'),
}

export const defaultLocationDetailsErrorMock = {
  request: {
    query: geoPlaceDetailsQuery,
    variables: {
      id: DEFAULT_LOCATION_ID,
    },
  },
  error: new Error('Test error'),
}

const BASE_MOCKS = [authenticatedUserMock, mySpacesWithEmptyResultMock, topicsMock, skillsMock, sdgsMock]
const MOCKS = [...BASE_MOCKS, defaultLocationDetailsMock, discoverSpacesUserSpecificMock, discoverSpacesDefaultMock]

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

    expect(await screen.findByText('spaces.spaceListing.loading'))
  })

  it('displays error toast if loading user specific spaces failed', async () => {
    renderDiscoverSpaces([
      ...BASE_MOCKS,
      discoverSpacesUserSpecificErrorMock,
      discoverSpacesDefaultMock,
      defaultLocationDetailsMock,
    ])

    await waitFor(() =>
      expect(global.mockOpenToast).toHaveBeenCalledWith(
        'spaces.spaceListing.error',
        HoliToastType.ERROR,
        undefined,
        undefined
      )
    )
  })

  it('displays error toast if loading default spaces failed', async () => {
    renderDiscoverSpaces([
      ...BASE_MOCKS,
      discoverSpacesUserSpecificMock,
      discoverSpacesDefaultErrorMock,
      defaultLocationDetailsMock,
    ])

    await waitFor(() =>
      expect(global.mockOpenToast).toHaveBeenCalledWith(
        'spaces.spaceListing.error',
        HoliToastType.ERROR,
        undefined,
        undefined
      )
    )
  })

  it('displays error toast if loading default geolocation failed', async () => {
    renderDiscoverSpaces([
      ...BASE_MOCKS,
      discoverSpacesUserSpecificMock,
      discoverSpacesDefaultMock,
      defaultLocationDetailsErrorMock,
    ])

    await waitFor(() =>
      expect(global.mockOpenToast).toHaveBeenCalledWith(
        'spaces.spaceListing.error',
        HoliToastType.ERROR,
        undefined,
        undefined
      )
    )
  })

  it('displays discover-spaces-view', async () => {
    renderDiscoverSpaces(MOCKS)

    expect(await screen.findByTestId('discover-spaces-header'))
  })
})

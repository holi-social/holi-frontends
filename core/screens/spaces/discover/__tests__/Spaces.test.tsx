import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import {
  authenticatedUserMock,
  defaultLocationDetailsMock,
  locationDetailsMock,
  mySpacesWithEmptyResultMock,
  skillsMock,
  topicsMock,
} from '@holi/core/screens/spaces/__tests__/mocks'
import { mySpaces } from '@holi/core/screens/spaces/__tests__/testData'
import Spaces from '@holi/core/screens/spaces/discover/Spaces'
import { discoverSpacesQuery } from '@holi/core/screens/spaces/discover/queries'
import { HoliToastType, ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

jest.mock('@holi/core/auth/helpers/useAuth', () => ({
  useAuth: () => ({ userId: '123' }),
  setUserLoggedOut: async () => {
    null
  },
}))

const mySpacesMock = { ...mySpacesWithEmptyResultMock, result: { data: { mySpaces } } }

const mySpacesErrorMock = { ...mySpacesWithEmptyResultMock, error: new Error('Test error') }

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
      discoverSpaces: [],
    },
  },
}

const MOCKS_WITH_MY_SPACES = [authenticatedUserMock, mySpacesMock, locationDetailsMock]
const MOCKS_WITHOUT_MY_SPACES = [
  authenticatedUserMock,
  mySpacesWithEmptyResultMock,
  locationDetailsMock,
  topicsMock,
  skillsMock,
  defaultLocationDetailsMock,
  discoverSpacesUserSpecificMock,
  discoverSpacesDefaultMock,
]

describe('Spaces screen', () => {
  const renderSpaces = (mocks: MockedResponse[]) =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ToastProvider>
          <Spaces />
        </ToastProvider>
      </MockedProvider>
    )

  it('displays loading screen while loading', async () => {
    renderSpaces(MOCKS_WITH_MY_SPACES)

    expect(await screen.findByText('spaces.spaceListing.loading'))
  })

  it('displays error toast if loading own spaces failed', async () => {
    renderSpaces([authenticatedUserMock, mySpacesErrorMock, locationDetailsMock])

    await waitFor(() => expect(global.mockOpenToast).toHaveBeenCalledWith('global.technicalError', HoliToastType.ERROR))
  })

  it('shows a tab navigation with open "mine"-tab, when user has any spaces (as MEMBER, FOLLOWER, CREATOR)', async () => {
    renderSpaces(MOCKS_WITH_MY_SPACES)

    expect(await screen.findByTestId('spaces-tab-navigation'))
  })

  it('shows discover-spaces-view, when user has no spaces', async () => {
    renderSpaces(MOCKS_WITHOUT_MY_SPACES)

    expect(await screen.findByTestId('discover-spaces-header'))
  })
})

import { MockedProvider, type MockedResponse } from '@apollo/client/testing'
import { act, render, screen, waitFor } from '@testing-library/react-native'
import React from 'react'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import {
  authenticatedUserMock,
  defaultLocationDetailsMock,
  locationDetailsMock,
  mySpacesWithEmptyResultMock,
} from '@holi/core/screens/spaces/__tests__/mocks'
import { mySpaces } from '@holi/core/screens/spaces/__tests__/testData'
import Spaces from '@holi/core/screens/spaces/discover/Spaces'
import { discoverSpacesDefaultTopicsV2, discoverSpacesQuery } from '@holi/core/screens/spaces/discover/queries'
import { HoliToastType, ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import type { LoggedInState } from '@holi/core/auth/hooks/useLoggedInUser'

const loginStateLoggedIn = {
  isLoading: false,
  isLoggedIn: true,
  isLoggedOut: false,
  user: { id: '123' },
} as LoggedInState

jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => loginStateLoggedIn,
}))

jest.mock('@holi/core/helpers/useLogout', () => ({
  useLogout: () => ({ logout: jest.fn() }),
}))

// prevent logging about incomplete apollo mocks,
// because we didn't flesh out the response data
global.console.error = jest.fn()
global.console.warn = jest.fn()

const mySpacesMock = { ...mySpacesWithEmptyResultMock, result: { data: { mySpaces } } }

const mySpacesErrorMock = { ...mySpacesWithEmptyResultMock, error: new HoliError('Test error') }

const defaultTopicsMock = {
  request: {
    query: discoverSpacesDefaultTopicsV2,
  },
  result: {
    data: {
      discoverSpacesDefaultTopicsV2: ['animal-welfare', 'housing'],
    },
  },
}

const discoverSpacesUserSpecificMock = {
  request: {
    query: discoverSpacesQuery,
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
    query: discoverSpacesQuery,
    variables: {
      topicsV2: ['animal-welfare'],
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
  defaultLocationDetailsMock,
  discoverSpacesUserSpecificMock,
  discoverSpacesDefaultMock,
  defaultTopicsMock,
]

describe('Spaces screen', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  const renderSpaces = (mocks: MockedResponse[]) =>
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <ToastProvider>
          <Spaces />
        </ToastProvider>
      </MockedProvider>
    )

  it('displays error toast if loading own spaces failed', async () => {
    renderSpaces([authenticatedUserMock, mySpacesErrorMock, locationDetailsMock])

    await waitFor(() =>
      expect(global.mockOpenToast).toHaveBeenCalledWith('global.technicalError', HoliToastType.ERROR, {})
    )
  })

  it('shows a tab navigation with open "mine"-tab, when user has any spaces (as MEMBER, FOLLOWER, CREATOR)', async () => {
    renderSpaces(MOCKS_WITH_MY_SPACES)

    expect(await screen.findByTestId('spaces-tab-navigation')).toBeOnTheScreen()
  })

  it('shows get-started-view, when user has no spaces', async () => {
    renderSpaces(MOCKS_WITHOUT_MY_SPACES)

    expect(await screen.findByTestId('get-started-view-header')).toBeOnTheScreen()
  })
})

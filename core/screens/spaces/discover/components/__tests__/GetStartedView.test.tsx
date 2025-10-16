import type { MockLink } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing/react'
import { cleanup, fireEvent, renderRouter } from 'expo-router/testing-library'
import React from 'react'
import { Text } from 'react-native'

import {
  authenticatedUserMock,
  defaultLocationDetailsMock,
  mySpacesWithEmptyResultMock,
} from '@holi/core/screens/spaces/__tests__/mocks'
import { spacesGroups } from '@holi/core/screens/spaces/__tests__/testData'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import GetStartedView from '@holi/core/screens/spaces/discover/components/GetStartedView'
import type { LoggedInState } from '@holi/core/auth/hooks/useLoggedInUser'
import { DiscoverSpacesDocument } from '@holi/api/graphql/graphql-codegen'

const loginStateLoggedIn = {
  isLoading: false,
  isLoggedIn: true,
  isLoggedOut: false,
  user: { id: '123' },
} as LoggedInState

jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: () => loginStateLoggedIn,
}))

const getStartedViewUserSpecificMock = {
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

const getStartedViewDefaultMock = {
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

const BASE_MOCKS = [authenticatedUserMock, mySpacesWithEmptyResultMock]
const MOCKS = [...BASE_MOCKS, defaultLocationDetailsMock, getStartedViewUserSpecificMock, getStartedViewDefaultMock]

// note: this test has been slimmed down since the component was refactored
//       feel free to add more tests again (see history)

const renderGetStartedView = (mocks: MockLink.MockedResponse[]) =>
  renderRouter({
    index: () => (
      <MockedProvider mocks={mocks}>
        <ToastProvider>
          <GetStartedView />
        </ToastProvider>
      </MockedProvider>
    ),
    'spaces/create': () => <Text>Create Space</Text>,
    'spaces/explore': () => <Text>Explore Spaces</Text>,
  })

describe('GetStartedView', () => {
  it('renders correctly', async () => {
    const { getByTestId } = renderGetStartedView(MOCKS)

    expect(getByTestId('get-started-view-header')).toHaveTextContent(/spaces.discover.welcome/)
    expect(getByTestId('get-started-view-header')).toHaveTextContent(/spaces.discover.description/)
  })

  it('renders create button correctly', async () => {
    const context = renderGetStartedView(MOCKS)
    const { queryAllByTestId } = context

    const createButtons = queryAllByTestId('get-started-view-create-button')
    expect(createButtons).toHaveLength(2)
    fireEvent.press(createButtons[0])
    expect(context).toHavePathname('/spaces/create')
  })

  it('renders explore button correctly', async () => {
    const context = renderGetStartedView(MOCKS)
    const { queryAllByTestId } = context

    const exploreButtons = queryAllByTestId('get-started-view-explore-button')
    expect(exploreButtons).toHaveLength(2)
    fireEvent.press(exploreButtons[0])
    expect(context).toHavePathname('/spaces/explore')
  })

  // solve act() wrap warning
  // https://github.com/testing-library/react-testing-library/issues/1216#issuecomment-1595684566
  afterEach(cleanup)
})

import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import Spaces from '@holi/core/screens/spaces/Spaces'
import { mySpaces } from '@holi/core/screens/spaces/components/__tests__/testData'
import { mySpaceQuery } from '@holi/core/screens/spaces/queries'
import UserContextProvider from '@holi/core/screens/userprofile/UserContextProvider'
import { authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'

jest.mock('@holi/core/auth/helpers/useAuth', () => ({
  useAuth: () => ({ userId: '123' }),
  setUserLoggedOut: async () => {
    null
  },
}))

const authenticatedUserRequest = {
  request: {
    query: authenticatedUserQuery,
    variables: {},
  },
  result: {
    data: {
      authenticatedUser: {
        id: '5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0',
        avatar: 'https://ik.imagekit.io/holidev/avatar/5dbeb15e-1fac-4292-96fc-9fbe2e6edbb0_eEx60YjuIa.jpg',
        fullName: 'EE. Visited',
        firstName: 'EE.',
        lastName: 'Visited',
        aboutMe: "I'm the User that is visited in E2E tests!",
        avatarDefaultColor: '#7571EC',
        avatarLabel: 'EV',
      },
    },
  },
}

const mySpacesRequestWithEmptyResult = {
  request: {
    query: mySpaceQuery,
    variables: {},
  },
  result: {
    data: {
      mySpaces: [],
    },
  },
}

const mySpacesRequestWithResult = { ...mySpacesRequestWithEmptyResult, result: { data: { mySpaces: mySpaces } } }

const MOCKS_WITH_MY_SPACES = [authenticatedUserRequest, mySpacesRequestWithResult]
const MOCKS_WITHOUT_MY_SPACES = [authenticatedUserRequest, mySpacesRequestWithEmptyResult]

describe('Spaces screen', () => {
  it('shows a tab navigation with open "mine"-tab, when user has any spaces (as MEMBER, FOLLOWER, CREATOR)', async () => {
    render(
      <MockedProvider mocks={MOCKS_WITH_MY_SPACES} addTypename={false}>
        <UserContextProvider>
          <Spaces />
        </UserContextProvider>
      </MockedProvider>
    )

    expect(await screen.findByTestId('spaces-tab-navigation'))
  })

  it('shows discover-spaces-view, when user has no spaces', async () => {
    render(
      <MockedProvider mocks={MOCKS_WITHOUT_MY_SPACES} addTypename={false}>
        <UserContextProvider>
          <Spaces />
        </UserContextProvider>
      </MockedProvider>
    )

    expect(await screen.findByTestId('discover-spaces-header'))
  })
})

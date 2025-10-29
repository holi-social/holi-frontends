import type { MockLink } from '@apollo/client/testing'
import { MockedProvider } from '@apollo/client/testing/react'
import { fireEvent, renderRouter, screen, waitFor, waitForElementToBeRemoved } from 'expo-router/testing-library'
import React from 'react'

import { createCache } from '@holi/api/graphql/client'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import SpaceInviteUserSearch from '@holi/core/screens/spaces/details/components/SpaceInviteUserSearch'
import { HoliToastType, ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import { UsersByNameWithSpaceConnectionDocument } from '@holi/api/graphql/graphql-codegen'

// prevent logging about incomplete apollo mocks,
// because we didn't flesh out the response data
global.console.error = jest.fn()
global.console.warn = jest.fn()

const spaceId = 'space1'
const createUser = (index: number) => ({
  id: `user${index}`,
  identity: `user${index}`,
  avatarDefaultColor: '#000000',
  avatarLabel: 'TU',
  fullName: `Test User ${index}`,
  connectionStatusToSpace: [],
  __typename: 'User',
})
const userSearchRequest = {
  query: UsersByNameWithSpaceConnectionDocument,
  variables: {
    substring: 'foobar',
    spaceId,
    offset: 0,
    limit: 10,
  },
}
const userSearchSuccessMock = {
  request: userSearchRequest,
  result: {
    data: {
      userByName: {
        totalResults: 1,
        data: [createUser(1)],
      },
    },
  },
}
const userSearchPage1Mock = {
  request: userSearchRequest,
  result: {
    data: {
      userByName: {
        totalResults: 11,
        data: Array.from({ length: 10 }, (_, index) => createUser(index)),
        __typename: 'UserPaged',
      },
    },
  },
}
const userSearchPage2Mock = {
  request: {
    ...userSearchRequest,
    variables: {
      ...userSearchRequest.variables,
      offset: 10,
    },
  },
  result: {
    data: {
      userByName: {
        totalResults: 11,
        data: [createUser(10)],
        __typename: 'UserPaged',
      },
    },
  },
}
const userSearchErrorMock = {
  request: userSearchRequest,
  error: new HoliError('Test error'),
}

const renderComponent = ({
  mocks = [userSearchSuccessMock],
  searchValue = 'foobar',
}: {
  mocks?: MockLink.MockedResponse[]
  searchValue?: string
} = {}) =>
  renderRouter({
    index: () => (
      <ToastProvider>
        <MockedProvider mocks={mocks} cache={createCache()}>
          <SpaceInviteUserSearch spaceId={spaceId} searchValue={searchValue} onInviteHandled={jest.fn()} />
        </MockedProvider>
      </ToastProvider>
    ),
  })

describe('SpaceInviteUserSearch', () => {
  //todo anyone: implement test
  it.skip('paginates search results', async () => {
    renderComponent({ mocks: [userSearchPage1Mock, userSearchPage2Mock] })

    // Expect results
    await waitFor(() => screen.findByText('Test User 1'))

    // Expect button to fetch more
    expect(screen.findByText('global.seeMore'))

    // Fetch next page
    fireEvent.press(screen.getByTestId('btn-fetch-more'))
    await waitForElementToBeRemoved(() => screen.getByText('global.loading'))

    // Expect results
    expect(screen.findByText('Test User 10'))

    // Do not expect button to fetch more
    expect(screen.queryByTestId('btn-fetch-more')).toBeFalsy()
  })

  it('displays loader if search input is empty', async () => {
    renderComponent({ searchValue: '' })

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
  })

  it('handles error during user search', async () => {
    renderComponent({ mocks: [userSearchErrorMock] })

    await waitFor(() => expect(global.mockOpenToast).toHaveBeenCalled())

    expect(global.mockOpenToast).toHaveBeenCalledWith('global.technicalError', HoliToastType.ERROR, {})
  })
})

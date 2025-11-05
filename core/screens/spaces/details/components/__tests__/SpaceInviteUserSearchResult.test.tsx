import { MockedProvider } from '@apollo/client/testing/react'
import { screen } from '@testing-library/react-native'
import { renderRouter } from 'expo-router/testing-library'
import React from 'react'

import type { User } from '@holi/core/domain/shared/types'
import { PaginationContext } from '@holi/core/pagination/Pagination'
import SpaceInviteUserSearchResult from '@holi/core/screens/spaces/details/components/SpaceInviteUserSearchResult'
import { UserConnectionStatus } from '@holi/core/screens/userprofile/types'
import { SpaceUserConnectionType } from '@holi/api/graphql/graphql-codegen'

const spaceId = 'space1'
const onInviteHandled = jest.fn()
const createUser = (props: Partial<User>): User => ({
  id: '',
  identity: '',
  avatarDefaultColor: '#000000',
  avatarLabel: '',
  fullName: '',
  ...props,
})
const users: User[] = [
  createUser({ id: 'user1', fullName: 'No Connection' }),
  createUser({ id: 'user2', fullName: 'Connected', connectionStatusToMyself: UserConnectionStatus.CONNECTED }),
  createUser({
    id: 'user3',
    fullName: 'Connected and Space connection',
    connectionStatusToMyself: UserConnectionStatus.CONNECTED,
    connectionStatusToSpace: [SpaceUserConnectionType.Member],
  }),
  createUser({
    id: 'user4',
    fullName: 'Follower',
    connectionStatusToSpace: [SpaceUserConnectionType.Follower],
  }),
  createUser({
    id: 'user5',
    fullName: 'Member',
    connectionStatusToSpace: [SpaceUserConnectionType.Member, SpaceUserConnectionType.Follower],
  }),
  createUser({
    id: 'user6',
    fullName: 'Admin',
    connectionStatusToSpace: [SpaceUserConnectionType.Member, SpaceUserConnectionType.Administrator],
  }),
]

describe('SpaceInviteUserSearchResult', () => {
  it('displays loading while loading', () => {
    renderRouter({
      index: () => (
        <PaginationContext.Provider
          value={{
            loading: true,
            data: [],
            totalResults: 0,
          }}
        >
          <SpaceInviteUserSearchResult spaceId={spaceId} onInviteHandled={onInviteHandled} />
        </PaginationContext.Provider>
      ),
    })
    expect(screen.getByTestId('loader')).toBeOnTheScreen()
  })

  it('displays text if no results where found', () => {
    renderRouter({
      index: () => (
        <PaginationContext.Provider
          value={{
            loading: false,
            data: [],
            totalResults: 0,
          }}
        >
          <SpaceInviteUserSearchResult spaceId={spaceId} onInviteHandled={onInviteHandled} />
        </PaginationContext.Provider>
      ),
    })
    expect(screen.getByText('spaces.invite.user.notFound')).toBeOnTheScreen()
  })

  it('displays user with space and user connections', () => {
    renderRouter({
      index: () => (
        <MockedProvider>
          <PaginationContext.Provider
            value={{
              loading: false,
              data: users,
              totalResults: users.length,
            }}
          >
            <SpaceInviteUserSearchResult spaceId={spaceId} onInviteHandled={onInviteHandled} />
          </PaginationContext.Provider>
        </MockedProvider>
      ),
    })
    expect(screen.getAllByTestId('user-list-item')).toHaveLength(users.length)
  })
})

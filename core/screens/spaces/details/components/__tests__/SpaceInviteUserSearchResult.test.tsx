import { MockedProvider } from '@apollo/client/testing'
import { render } from '@testing-library/react-native'
import React from 'react'

import { PaginationContext } from '@holi/core/pagination/Pagination'
import SpaceInviteUserSearchResult from '@holi/core/screens/spaces/details/components/SpaceInviteUserSearchResult'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import { User, UserConnectionStatus } from '@holi/core/screens/userprofile/types'

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
    connectionStatusToSpace: [SpaceConnectionType.MEMBER],
  }),
  createUser({
    id: 'user4',
    fullName: 'Follower',
    connectionStatusToSpace: [SpaceConnectionType.FOLLOWER],
  }),
  createUser({
    id: 'user5',
    fullName: 'Member',
    connectionStatusToSpace: [SpaceConnectionType.MEMBER, SpaceConnectionType.FOLLOWER],
  }),
  createUser({
    id: 'user6',
    fullName: 'Admin',
    connectionStatusToSpace: [SpaceConnectionType.MEMBER, SpaceConnectionType.ADMINISTRATOR],
  }),
]

describe('SpaceInviteUserSearchResult', () => {
  it('displays loading while loading', () => {
    const { toJSON } = render(
      <PaginationContext.Provider
        value={{
          loading: true,
          data: [],
          totalResults: 0,
        }}
      >
        <SpaceInviteUserSearchResult spaceId={spaceId} onInviteHandled={onInviteHandled} />
      </PaginationContext.Provider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('displays text if no results where found', () => {
    const { toJSON } = render(
      <PaginationContext.Provider
        value={{
          loading: false,
          data: [],
          totalResults: 0,
        }}
      >
        <SpaceInviteUserSearchResult spaceId={spaceId} onInviteHandled={onInviteHandled} />
      </PaginationContext.Provider>
    )
    expect(toJSON()).toMatchSnapshot()
  })

  it('displays user with space and user connections', () => {
    const { toJSON } = render(
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
    )
    expect(toJSON()).toMatchSnapshot()
  })
})

import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { PaginationContext } from '@holi/core/pagination/Pagination'
import { pagedInvites, space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceInvitesList from '@holi/core/screens/spaces/details/components/SpaceInvitesList'

describe('SpaceInvitesList', () => {
  it('renders correctly if there are no pending invites', () => {
    const paginationContext = {
      loading: false,
      data: [],
      totalResults: 0,
    }
    render(
      <PaginationContext.Provider value={paginationContext}>
        <SpaceInvitesList space={space} />
      </PaginationContext.Provider>
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when there are pending invites', () => {
    const paginationContext = {
      loading: false,
      ...pagedInvites,
    }
    render(
      <MockedProvider>
        <PaginationContext.Provider value={paginationContext}>
          <SpaceInvitesList space={space} />
        </PaginationContext.Provider>
      </MockedProvider>
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })
})

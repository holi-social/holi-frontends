import { MockedProvider } from '@apollo/client/testing/react'
import { renderRouter, screen, waitFor } from 'expo-router/testing-library'
import React from 'react'

import { PaginationContext } from '@holi/core/pagination/Pagination'
import { pagedMembershipRequests, space } from '@holi/core/screens/spaces/__tests__/testData'
import SpacePendingRequestsList from '@holi/core/screens/spaces/details/components/SpacePendingRequestsList'

describe('SpacePendingRequestsList', () => {
  it('renders correctly if there are no pending requests', () => {
    const paginationContext = {
      loading: false,
      data: [],
      totalResults: 0,
    }
    renderRouter({
      index: () => (
        <MockedProvider>
          <PaginationContext.Provider value={paginationContext}>
            <SpacePendingRequestsList space={space} />
          </PaginationContext.Provider>
        </MockedProvider>
      ),
    })
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when there are pending requests', () => {
    const paginationContext = {
      loading: false,
      ...pagedMembershipRequests,
    }
    renderRouter({
      index: () => (
        <MockedProvider>
          <PaginationContext.Provider value={paginationContext}>
            <SpacePendingRequestsList space={space} />
          </PaginationContext.Provider>
        </MockedProvider>
      ),
    })
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('opens the modal for an initially selected user', async () => {
    const paginationContext = {
      loading: false,
      ...pagedMembershipRequests,
    }
    renderRouter({
      index: () => (
        <MockedProvider>
          <PaginationContext.Provider value={paginationContext}>
            <SpacePendingRequestsList space={space} initiallySelectedUserId="requesting-user-1" />
          </PaginationContext.Provider>
        </MockedProvider>
      ),
    })
    await waitFor(() => screen.getByTestId('space-collaborators-permissions-modal-backdrop'))
  })

  it('does not open the modal for an unknown user', () => {
    const paginationContext = {
      loading: false,
      ...pagedMembershipRequests,
    }
    renderRouter({
      index: () => (
        <MockedProvider>
          <PaginationContext.Provider value={paginationContext}>
            <SpacePendingRequestsList space={space} initiallySelectedUserId="unknown-user" />
          </PaginationContext.Provider>
        </MockedProvider>
      ),
    })
    expect(screen.queryByTestId('space-collaborators-permissions-modal-backdrop')).toBeFalsy()
  })
})

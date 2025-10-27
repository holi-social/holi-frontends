import { MockedProvider } from '@apollo/client/testing'
import { renderRouter, screen } from 'expo-router/testing-library'
import React from 'react'

import { pagedMembershipRequests, space } from '@holi/core/screens/spaces/__tests__/testData'
import SpacePendingRequestItem from '@holi/core/screens/spaces/details/components/SpacePendingRequestItem'

describe('SpacePendingRequestItem', () => {
  const membershipRequest = pagedMembershipRequests.data[0]

  it('renders correctly', () => {
    renderRouter({
      index: () => (
        <MockedProvider>
          <SpacePendingRequestItem space={space} membershipRequest={membershipRequest} />
        </MockedProvider>
      ),
    })
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when the modal is initially open', () => {
    renderRouter({
      index: () => (
        <MockedProvider>
          <SpacePendingRequestItem space={space} membershipRequest={membershipRequest} initiallyOpen={true} />
        </MockedProvider>
      ),
    })
    expect(screen.toJSON()).toMatchSnapshot()
  })
})

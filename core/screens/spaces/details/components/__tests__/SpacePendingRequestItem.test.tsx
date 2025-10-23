import { MockedProvider } from '@apollo/client/testing/react'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { pagedMembershipRequests, space } from '@holi/core/screens/spaces/__tests__/testData'
import SpacePendingRequestItem from '@holi/core/screens/spaces/details/components/SpacePendingRequestItem'

describe('SpacePendingRequestItem', () => {
  const membershipRequest = pagedMembershipRequests.data[0]

  it('renders correctly', () => {
    render(
      <MockedProvider>
        <SpacePendingRequestItem space={space} membershipRequest={membershipRequest} />
      </MockedProvider>
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly when the modal is initially open', () => {
    render(
      <MockedProvider>
        <SpacePendingRequestItem space={space} membershipRequest={membershipRequest} initiallyOpen={true} />
      </MockedProvider>
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })
})

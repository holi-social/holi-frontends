import { MockedProvider } from '@apollo/client/testing'
import { act, render, screen } from '@testing-library/react-native'
import React from 'react'

import { pagedInvites, space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceInviteItem from '@holi/core/screens/spaces/details/components/SpaceInviteItem'

describe('SpaceInviteItem', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })
  afterEach(async () => {
    await act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  const invite = pagedInvites.data[0]

  it('renders correctly', () => {
    render(
      <MockedProvider>
        <SpaceInviteItem space={space} invitedUser={invite.invitedUser} />
      </MockedProvider>
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })
})

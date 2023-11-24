import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { pagedInvites, space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceInviteItem from '@holi/core/screens/spaces/details/components/SpaceInviteItem'

jest.useFakeTimers()

describe('SpaceInviteItem', () => {
  const invite = pagedInvites.data[0]

  it('renders correctly', () => {
    render(
      <MockedProvider>
        <SpaceInviteItem space={space} invite={invite} />
      </MockedProvider>
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })
})

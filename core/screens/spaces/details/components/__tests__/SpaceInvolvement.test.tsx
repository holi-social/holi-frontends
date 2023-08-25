import { MockedProvider } from '@apollo/client/testing'
import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceInvolvement from '@holi/core/screens/spaces/details/components/SpaceInvolvement'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'

describe('SpaceInvolvement', () => {
  it('renders correctly for the public', () => {
    render(
      <MockedProvider>
        <SpaceInvolvement space={space} />
      </MockedProvider>
    )
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly for collaborators', () => {
    const spaceForMember = {
      ...space,
      connectionStatusToMyself: [SpaceConnectionType.MEMBER],
    }
    render(
      <MockedProvider>
        <SpaceInvolvement space={spaceForMember} />
      </MockedProvider>
    )
    expect(screen.toJSON()).toHaveTextContent('spaces.storage.title')
  })
})

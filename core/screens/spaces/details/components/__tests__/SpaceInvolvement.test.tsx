import { MockedProvider } from '@apollo/client/testing'
import React from 'react'
import renderer from 'react-test-renderer'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceInvolvement from '@holi/core/screens/spaces/details/components/SpaceInvolvement'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'

describe('SpaceInvolvement', () => {
  it('renders correctly for the public', () => {
    const tree = renderer
      .create(
        <MockedProvider>
          <SpaceInvolvement space={space} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly for collaborators', () => {
    const spaceForMember = {
      ...space,
      connectionStatusToMyself: [SpaceConnectionType.MEMBER],
    }
    const tree = renderer
      .create(
        <MockedProvider>
          <SpaceInvolvement space={spaceForMember} />
        </MockedProvider>
      )
      .toJSON()
    expect(tree).toHaveTextContent('spaces.storage.title')
  })
})

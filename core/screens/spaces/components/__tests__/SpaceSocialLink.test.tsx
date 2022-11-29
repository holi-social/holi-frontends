import React from 'react'
import renderer from 'react-test-renderer'

import SpaceSocialLink from '@holi/core/screens/spaces/components/SpaceSocialLink'
import { SpaceLink, SpaceLinkType } from '@holi/core/screens/spaces/types'

describe('SpaceSocialLink', () => {
  it('renders correctly when type is different than OTHER', () => {
    const link: SpaceLink = {
      url: 'www.facebook.com',
      type: SpaceLinkType.FACEBOOK,
    }

    const tree = renderer.create(<SpaceSocialLink link={link} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly when type is OTHER', () => {
    const link: SpaceLink = {
      url: 'www.google.com',
      type: SpaceLinkType.OTHER,
    }

    const tree = renderer.create(<SpaceSocialLink link={link} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

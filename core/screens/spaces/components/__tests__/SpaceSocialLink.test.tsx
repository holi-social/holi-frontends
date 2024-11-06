import { render, screen } from '@testing-library/react-native'
import React from 'react'

import SpacePublicLink from '@holi/core/screens/spaces/components/SpacePublicLink'
import { SpaceLink, SpaceLinkType } from '@holi/core/screens/spaces/types'

describe('SpacePublicLink', () => {
  it('renders correctly when type is different than OTHER', () => {
    const link: SpaceLink = {
      id: '123',
      name: 'facebook',
      url: 'www.facebook.com',
      type: SpaceLinkType.FACEBOOK,
    }

    render(<SpacePublicLink link={link} />)
    expect(screen).toMatchSnapshot()
  })

  it('renders correctly when type is OTHER', () => {
    const link: SpaceLink = {
      id: '456',
      name: 'google',
      url: 'www.google.com',
      type: SpaceLinkType.OTHER,
    }

    render(<SpacePublicLink link={link} />)
    expect(screen).toMatchSnapshot()
  })
})

import { render, screen } from '@testing-library/react-native'
import React from 'react'

import SpacePublicLink from '@holi/core/screens/spaces/components/SpacePublicLink'
import { type ExternalLink, ExternalLinkType } from '@holi/api/graphql/graphql-codegen'

describe('SpacePublicLink', () => {
  it('renders correctly when type is different than OTHER', () => {
    const link: ExternalLink = {
      id: '123',
      name: 'facebook',
      url: 'www.facebook.com',
      type: ExternalLinkType.Facebook,
    }

    render(<SpacePublicLink link={link} />)
    expect(screen).toMatchSnapshot()
  })

  it('renders correctly when type is OTHER', () => {
    const link: ExternalLink = {
      id: '456',
      name: 'google',
      url: 'www.google.com',
      type: ExternalLinkType.Other,
    }

    render(<SpacePublicLink link={link} />)
    expect(screen).toMatchSnapshot()
  })
})

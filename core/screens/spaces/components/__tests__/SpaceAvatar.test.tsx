import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'

describe('React tree', () => {
  it('renders correctly', () => {
    const avatar = 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg'
    render(<SpaceAvatar space={{ ...space, avatar }} />)
    expect(screen).toMatchSnapshot()
  })

  it('renders initials with colored background, when given image prop is empty', () => {
    render(<SpaceAvatar space={space} />)
    expect(screen).toMatchSnapshot()
  })
})

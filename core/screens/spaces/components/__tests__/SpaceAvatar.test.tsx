import React from 'react'
import renderer from 'react-test-renderer'

import { space } from '@holi/core/screens/spaces/__tests__/testData'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'

describe('React tree', () => {
  it('renders correctly', () => {
    const avatar = 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg'
    const tree = renderer.create(<SpaceAvatar space={{ ...space, avatar }} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders initials with colored background, when given image prop is empty', () => {
    const tree = renderer.create(<SpaceAvatar space={space} />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

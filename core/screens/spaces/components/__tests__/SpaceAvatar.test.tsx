import React from 'react'
import renderer from 'react-test-renderer'

import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'

describe('React tree', () => {
  it('renders correctly', () => {
    const imageUrl = 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg'
    const tree = renderer.create(<SpaceAvatar label="Communal Cooking by XR" imageSrc={imageUrl} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders default grey background, when given image prop is empty', () => {
    const tree = renderer.create(<SpaceAvatar label="Communcal Cooking by XR" />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

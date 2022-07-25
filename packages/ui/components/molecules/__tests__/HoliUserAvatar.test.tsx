import React from 'react'
import renderer from 'react-test-renderer'

import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'

describe('React tree', () => {
  it('renders correctly', () => {
    const imageUrl = 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg'
    const tree = renderer
      .create(
        <HoliUserAvatar
          nameLabel="Uschi Meyer"
          imageSrc={imageUrl}
          initials="UM"
          defaultColor="red"
          size="extralarge"
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders the users initials, when given image prop is empty', () => {
    const tree = renderer
      .create(
        <HoliUserAvatar
          nameLabel="Uschi Meyer"
          imageSrc={undefined}
          defaultColor="red"
          initials="UM"
          size="extralarge"
        />
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

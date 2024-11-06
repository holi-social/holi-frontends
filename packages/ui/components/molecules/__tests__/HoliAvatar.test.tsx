import { render, screen } from '@testing-library/react-native'
import React from 'react'

import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'

describe('React tree', () => {
  it('renders correctly', () => {
    const imageUrl = 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg'
    render(<HoliAvatar label="Uschi Meyer" imageSrc={imageUrl} initials="UM" defaultColor="red" size="extralarge" />)
    expect(screen).toMatchSnapshot()
  })

  it('renders the users initials, when given image prop is empty', () => {
    render(<HoliAvatar label="Uschi Meyer" imageSrc={undefined} defaultColor="red" initials="UM" size="extralarge" />)
    expect(screen).toMatchSnapshot()
  })
})

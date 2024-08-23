import { render, screen } from '@testing-library/react-native'
import React from 'react'

import { User } from '@holi/core/domain/shared/types'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'

const user: User = {
  id: '1',
  fullName: 'Dima Rosmait',
  firstName: 'Dima',
  lastName: 'Rosmait',
  avatarLabel: 'D',
  avatarDefaultColor: 'green',
  avatar: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
  aboutMe: 'aboutMe',
  identity: 'dima',
}

describe('HoliUserCard', () => {
  it('renders correctly', () => {
    render(<HoliUserCard user={user} />)
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('renders correctly with small variant', () => {
    render(<HoliUserCard user={user} variant="small" />).toJSON()
    expect(screen.toJSON()).toMatchSnapshot()
  })

  it('has a category chip if category prop is present', () => {
    const category = 'testCategory'
    const { getByText } = render(<HoliUserCard user={user} category={category} />)

    expect(getByText(category)).not.toBeNull()
  })
})

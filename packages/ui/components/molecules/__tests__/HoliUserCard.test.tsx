import { render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { User } from '@holi/core/screens/userprofile/types'
import HoliUserCard from '@holi/ui/components/molecules/HoliUserCard'

const user: User = {
  id: '1',
  fullName: 'Dima Rosmait',
  firstName: 'Dima',
  lastName: 'Rosmait',
  avatarLabel: 'D',
  avatarDefaultColor: 'green',
  avatar: 'avatar-1',
}

describe('HoliUserCard', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<HoliUserCard user={user} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('renders correctly with small variant', () => {
    const tree = renderer.create(<HoliUserCard user={user} variant="small" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('has a category chip if category prop is present', () => {
    const category = 'testCategory'
    const { getByText } = render(<HoliUserCard user={user} category={category} />)

    expect(getByText(category)).not.toBeNull()
  })
})

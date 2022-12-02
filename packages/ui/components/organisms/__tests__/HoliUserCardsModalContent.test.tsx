import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { User } from '@holi/core/screens/userprofile/types'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'

const users: User[] = [
  {
    id: '1',
    fullName: 'Dima Rosmait',
    firstName: 'Dima',
    lastName: 'Rosmait',
    avatarLabel: 'D',
    avatarDefaultColor: 'green',
    avatar: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
  },
  {
    id: '2',
    fullName: 'Max Mustermann',
    firstName: 'Max',
    lastName: 'Mustermann',
    avatarLabel: 'M',
    avatarDefaultColor: 'red',
  },
  {
    id: '3',
    fullName: 'Thomas Mueller',
    firstName: 'Thomas',
    lastName: 'Mueller',
    avatarLabel: 'T',
    avatarDefaultColor: 'blue',
    avatar: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
  },
  {
    id: '4',
    fullName: 'Sandra Kasandra',
    firstName: 'Sandra',
    lastName: 'Kasandra',
    avatarLabel: 'S',
    avatarDefaultColor: 'yellow',
  },
  {
    id: '5',
    fullName: 'Peter Pan',
    firstName: 'Peter',
    lastName: 'Pan',
    avatarLabel: 'P',
    avatarDefaultColor: 'grey',
    avatar: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
  },
  {
    id: '6',
    fullName: 'Donald Duck',
    firstName: 'Donald',
    lastName: 'Duck',
    avatarLabel: 'D',
    avatarDefaultColor: 'purple',
  },
  {
    id: '7',
    fullName: 'Lionel Messi',
    firstName: 'Lionel',
    lastName: 'Messi',
    avatarLabel: 'L',
    avatarDefaultColor: 'black',
    avatar: 'https://bilder.fernsehserien.de/gfx/pics/1200/Donald-Duck-2.jpg.jpg',
  },
]

describe('HoliUserCardsModalContent', () => {
  it('renders correct snapshot', () => {
    const tree = renderer.create(<HoliUserCardsModalContent users={users} onDismiss={() => 'test'} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('has correct number of user cards', () => {
    const { getAllByTestId } = render(<HoliUserCardsModalContent users={users} onDismiss={() => 'test'} />)

    expect(getAllByTestId('user-card').length).toEqual(users.length)
  })

  it('has close button and onDismiss is triggered upon press', () => {
    const mockFn = jest.fn()
    const { getByTestId } = render(<HoliUserCardsModalContent users={users} onDismiss={mockFn} testID="userModal" />)

    fireEvent.press(getByTestId('userModal-close-btn'))
    expect(mockFn).toBeCalledTimes(1)
  })
})

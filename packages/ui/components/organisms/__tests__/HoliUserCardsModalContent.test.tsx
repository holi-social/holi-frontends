import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { User } from '@holi/core/screens/userprofile/types'
import HoliUserCardsModalContent from '@holi/ui/components/organisms/HoliUserCardsModalContent'

const users: User[] = [
  {
    id: '1',
    firstName: 'Dima',
    lastName: 'Rosmait',
    avatarLabel: 'D',
    avatarDefaultColor: 'green',
    avatar: 'avatar-1',
  },
  {
    id: '2',
    firstName: 'Max',
    lastName: 'Mustermann',
    avatarLabel: 'M',
    avatarDefaultColor: 'red',
  },
  {
    id: '3',
    firstName: 'Thomas',
    lastName: 'Mueller',
    avatarLabel: 'T',
    avatarDefaultColor: 'blue',
    avatar: 'avatar-2',
  },
  {
    id: '4',
    firstName: 'Sandra',
    lastName: 'Kasandra',
    avatarLabel: 'S',
    avatarDefaultColor: 'yellow',
  },
  {
    id: '5',
    firstName: 'Peter',
    lastName: 'Pan',
    avatarLabel: 'P',
    avatarDefaultColor: 'grey',
    avatar: 'avatar-3',
  },
  {
    id: '6',
    firstName: 'Donald',
    lastName: 'Duck',
    avatarLabel: 'D',
    avatarDefaultColor: 'purple',
  },
  {
    id: '7',
    firstName: 'Lionel',
    lastName: 'Messi',
    avatarLabel: 'L',
    avatarDefaultColor: 'black',
    avatar: 'avatar-4',
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
    const { getByTestId } = render(<HoliUserCardsModalContent users={users} onDismiss={mockFn} />)

    fireEvent.press(getByTestId('user-cards-modal-content-close'))
    expect(mockFn).toBeCalledTimes(1)
  })
})

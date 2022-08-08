import { render } from '@testing-library/react-native'
import React from 'react'
import renderer from 'react-test-renderer'

import { User } from '@holi/core/screens/userprofile/types'
import HoliUserAvatarPileWithModal from '@holi/ui/components/organisms/HoliUserAvatarPileWithModal'

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

describe('HoliUserAvatarPileWithModal', () => {
  it('renders correct snapshot', () => {
    const tree = renderer.create(<HoliUserAvatarPileWithModal users={users} modalTitle="test" />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('has limited avatars count', () => {
    const { getAllByTestId } = render(
      <HoliUserAvatarPileWithModal users={users} modalTitle="test title" usersToShow={3} />
    )

    expect(getAllByTestId('pile-avatar').length).toEqual(3)
  })

  it('has button to open modal', () => {
    const { getByTestId } = render(<HoliUserAvatarPileWithModal users={users} modalTitle="test" />)
    expect(getByTestId('avatar-pile-open-modal-button')).not.toBeNull()
  })

  it('has a top tile if prop inlineAvatarsTitle is false', () => {
    const { getByTestId } = render(<HoliUserAvatarPileWithModal users={users} modalTitle="test" />)
    expect(getByTestId('avatars-top-title')).not.toBeNull()
  })

  it('has no top tile if prop inlineAvatarsTitle is true', async () => {
    const { queryByTestId } = render(<HoliUserAvatarPileWithModal users={users} modalTitle="test" inlineAvatarsTitle />)
    const topModalTitle = await queryByTestId('avatars-top-title')
    expect(topModalTitle).toBeNull()
  })
})

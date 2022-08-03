import { faker } from '@faker-js/faker'
import { render } from '@testing-library/react-native'
import React from 'react'
import { Text, View } from 'react-native'
import renderer from 'react-test-renderer'

import i18next from '@holi/core/i18n'
import { User } from '@holi/core/screens/userprofile/types'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'

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

describe('HoliUserAvatarPile.tsx', () => {
  it('renders correct snapshot', () => {
    const tree = renderer.create(<HoliUserAvatarPile users={users} />).toJSON()
    expect(tree).toMatchSnapshot()
  })

  it('has limited avatars count', () => {
    const { getAllByTestId } = render(<HoliUserAvatarPile users={users} usersToShow={3} />)

    expect(getAllByTestId('pile-avatar').length).toEqual(3)
  })

  it('has optional counter text in the end', () => {
    const { getByText } = render(<HoliUserAvatarPile users={users} counter />)

    expect(getByText(i18next.t('topics.contributors.discussing', { count: users.length }))).not.toBeNull()
  })

  it('has optional children of counter text', () => {
    const dummyText = faker.lorem.sentence()
    const { getByText } = render(
      <HoliUserAvatarPile users={users} counter>
        <View>
          <Text>{dummyText}</Text>
        </View>
      </HoliUserAvatarPile>
    )

    expect(getByText(dummyText)).not.toBeNull()
  })
})

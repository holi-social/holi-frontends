import { faker } from '@faker-js/faker'
import { render, screen } from 'expo-router/testing-library'
import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'
import { View } from 'react-native'

import i18next from '@holi/core/i18n'
import HoliUserAvatarPile from '@holi/ui/components/organisms/HoliUserAvatarPile'
import { users } from '@holi/ui/components/organisms/__mocks__/users'
import theme from '@holi/ui/styles/theme'

describe('HoliUserAvatarPile', () => {
  it('renders correct snapshot', () => {
    render(<HoliUserAvatarPile users={users} />)
    expect(screen).toMatchSnapshot()
  })

  it('has limited avatars count', () => {
    render(<HoliUserAvatarPile users={users} usersToShow={3} />)

    expect(screen.getAllByTestId('pile-avatar').length).toEqual(3)
  })

  it('has optional counter text in the end', () => {
    render(<HoliUserAvatarPile users={users} counter />)

    expect(screen.getByText(i18next.t('insights.editors.discussing', { count: users.length }))).not.toBeNull()
  })

  it('has optional children of counter text', () => {
    const dummyText = faker.lorem.sentence()
    render(
      <HoliUserAvatarPile users={users} counter>
        <View>
          <Text>{dummyText}</Text>
        </View>
      </HoliUserAvatarPile>
    )

    expect(screen.getByText(dummyText)).not.toBeNull()
  })

  it('should display with rounded background', () => {
    render(<HoliUserAvatarPile users={users} counter hasBackground />)

    expect(screen.getByTestId('holi-user-avatar-pile')).toHaveStyle({
      paddingVertical: 4,
      paddingLeft: 4,
      paddingRight: 8,
      backgroundColor: theme.colors.background10,
      borderRadius: 100,
    })
  })
})
